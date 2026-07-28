<?php

namespace App\Services;

use App\Events\AdminChatListUpdated;
use App\Events\ChatMessageSent;
use App\Events\ChatMessagesRead;
use App\Events\ChatTyping;
use App\Models\ChatNotification;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ChatService
{
    public function getConversationsForAdmin(int $adminId, ?string $search = null, bool $archived = false)
    {
        $query = Conversation::with(['trainee'])
            ->where('admin_id', $adminId)
            ->where('is_archived', $archived)  
            ->orderByDesc('last_message_at');
 
        if ($search) {
            $query->whereHas('trainee', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
 
        return $query->get()->map(fn ($conversation) => $this->mapConversationForAdminList($conversation));
    }

    public function getConversation(int $adminId, int $traineeId, string $viewerRole = 'admin'): array
    {
        $conversation = $this->findOrCreateConversation($adminId, $traineeId);

        if ($viewerRole === 'admin') {
            $this->markMessagesAsReadForAdmin($conversation, true);
        } else {
            $this->markMessagesAsReadForTrainee($conversation, true);
        }

        $conversation->refresh();

        $messages = Message::where('conversation_id', $conversation->id)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(fn ($message) => $this->mapMessage($message))
            ->values();

        $trainee = User::find($traineeId);
        $admin = User::find($adminId);

        return [
            'conversation' => [
                'id' => $conversation->id,
                'status' => $conversation->status,
                'admin_avatar' => $admin?->avatar ? asset('storage/' . $admin->avatar) : null,
                'admin_unread_count' => (int) $conversation->admin_unread_count,
                'trainee_unread_count' => (int) $conversation->trainee_unread_count,
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

    public function sendTextMessage(int $adminId, int $traineeId, string $content, string $actor = 'admin'): Message
    {
        return DB::transaction(function () use ($adminId, $traineeId, $content, $actor) {
            $conversation = $this->findOrCreateConversation($adminId, $traineeId);

            $senderId = $actor === 'admin' ? $adminId : $traineeId;
            $senderType = $actor === 'admin' ? 'admin' : 'trainee';

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $senderId,
                'sender_type' => $senderType,
                'message_type' => 'text',
                'content' => $content,
                'is_read' => false,
                'status' => 'sent',
            ]);

            $conversation->update([
                'last_message' => Str::limit($content, 50),
                'last_message_at' => now(),
                'last_message_sender' => $senderType,
            ]);

            if ($senderType === 'admin') {
                $conversation->increment('trainee_unread_count');
                $this->createNotification($traineeId, $conversation, $message);
            } else {
                $conversation->increment('admin_unread_count');
                $this->createNotification($adminId, $conversation, $message);
            }

            $conversation->refresh();

            $this->broadcastNewMessage($conversation, $message);
            $this->broadcastAdminListUpdate($conversation);
            $this->sendPushNotificationIfOffline($conversation, $message, $senderType);

             return $message->refresh();
        });
    }

    public function sendFileMessage(int $adminId, int $traineeId, $file, ?string $caption = null, string $actor = 'admin'): Message
    {
        return DB::transaction(function () use ($adminId, $traineeId, $file, $caption, $actor) {
            $conversation = $this->findOrCreateConversation($adminId, $traineeId);

            $mimeType = $file->getMimeType();
            $extension = strtolower($file->getClientOriginalExtension());
            $fileType = $this->determineFileType($mimeType, $extension);
            $folder = $this->getStorageFolder($fileType);

            $fileName = time() . '_' . Str::random(10) . '.' . $extension;
            $filePath = $file->storeAs($folder, $fileName, 'public');

            $senderId = $actor === 'admin' ? $adminId : $traineeId;
            $senderType = $actor === 'admin' ? 'admin' : 'trainee';

            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $senderId,
                'sender_type' => $senderType,
                'message_type' => $fileType,
                'content' => $caption,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $extension,
                'file_size' => $file->getSize(),
                'file_mime_type' => $mimeType,
                'is_read' => false,
                'status' => 'sent',
            ]);

            $conversation->update([
                'last_message' => $this->getFileTypeLabel($fileType),
                'last_message_at' => now(),
                'last_message_sender' => $senderType,
            ]);

            if ($senderType === 'admin') {
                $conversation->increment('trainee_unread_count');
                $this->createNotification($traineeId, $conversation, $message);
            } else {
                $conversation->increment('admin_unread_count');
                $this->createNotification($adminId, $conversation, $message);
            }

            $conversation->refresh();

            $this->broadcastNewMessage($conversation, $message);
            $this->broadcastAdminListUpdate($conversation);
            $this->sendPushNotificationIfOffline($conversation, $message, $senderType);
            
            return $message->refresh();
        });
    }

    public function deleteMessage(int $messageId, int $userId)
    {
        $message = Message::findOrFail($messageId);

        if ((int) $message->sender_id !== (int) $userId) {
            throw new \Exception('غير مصرح بحذف هذه الرسالة');
        }

        if ($message->file_path && Storage::disk('public')->exists($message->file_path)) {
            Storage::disk('public')->delete($message->file_path);
        }

        $message->delete();

        return true;
    }

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

    public function markMessagesAsReadForAdmin(Conversation $conversation, bool $broadcast = false): array
    {
        $messages = Message::where('conversation_id', $conversation->id)
            ->where('sender_type', 'trainee')
            ->where('is_read', false)
            ->get();

        if ($messages->isEmpty()) {
            $conversation->update(['admin_unread_count' => 0]);
            return [];
        }

        $messageIds = $messages->pluck('id')->map(fn ($id) => (int) $id)->values()->all();

        Message::whereIn('id', $messageIds)->update([
            'is_read' => true,
            'read_at' => now(),
            'status' => 'read',
        ]);

        $conversation->update(['admin_unread_count' => 0]);

        ChatNotification::where('conversation_id', $conversation->id)
            ->where('user_id', $conversation->admin_id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        if ($broadcast) {
            broadcast(new ChatMessagesRead(
                $conversation->id,
                'admin',
                $messageIds,
                now()->toISOString()
            ))->toOthers();

            $this->broadcastAdminListUpdate($conversation->refresh());
        }

        return $messageIds;
    }

    public function markMessagesAsReadForTrainee(Conversation $conversation, bool $broadcast = false): array
    {
        $messages = Message::where('conversation_id', $conversation->id)
            ->where('sender_type', 'admin')
            ->where('is_read', false)
            ->get();

        if ($messages->isEmpty()) {
            $conversation->update(['trainee_unread_count' => 0]);
            return [];
        }

        $messageIds = $messages->pluck('id')->map(fn ($id) => (int) $id)->values()->all();

        Message::whereIn('id', $messageIds)->update([
            'is_read' => true,
            'read_at' => now(),
            'status' => 'read',
        ]);

        $conversation->update(['trainee_unread_count' => 0]);

        ChatNotification::where('conversation_id', $conversation->id)
            ->where('user_id', $conversation->trainee_id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        if ($broadcast) {
            broadcast(new ChatMessagesRead(
                $conversation->id,
                'user',
                $messageIds,
                now()->toISOString()
            ))->toOthers();
        }

        return $messageIds;
    }

    public function broadcastTyping(Conversation $conversation, User $user, bool $isTyping): void
    {
        broadcast(new ChatTyping(
            $conversation->id,
            $user->id,
            $user->name,
            $user->role,
            $isTyping
        ))->toOthers();
    }

    public function getStats(int $adminId): array
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

    public function getNotifications(int $userId, int $limit = 20)
    {
        $notifications = ChatNotification::with(['conversation.trainee'])
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
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

    public function markAllNotificationsAsRead(int $userId): void
    {
        ChatNotification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    public function findOrCreateConversation(int $adminId, int $traineeId): Conversation
    {
        $conversation = Conversation::withTrashed()
            ->where('admin_id', $adminId)
            ->where('trainee_id', $traineeId)
            ->first();

        if ($conversation) {
            if ($conversation->trashed()) {
                $conversation->restore();
            }

            if ($conversation->status !== 'active') {
                $conversation->update(['status' => 'active']);
            }

            return $conversation->refresh();
        }

        try {
            return Conversation::create([
                'admin_id' => $adminId,
                'trainee_id' => $traineeId,
                'status' => 'active',
                'admin_unread_count' => 0,
                'trainee_unread_count' => 0,
            ]);
        } catch (QueryException $e) {
            $existing = Conversation::withTrashed()
                ->where('admin_id', $adminId)
                ->where('trainee_id', $traineeId)
                ->first();

            if ($existing) {
                if ($existing->trashed()) {
                    $existing->restore();
                }

                return $existing->refresh();
            }

            throw $e;
        }
    }

    private function broadcastNewMessage(Conversation $conversation, Message $message): void
    {
        broadcast(new ChatMessageSent(
            $conversation->id,
            $this->mapMessage($message->refresh()),
            [
                'id' => $conversation->id,
                'status' => $conversation->status,
                'admin_unread_count' => (int) $conversation->admin_unread_count,
                'trainee_unread_count' => (int) $conversation->trainee_unread_count,
                'last_message' => $conversation->last_message,
                'last_message_time' => $conversation->last_message_at
                    ? Carbon::parse($conversation->last_message_at)->format('H:i')
                    : null,
                'last_message_sender' => $conversation->last_message_sender,
            ]
        ))->toOthers();
    }

    private function broadcastAdminListUpdate(Conversation $conversation): void
    {
        $conversation->loadMissing('trainee');

        broadcast(new AdminChatListUpdated(
            $this->mapConversationForAdminList($conversation)
        ))->toOthers();
    }

    private function mapConversationForAdminList(Conversation $conversation): array
    {
        $trainee = $conversation->trainee;

        $avatarPath = null;
        if ($trainee) {
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
                'image' => $avatarPath ? asset('storage/' . ltrim($avatarPath, '/')) : null,
                'goal' => $this->translateGoal($trainee->goal ?? null),
                'status' => !empty($trainee->has_active_subscription) ? 'active' : 'expired',
            ] : null,
        ];
    }

    private function mapMessage(Message $message): array
    {
        return [
            'id' => (int) $message->id,
            'conversation_id' => (int) $message->conversation_id,
            'sender' => $message->sender_type === 'admin' ? 'trainer' : 'user',
            'sender_id' => (int) $message->sender_id,
            'sender_type' => $message->sender_type,
            'type' => $message->message_type,
            'content' => $message->content,
            'file_url' => $message->file_url,
            'file_name' => $message->file_name,
            'file_size' => $message->formatted_file_size,
            'file_type' => $message->file_type,
            'thumbnail_url' => $message->thumbnail_url,
            'timestamp' => Carbon::parse($message->created_at)->format('H:i'),
            'date' => Carbon::parse($message->created_at)->format('Y-m-d'),
            'is_read' => (bool) $message->is_read,
            'status' => $message->is_read ? 'read' : 'sent',
            'created_at' => $message->created_at?->toISOString(),
            'read_at' => $message->read_at?->toISOString(),
        ];
    }

    private function createNotification(int $userId, Conversation $conversation, Message $message): void
    {
        $sender = User::find($message->sender_id);
        $senderName = $sender ? $sender->name : 'مستخدم';

        $body = $message->message_type === 'text'
            ? Str::limit((string) $message->content, 50)
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
        if (in_array($extension, $videoExtensions, true)) {
            return 'video';
        }

        if (Str::startsWith($mimeType, 'image/')) {
            return 'image';
        }

        if (Str::startsWith($mimeType, 'video/')) {
            return 'video';
        }

        if ($mimeType === 'application/pdf') {
            return 'pdf';
        }

        $docExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        if (
            in_array($extension, $docExtensions, true) ||
            Str::contains($mimeType, ['word', 'document', 'excel', 'spreadsheet', 'powerpoint', 'presentation'])
        ) {
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
        if (!$goal) {
            return 'غير محدد';
        }

        return match ($goal) {
            'weight-loss' => 'إنقاص الوزن',
            'muscle-gain' => 'بناء العضلات',
            'fitness' => 'اللياقة البدنية',
            'toning' => 'التنشيف',
            'health' => 'الصحة العامة',
            default => $goal,
        };
    }

    public function formatMessageForApi(Message $message): array
{
    return [
        'id' => (int) $message->id,
        'conversation_id' => (int) $message->conversation_id,
        'sender' => $message->sender_type === 'admin' ? 'trainer' : 'user',
        'sender_id' => (int) $message->sender_id,
        'sender_type' => $message->sender_type,
        'type' => $message->message_type,
        'content' => $message->content,
        'file_url' => $message->file_url,
        'file_name' => $message->file_name,
        'file_size' => $message->formatted_file_size,
        'file_type' => $message->file_type,
        'thumbnail_url' => $message->thumbnail_url,
        'timestamp' => $message->created_at ? $message->created_at->format('H:i') : null,
        'date' => $message->created_at ? $message->created_at->format('Y-m-d') : null,
        'is_read' => (bool) $message->is_read,
        'status' => $message->is_read ? 'read' : 'sent',
        'created_at' => $message->created_at?->toISOString(),
        'read_at' => $message->read_at?->toISOString(),
    ];
}

private function sendPushNotificationIfOffline(
    Conversation $conversation,
    Message $message,
    string $senderType
): void {
    try {
        $recipientId = $senderType === 'admin'
            ? $conversation->trainee_id
            : $conversation->admin_id;

        $recipient = User::find($recipientId);

        if (!$recipient) return;

        $sender = User::find($message->sender_id);
        $senderName = $sender?->name ?? 'رسالة جديدة';

        $notificationBody = $message->message_type === 'text'
            ? Str::limit((string) $message->content, 60)
            : $this->getFileTypeLabel($message->message_type);

        if ($recipient->role === 'admin') {
            $chatUrl = 'https://admin.ranlogic.com/chat/' . $conversation->trainee_id;
        } else {
            $chatUrl = 'https://ranlogic.com/profile?tab=chat';
        }

        // OneSignal
        if ($recipient->onesignal_id) {
            $this->sendOneSignalNotification(
                $recipient->onesignal_id,
                $senderName,
                $notificationBody,
                $chatUrl
            );
            return;
        }

        // FCM fallback
        if ($recipient->fcm_token) {
            $fcmService = app(FcmService::class);
            $fcmService->sendNotification(
                $recipient->fcm_token,
                $senderName,
                $notificationBody,
                ['url' => $chatUrl]
            );
        }
    } catch (\Throwable $e) {
        Log::error('Push notification error: ' . $e->getMessage());
    }
}

private function sendOneSignalNotification(
    string $playerId,
    string $title,
    string $body,
    string $url
): void {
    $appId = config('services.onesignal.app_id');
    $apiKey = config('services.onesignal.rest_api_key');

    $payload = [
        'app_id'             => $appId,
        'include_player_ids' => [$playerId],
        'headings'           => ['en' => $title, 'ar' => $title],
        'contents'           => ['en' => $body, 'ar' => $body],
        'url'                => $url,
        'chrome_web_icon'    => 'https://ranlogic.com/icons/icon-192x192.png',
    ];

    $ch = curl_init('https://onesignal.com/api/v1/notifications');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Key ' . $apiKey,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    Log::info('OneSignal Response', [
        'http_code' => $httpCode,
        'response'  => $response,
    ]);
}

public function saveFcmToken(int $userId, string $token): void
{
    User::where('id', $userId)->update(['fcm_token' => $token]);
}

public function archiveConversation(int $conversationId, int $adminId): void
    {
        $conversation = Conversation::where('id', $conversationId)
            ->where('admin_id', $adminId)
            ->firstOrFail();
 
        $conversation->update(['is_archived' => true]);
    }
 
    public function unarchiveConversation(int $conversationId, int $adminId): void
    {
        $conversation = Conversation::where('id', $conversationId)
            ->where('admin_id', $adminId)
            ->firstOrFail();
 
        $conversation->update(['is_archived' => false]);
    }
}