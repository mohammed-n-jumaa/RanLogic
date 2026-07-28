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
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date as ExcelDate;

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
            
            if (isset($data['pdf_file']) && $data['pdf_file'] instanceof \Illuminate\Http\UploadedFile) {
                Log::info("Processing workout PDF file");
                
                $tempPath = $data['pdf_file']->store('temp', 'local');
                Log::info("Temporary saved at: " . $tempPath);
                Log::info("Full temp path: " . storage_path('app/' . $tempPath));
                
                $pdfPath = $data['pdf_file']->store('workout_pdfs', 'public');
                Log::info("Final saved at: " . $pdfPath);
                
                $plan->update(['pdf_file' => $pdfPath]);
            }
            
            $mealsData = $data['meals'] ?? [];
            
            if (is_array($mealsData) && count($mealsData) > 0) {
                Log::info("Processing " . count($mealsData) . " meals");
                
                $existingMealIds = $plan->meals()->pluck('id')->toArray();
                $processedMealIds = [];
                
                foreach ($mealsData as $index => $mealData) {
                    Log::info("Processing meal {$index}: " . json_encode($mealData));
                    
                    $mealImageFile = null;
                    if (isset($mealData['meal_image_key']) && isset($data[$mealData['meal_image_key']])) {
                        $mealImageFile = $data[$mealData['meal_image_key']];
                        Log::info("Found meal image file for key: {$mealData['meal_image_key']}");
                    }
                    
                    $savedMeal = $this->saveMeal($plan->id, $mealData, $mealImageFile);
                    $processedMealIds[] = $savedMeal->id;
                }
                
                $mealsToDelete = array_diff($existingMealIds, $processedMealIds);
                if (!empty($mealsToDelete)) {
                    Log::info("Deleting removed meals: " . implode(', ', $mealsToDelete));
                    NutritionMeal::whereIn('id', $mealsToDelete)->delete();
                }
            } else {
                Log::warning("No meals data provided or invalid format");
            }
            
            Log::info("Nutrition plan saved successfully for user {$userId}");
            
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
        
        if ($mealId && is_string($mealId) && strpos($mealId, 'temp-') === 0) {
            $mealId = null;
        }
        
        $mealAttributes = [
            'nutrition_plan_id' => $planId,
            'meal_date' => $mealData['meal_date'],
            'meal_type' => $mealData['meal_type'],
            'meal_time' => $mealData['meal_time'] ?? '12:00',
            'order' => $mealData['order'] ?? 0,
        ];
        
        if ($mealId) {
            Log::info("Updating existing meal with ID: {$mealId}");
            $meal = NutritionMeal::findOrFail($mealId);
            $meal->update($mealAttributes);
        } else {
            Log::info("Creating new meal");
            $meal = NutritionMeal::create($mealAttributes);
        }
        
        Log::info("Meal saved with ID: {$meal->id}");
        
        if ($mealImageFile && $mealImageFile instanceof \Illuminate\Http\UploadedFile) {
            Log::info("Processing meal image upload");
            
            if ($meal->meal_image && Storage::disk('public')->exists($meal->meal_image)) {
                Storage::disk('public')->delete($meal->meal_image);
                Log::info("Old meal image deleted: {$meal->meal_image}");
            }
            
            $imagePath = $mealImageFile->store('meal_images', 'public');
            $meal->update(['meal_image' => $imagePath]);
            Log::info("Meal image uploaded successfully: {$imagePath}");
        }
        
        if (isset($mealData['items']) && is_array($mealData['items'])) {
            Log::info("Processing " . count($mealData['items']) . " items for meal {$meal->id}");
            
            $meal->items()->delete();
            Log::info("Deleted existing items for meal {$meal->id}");
            
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
            $year  = $data['year']  ?? now()->year;
            $month = $data['month'] ?? now()->month;

            $monthStart = Carbon::create($year, $month, 1)->startOfMonth();
            $monthEnd   = $monthStart->copy()->endOfMonth();

            Log::info("Creating/Updating workout plan for user {$userId}, month {$monthStart}");

            $plan = WorkoutPlan::updateOrCreate(
                [
                    'user_id'          => $userId,
                    'month_start_date' => $monthStart->toDateString(),
                ],
                [
                    'month_end_date' => $monthEnd->toDateString(),
                    'updated_by'     => $adminId,
                    'created_by'     => $adminId,
                ]
            );

            Log::info("Plan created/updated with ID: {$plan->id}");

            if (isset($data['pdf_file']) && $data['pdf_file'] instanceof \Illuminate\Http\UploadedFile) {
                Log::info("Processing workout PDF file");
                
                if ($plan->pdf_file && Storage::disk('public')->exists($plan->pdf_file)) {
                    Storage::disk('public')->delete($plan->pdf_file);
                    Log::info("Old workout PDF deleted: {$plan->pdf_file}");
                }
                
                $pdfPath = $data['pdf_file']->store('workout_pdfs', 'public');
                
                if ($pdfPath) {
                    $plan->update(['pdf_file' => $pdfPath]);
                    Log::info("Workout PDF uploaded successfully: {$pdfPath}");
                    Log::info("Full storage path: " . storage_path('app/public/' . $pdfPath));
                } else {
                    Log::error("Failed to save PDF file");
                    throw new \Exception('فشل في حفظ ملف PDF');
                }
            } else {
                Log::info("No PDF file to upload or not a valid UploadedFile");
                if (isset($data['pdf_file'])) {
                    Log::info("pdf_file exists but type is: " . gettype($data['pdf_file']));
                }
            }

            $exercisesData = $data['exercises'] ?? [];

            if (is_array($exercisesData) && count($exercisesData) > 0) {
                Log::info("Processing " . count($exercisesData) . " exercises");

                $existingExerciseIds  = $plan->exercises()->pluck('id')->toArray();
                $processedExerciseIds = [];

                foreach ($exercisesData as $index => $exerciseData) {
                    Log::info("Processing exercise {$index}");

                    $videoFile = null;
                    if (isset($exerciseData['video_file_key']) && isset($data[$exerciseData['video_file_key']])) {
                        $videoFile = $data[$exerciseData['video_file_key']];
                        Log::info("Found video file for exercise {$index}");
                    }

                    $savedExercise          = $this->saveExercise($plan->id, $exerciseData, $videoFile);
                    $processedExerciseIds[] = $savedExercise->id;
                }

                $exercisesToDelete = array_diff($existingExerciseIds, $processedExerciseIds);
                if (!empty($exercisesToDelete)) {
                    Log::info("Deleting removed exercises: " . implode(', ', $exercisesToDelete));
                    
                    foreach ($exercisesToDelete as $exerciseId) {
                        $exercise = WorkoutExercise::find($exerciseId);
                        if ($exercise && $exercise->video_file && Storage::disk('public')->exists($exercise->video_file)) {
                            Storage::disk('public')->delete($exercise->video_file);
                            Log::info("Deleted video for exercise {$exerciseId}");
                        }
                    }
                    
                    WorkoutExercise::whereIn('id', $exercisesToDelete)->delete();
                }
            } else {
                Log::info("No exercises data provided");
            }

            Log::info("Workout plan saved successfully for user {$userId}");

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
        
        if ($exerciseId && is_string($exerciseId) && strpos($exerciseId, 'temp-') === 0) {
            $exerciseId = null;
        }
        
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
        
        if ($exerciseId) {
            Log::info("Updating existing exercise with ID: {$exerciseId}");
            $exercise = WorkoutExercise::findOrFail($exerciseId);
            $exercise->update($exerciseAttributes);
        } else {
            Log::info("Creating new exercise");
            $exercise = WorkoutExercise::create($exerciseAttributes);
        }
        
        Log::info("Exercise saved with ID: {$exercise->id}");
        
        if ($videoFile && $videoFile instanceof \Illuminate\Http\UploadedFile) {
            Log::info("Processing video upload");
            
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
        $data['role'] = 'user';
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
        
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }
        
        $user->delete();
        Log::info("Trainee {$userId} deleted");
    }

    /**
     * Import exercises from Excel file
     */
    public function importExercisesFromExcel(int $userId, $excelFile, int $year, int $month, bool $replaceExisting = false): array
    {
        try {
            $monthStart = Carbon::create($year, $month, 1)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();

            Log::info("=== START IMPORT ===");
            Log::info("User ID: {$userId}");
            Log::info("Year: {$year}, Month: {$month}");
            Log::info("Month start: {$monthStart->toDateString()}");
            Log::info("Month end: {$monthEnd->toDateString()}");

            $plan = WorkoutPlan::where('user_id', $userId)
                ->where('month_start_date', $monthStart->toDateString())
                ->first();

            if (!$plan) {
                Log::info("Workout plan not found, creating new one...");
                
                $plan = WorkoutPlan::create([
                    'user_id' => $userId,
                    'month_start_date' => $monthStart->toDateString(),
                    'month_end_date' => $monthEnd->toDateString(),
                    'created_by' => auth()->id() ?? 1,
                    'updated_by' => auth()->id() ?? 1,
                ]);
                
                Log::info("Created new workout plan with ID: {$plan->id}");
            } else {
                Log::info("Found existing workout plan with ID: {$plan->id}");
            }

            if (!$plan || !$plan->id) {
                throw new \Exception("Failed to create or find workout plan");
            }

            $spreadsheet = IOFactory::load($excelFile->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $rows = $worksheet->toArray();

            if (empty($rows) || count($rows) < 2) {
                throw new \Exception('الملف فارغ أو لا يحتوي على بيانات');
            }

            $headers = array_map('trim', array_map('strtolower', $rows[0]));
            Log::info("Headers: " . json_encode($headers));

            $dateColumnIndex = null;
            $nameColumnIndex = null;
            $setsColumnIndex = null;
            $repsColumnIndex = null;
            $notesColumnIndex = null;
            $youtubeColumnIndex = null;

            foreach ($headers as $index => $header) {
                if (in_array($header, ['exercise_date', 'date', 'التاريخ', 'تاريخ التمرين', 'day'])) {
                    $dateColumnIndex = $index;
                }
                if (in_array($header, ['name', 'exercise', 'التمرين', 'اسم التمرين', 'title'])) {
                    $nameColumnIndex = $index;
                }
                if (in_array($header, ['sets', 'set', 'مجموعات', 'عدد المجموعات'])) {
                    $setsColumnIndex = $index;
                }
                if (in_array($header, ['reps', 'rep', 'تكرارات', 'عدد التكرارات'])) {
                    $repsColumnIndex = $index;
                }
                if (in_array($header, ['notes', 'note', 'ملاحظات', 'ملاحظة'])) {
                    $notesColumnIndex = $index;
                }
                if (in_array($header, ['youtube_url', 'youtube', 'رابط يوتيوب', 'url'])) {
                    $youtubeColumnIndex = $index;
                }
            }

            if ($dateColumnIndex === null) {
                throw new \Exception("العمود المطلوب 'exercise_date' أو 'التاريخ' غير موجود. الأعمدة الموجودة: " . implode(', ', $headers));
            }

            if ($nameColumnIndex === null) {
                throw new \Exception("العمود المطلوب 'name' أو 'التمرين' غير موجود. الأعمدة الموجودة: " . implode(', ', $headers));
            }

            Log::info("Date column index: {$dateColumnIndex}");
            Log::info("Name column index: {$nameColumnIndex}");

            $exercisesData = [];
            $errors = [];
            $imported = 0;

            for ($i = 1; $i < count($rows); $i++) {
                $row = $rows[$i];
                $rowNumber = $i + 1;
                
                if (empty($row[$dateColumnIndex]) && empty($row[$nameColumnIndex])) {
                    continue;
                }
                
                try {
                    $dateValue = trim($row[$dateColumnIndex] ?? '');
                    if (empty($dateValue)) {
                        throw new \Exception("تاريخ التمرين فارغ");
                    }
                    
                    $nameValue = trim($row[$nameColumnIndex] ?? '');
                    if (empty($nameValue)) {
                        throw new \Exception("اسم التمرين فارغ");
                    }
                    
                    $exerciseDate = $this->parseDateFromExcel($dateValue, $monthStart, $monthEnd);
                    
                    if (!$exerciseDate) {
                        throw new \Exception("تاريخ غير صالح: '{$dateValue}' - الصيغة المطلوبة: Y-m-d (مثال: 2026-04-01)");
                    }
                    
                    $sets = 3;
                    if ($setsColumnIndex !== null && isset($row[$setsColumnIndex]) && !empty($row[$setsColumnIndex])) {
                        $sets = (int)$row[$setsColumnIndex];
                        if ($sets < 1) $sets = 1;
                        if ($sets > 100) $sets = 100;
                    }
                    
                    $reps = 12;
                    if ($repsColumnIndex !== null && isset($row[$repsColumnIndex]) && !empty($row[$repsColumnIndex])) {
                        $reps = (int)$row[$repsColumnIndex];
                        if ($reps < 1) $reps = 1;
                        if ($reps > 1000) $reps = 1000;
                    }
                    
                    $notes = '';
                    if ($notesColumnIndex !== null && isset($row[$notesColumnIndex])) {
                        $notes = trim($row[$notesColumnIndex]);
                    }
                    
                    $youtubeUrl = '';
                    if ($youtubeColumnIndex !== null && isset($row[$youtubeColumnIndex])) {
                        $youtubeUrl = trim($row[$youtubeColumnIndex]);
                        if (!empty($youtubeUrl) && !filter_var($youtubeUrl, FILTER_VALIDATE_URL)) {
                            $youtubeUrl = '';
                        }
                    }
                    
                    $exercisesData[] = [
                        'workout_plan_id' => $plan->id,
                        'exercise_date' => $exerciseDate,
                        'name' => $nameValue,
                        'sets' => $sets,
                        'reps' => $reps,
                        'notes' => $notes,
                        'youtube_url' => $youtubeUrl,
                        'completed' => false,
                        'order' => $i,
                    ];
                    
                    Log::info("Row {$rowNumber}: Added exercise '{$nameValue}' on {$exerciseDate} for plan {$plan->id}");
                    
                } catch (\Exception $e) {
                    $errors[] = "صف {$rowNumber}: " . $e->getMessage();
                    Log::warning("Row {$rowNumber} error: " . $e->getMessage());
                }
            }

            if ($replaceExisting) {
                $deletedCount = WorkoutExercise::where('workout_plan_id', $plan->id)->delete();
                Log::info("Deleted {$deletedCount} existing exercises for plan {$plan->id}");
            }

            foreach ($exercisesData as $data) {
                $exercise = WorkoutExercise::create($data);
                $imported++;
                Log::info("Created exercise ID: {$exercise->id} for plan {$plan->id}");
            }

            Log::info("=== IMPORT COMPLETE: {$imported} exercises imported for plan {$plan->id} ===");

            return [
                'imported' => $imported,
                'skipped' => 0,
                'errors' => $errors,
                'exercises' => WorkoutExercise::where('workout_plan_id', $plan->id)->get(),
            ];
            
        } catch (\Exception $e) {
            Log::error("Import error: " . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    private function mapExcelHeaders(array $headers): array
    {
        $mapping = [];
        
        $lowerHeaders = array_map('strtolower', $headers);
        
        $headerMap = [
            'exercise_date' => ['exercise_date', 'date', 'التاريخ', 'تاريخ التمرين', 'day', 'اليوم', 'exercisedate'],
            'name' => ['name', 'exercise', 'التمرين', 'اسم التمرين', 'title', 'العنوان', 'exercisename'],
            'sets' => ['sets', 'set', 'مجموعات', 'عدد المجموعات', 'groups', 'setcount'],
            'reps' => ['reps', 'rep', 'تكرارات', 'عدد التكرارات', 'repetitions', 'repcount'],
            'notes' => ['notes', 'note', 'ملاحظات', 'ملاحظة', 'remarks', 'description'],
            'youtube_url' => ['youtube_url', 'youtube', 'youtube link', 'رابط يوتيوب', 'video_url', 'video link', 'url'],
        ];
        
        foreach ($lowerHeaders as $index => $header) {
            foreach ($headerMap as $field => $possibleNames) {
                if (in_array($header, $possibleNames)) {
                    $mapping[$field] = $index;
                    Log::info("Mapped header '{$header}' to field '{$field}' at index {$index}");
                    break;
                }
            }
        }
        
        return $mapping;
    }

    private function parseDateFromExcel($value, Carbon $monthStart, Carbon $monthEnd): ?string
{
    if (empty($value)) return null;

    $parsedDate = null;

    if (is_numeric($value)) {
        try {
            $date = ExcelDate::excelToDateTimeObject($value);
            $parsedDate = $date->format('Y-m-d');
        } catch (\Exception $e) {}
    }

    if (!$parsedDate) {
        $formats = ['Y-m-d', 'd/m/Y', 'm/d/Y', 'Y/m/d', 'd-m-Y', 'm-d-Y', 'n/j/Y', 'j/n/Y'];
        foreach ($formats as $format) {
            try {
                $date = Carbon::createFromFormat($format, (string)$value);
                if ($date && $date->format($format) === (string)$value) {
                    $parsedDate = $date->format('Y-m-d');
                    break;
                }
            } catch (\Exception $e) { continue; }
        }
    }

    if (!$parsedDate) {
        try {
            $parsedDate = (new Carbon((string)$value))->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    try {
        $carbon = Carbon::parse($parsedDate);
        if (!$carbon->between($monthStart, $monthEnd)) {
            Log::warning("Date {$parsedDate} outside range {$monthStart} - {$monthEnd}");
            return null;
        }
    } catch (\Exception $e) {
        return null;
    }

    return $parsedDate;
}

    private function getCellValueByMapping(array $row, array $fieldMapping, string $field): string
    {
        $index = $fieldMapping[$field] ?? null;
        if ($index === null) {
            return '';
        }
        
        if (is_int($index)) {
            return isset($row[$index]) ? (string)$row[$index] : '';
        }
        
        $headers = array_keys($fieldMapping);
        $columnIndex = array_search($field, $headers);
        if ($columnIndex !== false && isset($row[$columnIndex])) {
            return (string)$row[$columnIndex];
        }
        
        return '';
    }

    private function parseExcelRowDetailed(array $row, array $fieldMapping, Carbon $monthStart, Carbon $monthEnd): ?array
    {
        $dateValue = $this->getCellValueByMapping($row, $fieldMapping, 'exercise_date');
        $exerciseDate = $this->parseDateDetailed($dateValue, $monthStart, $monthEnd);
        
        if (!$exerciseDate) {
            throw new \Exception("تاريخ غير صالح: '" . $dateValue . "' - يجب أن يكون بين {$monthStart->format('Y-m-d')} و {$monthEnd->format('Y-m-d')}");
        }
        
        $name = trim($this->getCellValueByMapping($row, $fieldMapping, 'name'));
        if (empty($name)) {
            throw new \Exception("اسم التمرين مطلوب");
        }
        
        $setsValue = $this->getCellValueByMapping($row, $fieldMapping, 'sets');
        $sets = $this->parseIntegerDetailed($setsValue, 3, 1, 100);
        
        $repsValue = $this->getCellValueByMapping($row, $fieldMapping, 'reps');
        $reps = $this->parseIntegerDetailed($repsValue, 12, 1, 1000);
        
        $notes = '';
        if (isset($fieldMapping['notes'])) {
            $notes = trim($this->getCellValueByMapping($row, $fieldMapping, 'notes'));
        }
        
        $youtubeUrl = '';
        if (isset($fieldMapping['youtube_url'])) {
            $youtubeUrl = trim($this->getCellValueByMapping($row, $fieldMapping, 'youtube_url'));
            if (!empty($youtubeUrl) && !filter_var($youtubeUrl, FILTER_VALIDATE_URL)) {
                $youtubeUrl = '';
            }
        }
        
        return [
            'exercise_date' => $exerciseDate,
            'name' => $name,
            'sets' => $sets,
            'reps' => $reps,
            'notes' => $notes,
            'youtube_url' => $youtubeUrl,
        ];
    }

    private function parseDateDetailed($value, Carbon $monthStart, Carbon $monthEnd): ?string
    {
        if (empty($value)) {
            return null;
        }
        
        if (is_numeric($value)) {
            try {
                $date = ExcelDate::excelToDateTimeObject($value);
                return $date->format('Y-m-d');
            } catch (\Exception $e) {
            }
        }
        
        $formats = ['Y-m-d', 'd/m/Y', 'm/d/Y', 'Y/m/d', 'd-m-Y', 'm-d-Y'];
        foreach ($formats as $format) {
            try {
                $date = Carbon::createFromFormat($format, (string)$value);
                if ($date && $date->between($monthStart, $monthEnd)) {
                    return $date->format('Y-m-d');
                }
            } catch (\Exception $e) {
            }
        }
        
        try {
            $date = new Carbon((string)$value);
            if ($date->between($monthStart, $monthEnd)) {
                return $date->format('Y-m-d');
            }
        } catch (\Exception $e) {
        }
        
        return null;
    }

    private function parseIntegerDetailed($value, int $default, int $min, int $max): int
    {
        if (empty($value) && $value !== 0 && $value !== '0') {
            return $default;
        }
        
        $intValue = (int)$value;
        
        if ($intValue < $min) {
            return $min;
        }
        
        if ($intValue > $max) {
            return $max;
        }
        
        return $intValue;
    }
}