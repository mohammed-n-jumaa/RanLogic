<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\ChatNotification;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Database\QueryException;

class ChatService
{
    /**
     * الحصول على قائمة المحادثات للأدمن
     */
    public function getConversationsForAdmin(int $adminId, ?string $search = null)
{
    $query = Conversation::with(['trainee'])
        ->where('admin_id', $adminId)
        ->orderBy('last_message_at', 'desc');

    if ($search) {
        $query->whereHas('trainee', function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }

    $conversations = $query->get();

    return $conversations->map(function ($conversation) {
        $trainee = $conversation->trainee;

        // ✅ آمن: قد لا يكون لديك عمود avatar أصلاً
        $avatarPath = null;
        if ($trainee) {
            // جرّب أكثر من اسم حقل محتمل بدون ما يكسر
            $possible = [
                $trainee->avatar ?? null,
                $trainee->image ?? null,
                $trainee->profile_image ?? null,
                $trainee->photo ?? null,
            ];
            foreach ($possible as $p) {
                if (!empty($p)) {
                    $avatarPath = $p;
                    break;
                }
            }
        }

        return [
            'id' => $conversation->id,
            'trainee_id' => $conversation->trainee_id,
            'last_message' => $conversation->last_message,
            'last_message_time' => $conversation->last_message_at
                ? Carbon::parse($conversation->last_message_at)->format('H:i')
                : null,
            'unread_count' => (int) $conversation->admin_unread_count,
            'status' => $conversation->status,
            'is_online' => false,

            'client' => $trainee ? [
                'id' => $trainee->id,
                'name' => $trainee->name,
                'email' => $trainee->email,
                'image' => $avatarPath ? asset('storage/' . $avatarPath) : null,
                'goal' => $this->translateGoal($trainee->goal ?? null),
                'status' => !empty($trainee->has_active_subscription) ? 'active' : 'expired',
            ] : null,
        ];
    });
}


    /**
     * الحصول على محادثة مع رسائلها
     */
    public function getConversation(int $adminId, int $traineeId)
{
    // ✅ جلب المحادثة بدون firstOrCreate (عشان ما يصير Duplicate entry 1062)
    $conversation = Conversation::where('admin_id', $adminId)
        ->where('trainee_id', $traineeId)
        ->first();

    if (!$conversation) {
        try {
            $conversation = Conversation::create([
                'admin_id' => $adminId,
                'trainee_id' => $traineeId,
                'status' => 'active',
                'admin_unread_count' => 0,
                'trainee_unread_count' => 0,
            ]);
        } catch (QueryException $e) {
            // لو صار سباق (race) وانعملت بنفس اللحظة من طلب ثاني
            $conversation = Conversation::where('admin_id', $adminId)
                ->where('trainee_id', $traineeId)
                ->first();

            if (!$conversation) {
                throw $e;
            }
        }
    }

    // ✅ جلب الرسائل بنفس الفورمات القديم (type + file_url ...)
    $messages = Message::where('conversation_id', $conversation->id)
        ->orderBy('created_at', 'asc')
        ->get()
        ->map(function ($message) {
            return [
                'id' => $message->id,

                // ✅ مهم: نخليها trainer/user عشان صفحة المتدرب تقرأها
                'sender' => $message->sender_type === 'admin' ? 'trainer' : 'user',

                'type' => $message->message_type,
                'content' => $message->content,

                // ✅ هذا اللي يخلّي الصورة تظهر (img src)
                'file_url' => $message->file_path ? asset('storage/' . $message->file_path) : null,

                'file_name' => $message->file_name,
                'file_size' => $message->file_size ? $this->formatFileSize($message->file_size) : null,

                'timestamp' => Carbon::parse($message->created_at)->format('H:i'),
                'date' => Carbon::parse($message->created_at)->format('Y-m-d'),

                'is_read' => (bool) $message->is_read,
                'status' => $message->is_read ? 'read' : 'delivered',
            ];
        });

    // جلب معلومات المتدرب
    $trainee = User::find($traineeId);

    // ✅ تحديث عداد الرسائل غير المقروءة للأدمن (زي ما عندك)
    $this->markMessagesAsReadForAdmin($conversation);

    return [
        'conversation' => [
            'id' => $conversation->id,
            'status' => $conversation->status,
        ],
        'messages' => $messages,
        'trainee' => $trainee ? [
            'id' => $trainee->id,
            'name' => $trainee->name,
            'email' => $trainee->email,
            'phone' => $trainee->phone,
            'avatar' => $trainee->avatar ? asset('storage/' . $trainee->avatar) : null,
            'goal' => $this->translateGoal($trainee->goal),
            'weight' => $trainee->weight ? $trainee->weight . ' كجم' : null,
            'height' => $trainee->height ? $trainee->height . ' سم' : null,
            'age' => $trainee->age,
            'is_online' => false,
            'last_seen' => 'غير متصل',
        ] : null,
    ];
}

    /**
     * إرسال رسالة نصية
     */
    public function sendTextMessage(int $adminId, int $traineeId, string $content)
    {
        $conversation = Conversation::firstOrCreate(
            [
                'admin_id' => $adminId,
                'trainee_id' => $traineeId,
            ],
            [
                'status' => 'active',
                'admin_unread_count' => 0,
                'trainee_unread_count' => 0,
            ]
        );

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $adminId,
            'sender_type' => 'admin',
            'message_type' => 'text',
            'content' => $content,
            'is_read' => false,
            'status' => 'sent',
        ]);

        $conversation->update([
            'last_message' => Str::limit($content, 50),
            'last_message_at' => now(),
            'last_message_sender' => 'admin',
        ]);

        $conversation->increment('trainee_unread_count');

        // إشعار للمتدرب
        $this->createNotification($traineeId, $conversation, $message);

        return $message;
    }

    /**
     * إرسال ملف
     */
    public function sendFileMessage(int $adminId, int $traineeId, $file, ?string $caption = null)
    {
        $conversation = Conversation::firstOrCreate(
            [
                'admin_id' => $adminId,
                'trainee_id' => $traineeId,
            ],
            [
                'status' => 'active',
                'admin_unread_count' => 0,
                'trainee_unread_count' => 0,
            ]
        );

        $mimeType = $file->getMimeType();
        $extension = $file->getClientOriginalExtension();
        $fileType = $this->determineFileType($mimeType, $extension);

        $folder = $this->getStorageFolder($fileType);

        $fileName = time() . '_' . Str::random(10) . '.' . $extension;
        $filePath = $file->storeAs($folder, $fileName, 'public');

        $fileSize = $file->getSize();
        $originalName = $file->getClientOriginalName();

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $adminId,
            'sender_type' => 'admin',
            'message_type' => $fileType,
            'content' => $caption,
            'file_path' => $filePath,
            'file_name' => $originalName,
            'file_type' => $extension,
            'file_size' => $fileSize,
            'file_mime_type' => $mimeType,
            'is_read' => false,
            'status' => 'sent',
        ]);

        $lastMessageText = $this->getFileTypeLabel($fileType);
        $conversation->update([
            'last_message' => $lastMessageText,
            'last_message_at' => now(),
            'last_message_sender' => 'admin',
        ]);

        $conversation->increment('trainee_unread_count');

        // إشعار للمتدرب
        $this->createNotification($traineeId, $conversation, $message);

        return $message;
    }

    /**
     * حذف رسالة
     */
    public function deleteMessage(int $messageId, int $userId)
    {
        $message = Message::findOrFail($messageId);

        if ($message->sender_id != $userId) {
            throw new \Exception('غير مصرح بحذف هذه الرسالة');
        }

        if ($message->file_path && Storage::disk('public')->exists($message->file_path)) {
            Storage::disk('public')->delete($message->file_path);
        }

        $message->delete();

        return true;
    }

    /**
     * حذف محادثة
     */
    public function deleteConversation(int $conversationId, int $adminId)
    {
        $conversation = Conversation::where('id', $conversationId)
            ->where('admin_id', $adminId)
            ->firstOrFail();

        $messages = Message::where('conversation_id', $conversationId)->get();
        foreach ($messages as $message) {
            if ($message->file_path && Storage::disk('public')->exists($message->file_path)) {
                Storage::disk('public')->delete($message->file_path);
            }
            $message->delete();
        }

        ChatNotification::where('conversation_id', $conversationId)->delete();

        $conversation->delete();

        return true;
    }

    /**
     * تحديث الرسائل تأشير كمقروءة للأدمن
     */
    public function markMessagesAsReadForAdmin(Conversation $conversation)
    {
        Message::where('conversation_id', $conversation->id)
            ->where('sender_type', 'trainee')
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        $conversation->update(['admin_unread_count' => 0]);

        ChatNotification::where('conversation_id', $conversation->id)
            ->where('user_id', $conversation->admin_id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * الحصول على الإحصائيات
     */
    public function getStats(int $adminId)
    {
        try {
            $totalConversations = Conversation::where('admin_id', $adminId)->count();

            $unreadMessages = Conversation::where('admin_id', $adminId)
                ->sum('admin_unread_count');

            $activeTrainees = User::where('role', 'user')
                ->where('has_active_subscription', true)
                ->count();

            return [
                'total_conversations' => $totalConversations,
                'unread_messages' => (int) $unreadMessages,
                'online_count' => 0,
                'active_trainees' => $activeTrainees,
            ];
        } catch (\Exception $e) {
            Log::error('Error getting chat stats: ' . $e->getMessage());
            return [
                'total_conversations' => 0,
                'unread_messages' => 0,
                'online_count' => 0,
                'active_trainees' => 0,
            ];
        }
    }

    /**
     * الحصول على الإشعارات
     */
    public function getNotifications(int $userId, int $limit = 20)
    {
        $notifications = ChatNotification::with(['conversation.trainee'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return $notifications->map(function ($notification) {
            $trainee = $notification->conversation?->trainee;
            $data = is_string($notification->data) ? json_decode($notification->data, true) : $notification->data;

            return [
                'id' => $notification->id,
                'title' => $notification->title,
                'body' => $notification->body,
                'type' => $notification->type,
                'is_read' => $notification->is_read,
                'trainee_id' => $data['trainee_id'] ?? $notification->conversation?->trainee_id,
                'trainee_name' => $data['sender_name'] ?? $trainee?->name,
                'trainee_avatar' => $trainee?->avatar ? asset('storage/' . $trainee->avatar) : null,
                'time_ago' => Carbon::parse($notification->created_at)->diffForHumans(),
                'created_at' => $notification->created_at,
            ];
        });
    }

    public function getUnreadNotificationsCount(int $userId): int
    {
        return ChatNotification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    public function markAllNotificationsAsRead(int $userId)
    {
        ChatNotification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    // ================== Helpers ==================

    /**
     * ✅ يبني رابط صحيح من public storage
     * يرجع مثل: http://localhost:8000/storage/chat/images/xxx.jpg
     */
    private function buildPublicFileUrl(string $filePath): string
    {
        // Storage::url => /storage/....
        $relative = Storage::disk('public')->url($filePath);

        // asset() يبني URL كامل حسب APP_URL
        return asset($relative);
    }

    /**
     * إنشاء إشعار
     */
    private function createNotification(int $userId, Conversation $conversation, Message $message)
    {
        $sender = User::find($message->sender_id);
        $senderName = $sender ? $sender->name : 'مستخدم';

        $body = $message->message_type == 'text'
            ? Str::limit($message->content, 50)
            : $this->getFileTypeLabel($message->message_type);

        ChatNotification::create([
            'user_id' => $userId,
            'conversation_id' => $conversation->id,
            'message_id' => $message->id,
            'type' => 'new_message',
            'title' => "رسالة جديدة من {$senderName}",
            'body' => $body,
            'data' => json_encode([
                'sender_id' => $message->sender_id,
                'sender_name' => $senderName,
                'message_type' => $message->message_type,
                'trainee_id' => $conversation->trainee_id,
            ]),
            'is_read' => false,
        ]);
    }

    private function determineFileType(string $mimeType, string $extension): string
    {
        $videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'mkv', 'webm', '3gp', 'flv', 'm4v', 'mpeg', 'mpg'];
        if (in_array(strtolower($extension), $videoExtensions)) {
            return 'video';
        }

        if (Str::startsWith($mimeType, 'image/')) {
            return 'image';
        }

        if (Str::startsWith($mimeType, 'video/')) {
            return 'video';
        }

        if ($mimeType == 'application/pdf') {
            return 'pdf';
        }

        $docExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        if (in_array(strtolower($extension), $docExtensions) ||
            Str::contains($mimeType, ['word', 'document', 'excel', 'spreadsheet', 'powerpoint', 'presentation'])) {
            return 'doc';
        }

        return 'file';
    }

    private function getStorageFolder(string $fileType): string
    {
        return match ($fileType) {
            'image' => 'chat/images',
            'video' => 'chat/videos',
            'pdf' => 'chat/pdfs',
            'doc' => 'chat/documents',
            default => 'chat/files',
        };
    }

    private function getFileTypeLabel(string $fileType): string
    {
        return match ($fileType) {
            'image' => '📷 صورة',
            'video' => '🎬 فيديو',
            'pdf' => '📄 ملف PDF',
            'doc' => '📝 مستند',
            default => '📎 ملف',
        };
    }

    private function translateGoal(?string $goal): string
    {
        if (!$goal) return 'غير محدد';

        return match ($goal) {
            'weight-loss' => 'إنقاص الوزن',
            'muscle-gain' => 'بناء العضلات',
            'fitness' => 'اللياقة البدنية',
            'toning' => 'التنشيف',
            'health' => 'الصحة العامة',
            default => $goal,
        };
    }

    private function formatFileSize(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        } else {
            return $bytes . ' bytes';
        }
    }
}
