<?php

namespace App\Services;

use App\Models\User;
use App\Models\NutritionPlan;
use App\Models\NutritionMeal;
use App\Models\NutritionItem;
use App\Models\WorkoutPlan;
use App\Models\WorkoutExercise;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class TrainingService
{
    /**
     * Get all trainees (excluding admins)
     */
    public function getAllTrainees()
    {
        $currentMonth = now()->format('Y-m-01');
        
        return User::where('role', '!=', 'admin')
            ->with([
                'nutritionPlans' => function ($query) use ($currentMonth) {
                    $query->where('month_start_date', $currentMonth)->latest();
                },
                'workoutPlans' => function ($query) use ($currentMonth) {
                    $query->where('month_start_date', $currentMonth)->latest();
                }
            ])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getTraineeById(int $userId)
    {
        return User::findOrFail($userId);
    }

    public function getTraineeDetails(int $userId, int $year = null, int $month = null)
    {
        $year = $year ?? now()->year;
        $month = $month ?? now()->month;
        $monthStart = sprintf('%04d-%02d-01', $year, $month);
        
        $user = User::with([
            'nutritionPlans' => function ($query) use ($monthStart) {
                $query->where('month_start_date', $monthStart)
                    ->with(['meals.items']);
            },
            'workoutPlans' => function ($query) use ($monthStart) {
                $query->where('month_start_date', $monthStart)
                    ->with(['exercises']);
            }
        ])->findOrFail($userId);
        
        return [
            'user' => $user,
            'nutrition_plan' => $user->nutritionPlans->first(),
            'workout_plan' => $user->workoutPlans->first(),
        ];
    }

    public function saveNutritionPlan(int $userId, array $data, int $adminId)
    {
        try {
            $year = $data['year'] ?? now()->year;
            $month = $data['month'] ?? now()->month;
            
            $monthStart = Carbon::create($year, $month, 1)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();
            
            Log::info("Creating/Updating nutrition plan for user {$userId}, month {$monthStart}");
            
            // Find or create the plan
            $plan = NutritionPlan::updateOrCreate(
                [
                    'user_id' => $userId,
                    'month_start_date' => $monthStart->toDateString(),
                ],
                [
                    'month_end_date' => $monthEnd->toDateString(),
                    'updated_by' => $adminId,
                    'created_by' => $adminId,
                ]
            );
            
            Log::info("Plan created/updated with ID: {$plan->id}");
            
            // Handle PDF upload
            if (isset($data['pdf_file']) && $data['pdf_file'] instanceof \Illuminate\Http\UploadedFile) {
                Log::info("Processing PDF file");
                
                // Delete old PDF if exists
                if ($plan->pdf_file && Storage::disk('public')->exists($plan->pdf_file)) {
                    Storage::disk('public')->delete($plan->pdf_file);
                    Log::info("Old PDF deleted: {$plan->pdf_file}");
                }
                
                $pdfPath = $data['pdf_file']->store('nutrition_pdfs', 'public');
                $plan->update(['pdf_file' => $pdfPath]);
                Log::info("PDF uploaded successfully: {$pdfPath}");
            }
            
            // Handle meals
            $mealsData = $data['meals'] ?? [];
            
            if (is_array($mealsData) && count($mealsData) > 0) {
                Log::info("Processing " . count($mealsData) . " meals");
                
                // Get existing meal IDs to determine which ones to keep
                $existingMealIds = $plan->meals()->pluck('id')->toArray();
                $processedMealIds = [];
                
                foreach ($mealsData as $index => $mealData) {
                    Log::info("Processing meal {$index}: " . json_encode($mealData));
                    
                    // Handle meal image from FormData
                    $mealImageFile = null;
                    if (isset($mealData['meal_image_key']) && isset($data[$mealData['meal_image_key']])) {
                        $mealImageFile = $data[$mealData['meal_image_key']];
                        Log::info("Found meal image file for key: {$mealData['meal_image_key']}");
                    }
                    
                    $savedMeal = $this->saveMeal($plan->id, $mealData, $mealImageFile);
                    $processedMealIds[] = $savedMeal->id;
                }
                
                // Delete meals that were not in the update
                $mealsToDelete = array_diff($existingMealIds, $processedMealIds);
                if (!empty($mealsToDelete)) {
                    Log::info("Deleting removed meals: " . implode(', ', $mealsToDelete));
                    NutritionMeal::whereIn('id', $mealsToDelete)->delete();
                }
            } else {
                Log::warning("No meals data provided or invalid format");
            }
            
            Log::info("Nutrition plan saved successfully for user {$userId}");
            
            // Reload with relationships
            return $plan->fresh()->load(['meals.items']);
            
        } catch (\Exception $e) {
            Log::error("Error saving nutrition plan: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    private function saveMeal(int $planId, array $mealData, $mealImageFile = null)
    {
        Log::info("Saving meal for plan {$planId}", ['meal_data' => $mealData]);
        
        $mealId = $mealData['id'] ?? null;
        
        // Only use ID if it's numeric (not temp-xxx)
        if ($mealId && is_string($mealId) && strpos($mealId, 'temp-') === 0) {
            $mealId = null;
        }
        
        // Prepare meal data
        $mealAttributes = [
            'nutrition_plan_id' => $planId,
            'meal_date' => $mealData['meal_date'],
            'meal_type' => $mealData['meal_type'],
            'meal_time' => $mealData['meal_time'] ?? '12:00',
            'order' => $mealData['order'] ?? 0,
        ];
        
        // Create or update meal
        if ($mealId) {
            Log::info("Updating existing meal with ID: {$mealId}");
            $meal = NutritionMeal::findOrFail($mealId);
            $meal->update($mealAttributes);
        } else {
            Log::info("Creating new meal");
            $meal = NutritionMeal::create($mealAttributes);
        }
        
        Log::info("Meal saved with ID: {$meal->id}");
        
        // Handle meal image upload
        if ($mealImageFile && $mealImageFile instanceof \Illuminate\Http\UploadedFile) {
            Log::info("Processing meal image upload");
            
            // Delete old image if exists
            if ($meal->meal_image && Storage::disk('public')->exists($meal->meal_image)) {
                Storage::disk('public')->delete($meal->meal_image);
                Log::info("Old meal image deleted: {$meal->meal_image}");
            }
            
            $imagePath = $mealImageFile->store('meal_images', 'public');
            $meal->update(['meal_image' => $imagePath]);
            Log::info("Meal image uploaded successfully: {$imagePath}");
        }
        
        // Handle items
        if (isset($mealData['items']) && is_array($mealData['items'])) {
            Log::info("Processing " . count($mealData['items']) . " items for meal {$meal->id}");
            
            // Delete all existing items
            $meal->items()->delete();
            Log::info("Deleted existing items for meal {$meal->id}");
            
            // Create new items
            foreach ($mealData['items'] as $itemData) {
                $item = NutritionItem::create([
                    'nutrition_meal_id' => $meal->id,
                    'name' => $itemData['name'],
                    'calories' => $itemData['calories'] ?? 0,
                    'protein' => $itemData['protein'] ?? 0,
                    'carbs' => $itemData['carbs'] ?? 0,
                    'fats' => $itemData['fats'] ?? 0,
                    'completed' => $itemData['completed'] ?? false,
                    'order' => $itemData['order'] ?? 0,
                ]);
                Log::info("Item created with ID: {$item->id}, name: {$item->name}");
            }
        } else {
            Log::info("No items provided for meal {$meal->id}");
        }
        
        return $meal->fresh()->load('items');
    }

    public function saveWorkoutPlan(int $userId, array $data, int $adminId)
    {
        try {
            $year = $data['year'] ?? now()->year;
            $month = $data['month'] ?? now()->month;
            
            $monthStart = Carbon::create($year, $month, 1)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();
            
            Log::info("Creating/Updating workout plan for user {$userId}, month {$monthStart}");
            
            // Find or create the plan
            $plan = WorkoutPlan::updateOrCreate(
                [
                    'user_id' => $userId,
                    'month_start_date' => $monthStart->toDateString(),
                ],
                [
                    'month_end_date' => $monthEnd->toDateString(),
                    'updated_by' => $adminId,
                    'created_by' => $adminId,
                ]
            );
            
            Log::info("Plan created/updated with ID: {$plan->id}");
            
            // Handle exercises
            $exercisesData = $data['exercises'] ?? [];
            
            if (is_array($exercisesData) && count($exercisesData) > 0) {
                Log::info("Processing " . count($exercisesData) . " exercises");
                
                // Get existing exercise IDs to determine which ones to keep
                $existingExerciseIds = $plan->exercises()->pluck('id')->toArray();
                $processedExerciseIds = [];
                
                foreach ($exercisesData as $index => $exerciseData) {
                    Log::info("Processing exercise {$index}: " . json_encode($exerciseData));
                    
                    // Handle video file from FormData
                    $videoFile = null;
                    if (isset($exerciseData['video_file_key']) && isset($data[$exerciseData['video_file_key']])) {
                        $videoFile = $data[$exerciseData['video_file_key']];
                        Log::info("Found video file for key: {$exerciseData['video_file_key']}");
                    }
                    
                    $savedExercise = $this->saveExercise($plan->id, $exerciseData, $videoFile);
                    $processedExerciseIds[] = $savedExercise->id;
                }
                
                // Delete exercises that were not in the update
                $exercisesToDelete = array_diff($existingExerciseIds, $processedExerciseIds);
                if (!empty($exercisesToDelete)) {
                    Log::info("Deleting removed exercises: " . implode(', ', $exercisesToDelete));
                    WorkoutExercise::whereIn('id', $exercisesToDelete)->delete();
                }
            } else {
                Log::warning("No exercises data provided or invalid format");
            }
            
            Log::info("Workout plan saved successfully for user {$userId}");
            
            // Reload with relationships
            return $plan->fresh()->load(['exercises']);
            
        } catch (\Exception $e) {
            Log::error("Error saving workout plan: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    private function saveExercise(int $planId, array $exerciseData, $videoFile = null)
    {
        Log::info("Saving exercise for plan {$planId}", ['exercise_data' => $exerciseData]);
        
        $exerciseId = $exerciseData['id'] ?? null;
        
        // Only use ID if it's numeric (not temp-xxx)
        if ($exerciseId && is_string($exerciseId) && strpos($exerciseId, 'temp-') === 0) {
            $exerciseId = null;
        }
        
        // Prepare exercise data
        $exerciseAttributes = [
            'workout_plan_id' => $planId,
            'exercise_date' => $exerciseData['exercise_date'],
            'name' => $exerciseData['name'],
            'sets' => $exerciseData['sets'] ?? 3,
            'reps' => $exerciseData['reps'] ?? 12,
            'notes' => $exerciseData['notes'] ?? null,
            'youtube_url' => $exerciseData['youtube_url'] ?? null,
            'completed' => $exerciseData['completed'] ?? false,
            'order' => $exerciseData['order'] ?? 0,
        ];
        
        // Create or update exercise
        if ($exerciseId) {
            Log::info("Updating existing exercise with ID: {$exerciseId}");
            $exercise = WorkoutExercise::findOrFail($exerciseId);
            $exercise->update($exerciseAttributes);
        } else {
            Log::info("Creating new exercise");
            $exercise = WorkoutExercise::create($exerciseAttributes);
        }
        
        Log::info("Exercise saved with ID: {$exercise->id}");
        
        // Handle video upload
        if ($videoFile && $videoFile instanceof \Illuminate\Http\UploadedFile) {
            Log::info("Processing video upload");
            
            // Delete old video if exists
            if ($exercise->video_file && Storage::disk('public')->exists($exercise->video_file)) {
                Storage::disk('public')->delete($exercise->video_file);
                Log::info("Old video deleted: {$exercise->video_file}");
            }
            
            $videoPath = $videoFile->store('exercise_videos', 'public');
            $exercise->update(['video_file' => $videoPath]);
            Log::info("Exercise video uploaded successfully: {$videoPath}");
        }
        
        return $exercise->fresh();
    }

    public function toggleMealItemCompletion(int $itemId)
    {
        $item = NutritionItem::findOrFail($itemId);
        
        if ($item->completed) {
            $item->markAsIncomplete();
        } else {
            $item->markAsCompleted();
        }
        
        return $item->fresh();
    }

    public function toggleExerciseCompletion(int $exerciseId)
    {
        $exercise = WorkoutExercise::findOrFail($exerciseId);
        
        if ($exercise->completed) {
            $exercise->markAsIncomplete();
        } else {
            $exercise->markAsCompleted();
        }
        
        return $exercise->fresh();
    }

    public function deleteMeal(int $mealId)
    {
        $meal = NutritionMeal::findOrFail($mealId);
        
        if ($meal->meal_image && Storage::disk('public')->exists($meal->meal_image)) {
            Storage::disk('public')->delete($meal->meal_image);
        }
        
        $meal->delete();
        Log::info("Meal {$mealId} deleted");
    }

    public function deleteExercise(int $exerciseId)
    {
        $exercise = WorkoutExercise::findOrFail($exerciseId);
        
        if ($exercise->video_file && Storage::disk('public')->exists($exercise->video_file)) {
            Storage::disk('public')->delete($exercise->video_file);
        }
        
        $exercise->delete();
        Log::info("Exercise {$exerciseId} deleted");
    }

    public function getProgressStats(int $userId, int $year = null, int $month = null)
    {
        $year = $year ?? now()->year;
        $month = $month ?? now()->month;
        $monthStart = sprintf('%04d-%02d-01', $year, $month);
        
        $nutritionPlan = NutritionPlan::where('user_id', $userId)
            ->where('month_start_date', $monthStart)
            ->with(['meals.items'])
            ->first();
        
        $workoutPlan = WorkoutPlan::where('user_id', $userId)
            ->where('month_start_date', $monthStart)
            ->with(['exercises'])
            ->first();
        
        return [
            'nutrition' => [
                'total_meals' => $nutritionPlan ? $nutritionPlan->meals->count() : 0,
                'total_items' => $nutritionPlan ? $nutritionPlan->meals->sum(fn($m) => $m->items->count()) : 0,
                'completed_items' => $nutritionPlan ? $nutritionPlan->meals->sum(fn($m) => $m->items->where('completed', true)->count()) : 0,
                'completion_percentage' => $nutritionPlan ? $nutritionPlan->completion_percentage : 0,
                'total_calories' => $nutritionPlan ? $nutritionPlan->total_calories : 0,
            ],
            'workout' => [
                'total_exercises' => $workoutPlan ? $workoutPlan->total_exercises : 0,
                'completed_exercises' => $workoutPlan ? $workoutPlan->completed_exercises : 0,
                'completion_percentage' => $workoutPlan ? $workoutPlan->completion_percentage : 0,
            ],
        ];
    }

    public function createTrainee(array $data)
    {
        $data['role'] = 'user'; // Ensure role is user
        return User::create($data);
    }

    public function updateTrainee(int $userId, array $data)
    {
        $user = User::findOrFail($userId);
        $user->update($data);
        return $user->fresh();
    }

    public function deleteTrainee(int $userId)
    {
        $user = User::findOrFail($userId);
        
        // Delete avatar if exists
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }
        
        $user->delete();
        Log::info("Trainee {$userId} deleted");
    }
}