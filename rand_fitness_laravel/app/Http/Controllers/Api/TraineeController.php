<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TrainingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TraineeController extends Controller
{
    protected $trainingService;

    public function __construct(TrainingService $trainingService)
    {
        $this->trainingService = $trainingService;
    }

    /**
     * Get current trainee's nutrition plan
     * GET /api/trainee/nutrition-plan?year=2026&month=2
     */
    public function getNutritionPlan(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Only allow regular users (not admins)
            if ($user->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }
            
            $year = $request->query('year', now()->year);
            $month = $request->query('month', now()->month);
            
            $data = $this->trainingService->getTraineeDetails($user->id, $year, $month);
            
            // Return only nutrition plan
            return response()->json([
                'success' => true,
                'data' => [
                    'plan' => $data['nutrition_plan'],
                    'meals' => $data['nutrition_plan']->meals ?? [],
                ],
                'message' => 'تم جلب النظام الغذائي بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching trainee nutrition plan: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get current trainee's workout plan
     * GET /api/trainee/workout-plan?year=2026&month=2
     */
    public function getWorkoutPlan(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Only allow regular users (not admins)
            if ($user->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }
            
            $year = $request->query('year', now()->year);
            $month = $request->query('month', now()->month);
            
            $data = $this->trainingService->getTraineeDetails($user->id, $year, $month);
            
            // Return only workout plan
            return response()->json([
                'success' => true,
                'data' => [
                    'plan' => $data['workout_plan'],
                    'exercises' => $data['workout_plan']->exercises ?? [],
                ],
                'message' => 'تم جلب البرنامج التدريبي بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching trainee workout plan: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Toggle meal item completion
     * POST /api/trainee/nutrition/items/{itemId}/toggle
     */
    public function toggleMealItem(int $itemId, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }
            
            // Verify the item belongs to this user's plan
            $item = \App\Models\NutritionItem::findOrFail($itemId);
            $meal = $item->nutritionMeal;
            $plan = $meal->nutritionPlan;
            
            if ($plan->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }
            
            $item = $this->trainingService->toggleMealItemCompletion($itemId);
            
            return response()->json([
                'success' => true,
                'data' => $item,
                'message' => $item->completed ? 'تم تحديد الوجبة كمكتملة' : 'تم إلغاء اكتمال الوجبة',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'العنصر غير موجود',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error toggling meal item: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Toggle exercise completion
     * POST /api/trainee/workout/exercises/{exerciseId}/toggle
     */
    public function toggleExercise(int $exerciseId, Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }
            
            // Verify the exercise belongs to this user's plan
            $exercise = \App\Models\WorkoutExercise::findOrFail($exerciseId);
            $plan = $exercise->workoutPlan;
            
            if ($plan->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }
            
            $exercise = $this->trainingService->toggleExerciseCompletion($exerciseId);
            
            return response()->json([
                'success' => true,
                'data' => $exercise,
                'message' => $exercise->completed ? 'تم تحديد التمرين كمكتمل' : 'تم إلغاء اكتمال التمرين',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'التمرين غير موجود',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error toggling exercise: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get progress stats
     * GET /api/trainee/progress?year=2026&month=2
     */
    public function getProgress(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user->role !== 'user') {
                return response()->json([
                    'success' => false,
                    'message' => 'غير مصرح',
                ], 403);
            }
            
            $year = $request->query('year', now()->year);
            $month = $request->query('month', now()->month);
            
            $stats = $this->trainingService->getProgressStats($user->id, $year, $month);
            
            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'تم جلب الإحصائيات بنجاح',
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching trainee progress: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإحصائيات',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}