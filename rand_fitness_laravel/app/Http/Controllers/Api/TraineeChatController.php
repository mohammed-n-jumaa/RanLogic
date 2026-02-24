<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\ChatNotification;

class TraineeChatController extends Controller
{
    protected $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Get trainee's conversation with admin
     * GET /api/trainee/chat/conversation
     */
    public function getConversation(Request $request): JsonResponse
    {
        try {
            $trainee = $request->user();

            // Only allow regular users
            if ($trainee->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }

            // Get the first admin
            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            // استخدم ChatService (فيه منطق جلب الرسائل + تحديث القراءة للأدمن)
            $conversation = $this->chatService->getConversation($admin->id, $trainee->id);

            return response()->json([
                'success' => true,
                'data' => $conversation,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching trainee conversation: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المحادثة',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Send text message
     * POST /api/trainee/chat/messages
     */
    public function sendMessage(Request $request): JsonResponse
    {
        try {
            $trainee = $request->user();

            if ($trainee->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }

            $request->validate([
                'content' => 'required|string|max:5000',
            ]);

            // Get admin
            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            // ✅ حل مشكلة Duplicate مع soft delete
            $conversation = Conversation::withTrashed()->firstOrCreate(
                [
                    'admin_id' => $admin->id,
                    'trainee_id' => $trainee->id,
                ],
                [
                    'status' => 'active',
                    'admin_unread_count' => 0,
                    'trainee_unread_count' => 0,
                ]
            );

            if ($conversation->trashed()) {
                $conversation->restore();
                $conversation->update([
                    'status' => 'active',
                    'admin_unread_count' => 0,
                    'trainee_unread_count' => 0,
                ]);
            }

            // Create message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $trainee->id,
                'sender_type' => 'trainee',
                'message_type' => 'text',
                'content' => $request->content,
                'is_read' => false,
                'status' => 'sent',
            ]);

            // Update conversation
            $conversation->update([
                'last_message' => Str::limit($request->content, 50),
                'last_message_at' => now(),
                'last_message_sender' => 'trainee',
            ]);

            // Increment admin unread count
            $conversation->increment('admin_unread_count');

            // ✅ إنشاء إشعار للأدمن "أرسل رسالة فقط"
            ChatNotification::create([
                'user_id' => $admin->id,
                'conversation_id' => $conversation->id,
                'message_id' => $message->id,
                'type' => 'new_message',
                'title' => 'رسالة جديدة',
                'body' => 'أرسل المتدرب رسالة',
                'data' => [
                    'sender_id' => $trainee->id,
                    'sender_name' => $trainee->name,
                    'message_type' => 'text',
                    'trainee_id' => $trainee->id,
                ],
                'is_read' => false,
            ]);

            return response()->json([
                'success' => true,
                'data' => $message,
                'message' => 'تم إرسال الرسالة بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending trainee message: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرسالة',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Send message with image
     * POST /api/trainee/chat/files
     */
    public function sendFile(Request $request): JsonResponse
    {
        try {
            $trainee = $request->user();

            if ($trainee->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }

            $request->validate([
                'file' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
                'content' => 'nullable|string|max:5000',
            ]);

            // Get admin
            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            // ✅ حل مشكلة Duplicate مع soft delete
            $conversation = Conversation::withTrashed()->firstOrCreate(
                [
                    'admin_id' => $admin->id,
                    'trainee_id' => $trainee->id,
                ],
                [
                    'status' => 'active',
                    'admin_unread_count' => 0,
                    'trainee_unread_count' => 0,
                ]
            );

            if ($conversation->trashed()) {
                $conversation->restore();
                $conversation->update([
                    'status' => 'active',
                    'admin_unread_count' => 0,
                    'trainee_unread_count' => 0,
                ]);
            }

            // Upload file
            $file = $request->file('file');
            $fileName = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('chat/images', $fileName, 'public');

            // Create message
            $message = Message::create([
                'conversation_id' => $conversation->id,
                'sender_id' => $trainee->id,
                'sender_type' => 'trainee',
                'message_type' => 'image',
                'content' => $request->content,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'file_mime_type' => $file->getMimeType(),
                'is_read' => false,
                'status' => 'sent',
            ]);

            // Update conversation
            $conversation->update([
                'last_message' => '📷 صورة',
                'last_message_at' => now(),
                'last_message_sender' => 'trainee',
            ]);

            // Increment admin unread count
            $conversation->increment('admin_unread_count');

            // ✅ إشعار للأدمن (حتى لو صورة)
            ChatNotification::create([
                'user_id' => $admin->id,
                'conversation_id' => $conversation->id,
                'message_id' => $message->id,
                'type' => 'file_received',
                'title' => 'رسالة جديدة',
                'body' => 'أرسل المتدرب رسالة',
                'data' => [
                    'sender_id' => $trainee->id,
                    'sender_name' => $trainee->name,
                    'message_type' => 'image',
                    'trainee_id' => $trainee->id,
                ],
                'is_read' => false,
            ]);

            return response()->json([
                'success' => true,
                'data' => $message,
                'message' => 'تم إرسال الصورة بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending trainee file: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الملف',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
