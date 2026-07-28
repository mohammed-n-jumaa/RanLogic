<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendFileRequest;
use App\Http\Requests\SendMessageRequest;
use App\Models\Conversation;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function __construct(
        protected ChatService $chatService
    ) {}

    public function getConversations(Request $request): JsonResponse
    {
        try {
            $search   = $request->query('search');
            $archived = (bool) $request->query('archived', false);

            $conversations = $this->chatService->getConversationsForAdmin(auth()->id(), $search, $archived);

            return response()->json([
                'success' => true,
                'data'    => $conversations,
                'message' => 'تم جلب المحادثات بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching conversations: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المحادثات',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function getStats(): JsonResponse
    {
        try {
            $stats = $this->chatService->getStats(auth()->id());

            return response()->json([
                'success' => true,
                'data'    => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching chat stats: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإحصائيات',
            ], 500);
        }
    }

    public function getConversation(int $traineeId): JsonResponse
    {
        try {
            $data = $this->chatService->getConversation(auth()->id(), $traineeId, 'admin');

            return response()->json([
                'success' => true,
                'data'    => $data,
                'message' => 'تم جلب المحادثة بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching conversation: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المحادثة',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function sendMessage(int $traineeId, SendMessageRequest $request): JsonResponse
    {
        try {
            $message = $this->chatService->sendTextMessage(
                auth()->id(),
                $traineeId,
                $request->validated()['content'],
                'admin'
            );

            return response()->json([
                'success' => true,
                'data'    => $this->chatService->formatMessageForApi($message->fresh()),
                'message' => 'تم إرسال الرسالة بنجاح',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الرسالة',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function sendFile(int $traineeId, SendFileRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $message = $this->chatService->sendFileMessage(
                auth()->id(),
                $traineeId,
                $request->file('file'),
                $validated['caption'] ?? null,
                'admin'
            );

            return response()->json([
                'success' => true,
                'data'    => $this->chatService->formatMessageForApi($message->fresh()),
                'message' => 'تم إرسال الملف بنجاح',
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error sending file: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الملف',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

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

    public function archiveConversation(int $conversationId): JsonResponse
    {
        try {
            $this->chatService->archiveConversation($conversationId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'تم أرشفة المحادثة بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'المحادثة غير موجودة',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error archiving conversation: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء أرشفة المحادثة',
            ], 500);
        }
    }

    public function unarchiveConversation(int $conversationId): JsonResponse
    {
        try {
            $this->chatService->unarchiveConversation($conversationId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'تم إلغاء أرشفة المحادثة بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'المحادثة غير موجودة',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error unarchiving conversation: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إلغاء أرشفة المحادثة',
            ], 500);
        }
    }

    public function markAsRead(int $conversationId): JsonResponse
    {
        try {
            $conversation = Conversation::where('id', $conversationId)
                ->where('admin_id', auth()->id())
                ->firstOrFail();

            $this->chatService->markMessagesAsReadForAdmin($conversation, true);

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

    public function typing(Request $request, int $traineeId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'is_typing' => ['required', 'boolean'],
            ]);

            $conversation = $this->chatService->findOrCreateConversation(auth()->id(), $traineeId);
            $this->chatService->broadcastTyping($conversation, $request->user(), (bool) $validated['is_typing']);

            return response()->json([
                'success' => true,
            ]);
        } catch (\Exception $e) {
            Log::error('Error broadcasting typing: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة الكتابة',
            ], 500);
        }
    }

    public function getNotifications(Request $request): JsonResponse
    {
        try {
            $limit         = (int) $request->query('limit', 20);
            $notifications = $this->chatService->getNotifications(auth()->id(), $limit);

            return response()->json([
                'success' => true,
                'data'    => $notifications,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching notifications: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإشعارات',
            ], 500);
        }
    }

    public function getUnreadCount(): JsonResponse
    {
        try {
            $count = $this->chatService->getUnreadNotificationsCount(auth()->id());

            return response()->json([
                'success' => true,
                'data'    => ['count' => $count],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ',
            ], 500);
        }
    }

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