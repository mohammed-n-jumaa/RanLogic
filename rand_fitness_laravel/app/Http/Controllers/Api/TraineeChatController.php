<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TraineeChatController extends Controller
{
    protected ChatService $chatService;

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

            if (!$trainee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            if ($trainee->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }

            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            $conversation = $this->chatService->getConversation($admin->id, $trainee->id, 'user');

            return response()->json([
                'success' => true,
                'data' => $conversation,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error fetching trainee conversation: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

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

            if (!$trainee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            if ($trainee->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }

            $request->validate([
                'content' => 'required|string|max:5000',
            ]);

            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            $message = $this->chatService->sendTextMessage(
                $admin->id,
                $trainee->id,
                $request->string('content')->toString(),
                'trainee'
            );

            return response()->json([
                'success' => true,
                'data' => $message->fresh(),
                'message' => 'تم إرسال الرسالة بنجاح',
            ]);
        } catch (\Throwable $e) {
            Log::error('Error sending trainee message: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

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

            if (!$trainee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

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

            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            $message = $this->chatService->sendFileMessage(
                $admin->id,
                $trainee->id,
                $request->file('file'),
                $request->input('content'),
                'trainee'
            );

            return response()->json([
                'success' => true,
                'data' => $message->fresh(),
                'message' => 'تم إرسال الصورة بنجاح',
            ]);
        } catch (\Throwable $e) {
            Log::error('Error sending trainee file: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال الملف',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Mark trainee conversation messages as read
     * POST /api/trainee/chat/conversation/read
     */
    public function markAsRead(Request $request): JsonResponse
    {
        try {
            $trainee = $request->user();

            if (!$trainee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            if ($trainee->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }

            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            $conversation = $this->chatService->findOrCreateConversation($admin->id, $trainee->id);
            $this->chatService->markMessagesAsReadForTrainee($conversation, true);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديد الرسائل كمقروءة',
            ]);
        } catch (\Throwable $e) {
            Log::error('Trainee markAsRead error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Broadcast trainee typing state
     * POST /api/trainee/chat/conversation/typing
     */
    public function typing(Request $request): JsonResponse
    {
        try {
            $trainee = $request->user();

            if (!$trainee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            if ($trainee->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }

            $validated = $request->validate([
                'is_typing' => ['required', 'boolean'],
            ]);

            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد مدرب متاح',
                ], 404);
            }

            $conversation = $this->chatService->findOrCreateConversation($admin->id, $trainee->id);
            $this->chatService->broadcastTyping($conversation, $trainee, (bool) $validated['is_typing']);

            return response()->json([
                'success' => true,
            ]);
        } catch (\Throwable $e) {
            Log::error('Trainee typing error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث حالة الكتابة',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
    /**
     * Get unread messages count (without marking as read)
     * GET /api/trainee/chat/unread-count
     */
    public function getUnreadCount(Request $request): JsonResponse
    {
        try {
            $trainee = $request->user();

            if (!$trainee || $trainee->role !== 'user') {
                return response()->json(['success' => false, 'message' => 'غير مصرح'], 403);
            }

            $admin = User::where('role', 'admin')->first();

            if (!$admin) {
                return response()->json(['success' => true, 'data' => ['unread_count' => 0, 'recent_messages' => []]]);
            }

            $conversation = $this->chatService->findOrCreateConversation($admin->id, $trainee->id);

            $recentMessages = \App\Models\Message::where('conversation_id', $conversation->id)
                ->where('sender_type', 'admin')
                ->where('message_type', 'text')
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get()
                ->map(fn($m) => [
                    'id'         => $m->id,
                    'content'    => $m->content,
                    'is_read'    => (bool) $m->is_read,
                    'created_at' => $m->created_at?->toISOString(),
                    'sender'     => 'trainer',
                    'type'       => 'text',
                ])
                ->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count'    => (int) $conversation->trainee_unread_count,
                    'recent_messages' => $recentMessages,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Trainee getUnreadCount error: ' . $e->getMessage());
            return response()->json(['success' => true, 'data' => ['unread_count' => 0, 'recent_messages' => []]]);
        }
    }
}