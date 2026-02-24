<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendMessageRequest;
use App\Http\Requests\SendFileRequest;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    protected ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * الحصول على قائمة المحادثات
     * GET /api/admin/chat/conversations
     */
    public function getConversations(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search');
            $conversations = $this->chatService->getConversationsForAdmin(
                auth()->id(),
                $search
            );

            return response()->json([
                'success' => true,
                'data' => $conversations,
                'message' => 'تم جلب المحادثات بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching conversations: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المحادثات',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * الحصول على إحصائيات المحادثات
     * GET /api/admin/chat/stats
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = $this->chatService->getStats(auth()->id());

            return response()->json([
                'success' => true,
                'data' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching chat stats: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإحصائيات',
            ], 500);
        }
    }

    /**
     * الحصول على محادثة معينة مع الرسائل
     * GET /api/admin/chat/conversations/{traineeId}
     */
    public function getConversation(int $traineeId): JsonResponse
    {
        try {
            $data = $this->chatService->getConversation(auth()->id(), $traineeId);

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'تم جلب المحادثة بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'المتدرب غير موجود',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching conversation: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المحادثة',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * إرسال رسالة نصية
     * POST /api/admin/chat/conversations/{traineeId}/messages
     */
    public function sendMessage(int $traineeId, SendMessageRequest $request): JsonResponse
    {
        try {
            $message = $this->chatService->sendTextMessage(
                auth()->id(),
                $traineeId,
                $request->validated()['content']
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $message->id,
                    'sender' => 'trainer',
                    'sender_id' => $message->sender_id,
                    'type' => $message->message_type,
                    'content' => $message->content,
                    'is_read' => $message->is_read,
                    'status' => $message->status,
                    'timestamp' => $message->created_at->format('H:i'),
                    'created_at' => $message->created_at->toISOString(),
                ],
                'message' => 'تم إرسال الرسالة بنجاح',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرسالة',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * إرسال ملف
     * POST /api/admin/chat/conversations/{traineeId}/files
     */
    public function sendFile(int $traineeId, SendFileRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            
            $message = $this->chatService->sendFileMessage(
                auth()->id(),
                $traineeId,
                $request->file('file'),
                $validated['caption'] ?? null
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $message->id,
                    'sender' => 'trainer',
                    'sender_id' => $message->sender_id,
                    'type' => $message->message_type,
                    'content' => $message->content,
                    'file_url' => $message->file_url,
                    'file_name' => $message->file_name,
                    'file_size' => $message->formatted_file_size,
                    'file_type' => $message->file_type,
                    'thumbnail_url' => $message->thumbnail_url,
                    'is_read' => $message->is_read,
                    'status' => $message->status,
                    'timestamp' => $message->created_at->format('H:i'),
                    'created_at' => $message->created_at->toISOString(),
                ],
                'message' => 'تم إرسال الملف بنجاح',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error sending file: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الملف',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * حذف رسالة
     * DELETE /api/admin/chat/messages/{messageId}
     */
    public function deleteMessage(int $messageId): JsonResponse
    {
        try {
            $this->chatService->deleteMessage($messageId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الرسالة بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'الرسالة غير موجودة',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting message: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 403);
        }
    }

    /**
     * حذف محادثة
     * DELETE /api/admin/chat/conversations/{conversationId}
     */
    public function deleteConversation(int $conversationId): JsonResponse
    {
        try {
            $this->chatService->deleteConversation($conversationId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'تم حذف المحادثة بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'المحادثة غير موجودة',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error deleting conversation: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المحادثة',
            ], 500);
        }
    }

    /**
     * تحديد الرسائل كمقروءة
     * POST /api/admin/chat/conversations/{conversationId}/read
     */
    public function markAsRead(int $conversationId): JsonResponse
    {
        try {
            $conversation = \App\Models\Conversation::where('id', $conversationId)
                ->where('admin_id', auth()->id())
                ->firstOrFail();

            $this->chatService->markMessagesAsReadForAdmin($conversation);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد الرسائل كمقروءة',
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking messages as read: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ',
            ], 500);
        }
    }

    /**
     * الحصول على الإشعارات
     * GET /api/admin/chat/notifications
     */
    public function getNotifications(Request $request): JsonResponse
    {
        try {
            $limit = $request->query('limit', 20);
            $notifications = $this->chatService->getNotifications(auth()->id(), $limit);

            return response()->json([
                'success' => true,
                'data' => $notifications,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإشعارات',
            ], 500);
        }
    }

    /**
     * عدد الإشعارات غير المقروءة
     * GET /api/admin/chat/notifications/unread-count
     */
    public function getUnreadCount(): JsonResponse
    {
        try {
            $count = $this->chatService->getUnreadNotificationsCount(auth()->id());

            return response()->json([
                'success' => true,
                'data' => [
                    'count' => $count,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ',
            ], 500);
        }
    }

    /**
     * تحديد الإشعارات كمقروءة
     * POST /api/admin/chat/notifications/read
     */
    public function markNotificationsAsRead(): JsonResponse
    {
        try {
            $this->chatService->markAllNotificationsAsRead(auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد جميع الإشعارات كمقروءة',
            ]);
        } catch (\Exception $e) {
            Log::error('Error marking notifications as read: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ',
            ], 500);
        }
    }
}