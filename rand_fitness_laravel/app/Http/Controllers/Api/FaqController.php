<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateFaqSectionRequest;
use App\Http\Requests\UpdateAllFaqRequest;
use App\Http\Requests\CreateUserQuestionRequest;
use App\Services\FaqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FaqController extends Controller
{
    protected $faqService;

    public function __construct(FaqService $faqService)
    {
        $this->faqService = $faqService;
        
        // Admin-only routes (except show and storeUserQuestion)
        $this->middleware('auth:sanctum')->except(['show', 'storeUserQuestion']);
    }

    /**
     * Get all FAQ data for admin
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $data = $this->faqService->getAllForAdmin();

            return response()->json([
                'success' => true,
                'data' => [
                    'section' => $data['section'] ? [
                        'id' => $data['section']->id,
                        'title_en' => $data['section']->title_en,
                        'title_ar' => $data['section']->title_ar,
                        'subtitle_en' => $data['section']->subtitle_en,
                        'subtitle_ar' => $data['section']->subtitle_ar,
                    ] : null,
                    'arabic_questions' => $data['arabic_questions']->map(function ($q) {
                        return [
                            'id' => $q->id,
                            'category' => $q->category,
                            'question' => $q->question,
                            'answer' => $q->answer,
                            'icon' => $q->icon,
                            'order' => $q->order,
                        ];
                    }),
                    'english_questions' => $data['english_questions']->map(function ($q) {
                        return [
                            'id' => $q->id,
                            'category' => $q->category,
                            'question' => $q->question,
                            'answer' => $q->answer,
                            'icon' => $q->icon,
                            'order' => $q->order,
                        ];
                    }),
                    'user_questions' => $data['user_questions']->map(function ($q) {
                        return [
                            'id' => $q->id,
                            'name' => $q->name,
                            'email' => $q->email,
                            'question' => $q->question,
                            'is_read' => $q->is_read,
                            'date' => $q->created_at->format('Y-m-d'),
                            'created_at' => $q->created_at->toISOString(),
                        ];
                    }),
                    'unread_count' => $this->faqService->getUnreadCount(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching FAQ data: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Get FAQ data for public website
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'ar');
            
            $data = $this->faqService->getForPublic($locale);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching public FAQ: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Update all FAQ data (section + questions)
     * 
     * @param UpdateAllFaqRequest $request
     * @return JsonResponse
     */
    public function updateAll(UpdateAllFaqRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $data = $request->validated();
            
            // Update section
            if (isset($data['section'])) {
                $this->faqService->updateSection($data['section'], $userId);
            }
            
            // Update Arabic questions
            if (isset($data['arabic_questions'])) {
                $this->faqService->bulkUpdateArabicQuestions(
                    $data['arabic_questions'],
                    $userId
                );
            }
            
            // Update English questions
            if (isset($data['english_questions'])) {
                $this->faqService->bulkUpdateEnglishQuestions(
                    $data['english_questions'],
                    $userId
                );
            }

            Log::info('FAQ updated', [
                'user_id' => $userId,
                'arabic_count' => count($data['arabic_questions'] ?? []),
                'english_count' => count($data['english_questions'] ?? []),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ جميع التغييرات بنجاح',
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating FAQ: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حفظ التغييرات: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark user question as read
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function markAsRead(int $id): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $question = $this->faqService->markQuestionAsRead($id, $userId);

            Log::info('User question marked as read', [
                'question_id' => $id,
                'user_id' => $userId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة السؤال',
                'data' => [
                    'id' => $question->id,
                    'is_read' => $question->is_read,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error marking question as read: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث السؤال',
            ], 500);
        }
    }

    /**
     * Mark user question as unread
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function markAsUnread(int $id): JsonResponse
    {
        try {
            $question = $this->faqService->markQuestionAsUnread($id);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث حالة السؤال',
                'data' => [
                    'id' => $question->id,
                    'is_read' => $question->is_read,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error marking question as unread: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث السؤال',
            ], 500);
        }
    }

    /**
     * Delete user question
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function deleteUserQuestion(int $id): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $this->faqService->deleteUserQuestion($id);

            Log::info('User question deleted', [
                'question_id' => $id,
                'user_id' => $userId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حذف السؤال بنجاح',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting user question: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف السؤال',
            ], 500);
        }
    }

    /**
     * Store user question (from public form)
     * 
     * @param CreateUserQuestionRequest $request
     * @return JsonResponse
     */
    public function storeUserQuestion(CreateUserQuestionRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            
            $question = $this->faqService->createUserQuestion($data);

            Log::info('New user question created', [
                'question_id' => $question->id,
                'email' => $question->email,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إرسال سؤالك بنجاح، سنرد عليك قريباً',
                'data' => [
                    'id' => $question->id,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating user question: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إرسال السؤال',
            ], 500);
        }
    }
}