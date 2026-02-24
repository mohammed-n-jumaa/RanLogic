<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // ✅ أضف هذا السطر
use App\Models\Subscription; // ✅ وهذا أيضاً
use App\Services\TrainingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TrainingController extends Controller
{
    protected $trainingService;

    public function __construct(TrainingService $trainingService)
    {
        $this->trainingService = $trainingService;
    }

    public function index()
{
    try {
        Log::info('=== TrainingController index() started ===');
        
        $trainees = User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->get();
        
        Log::info('Found ' . $trainees->count() . ' trainees');
        
        $result = $trainees->map(function($user) {
            Log::info('Processing user: ' . $user->id);
            
            try {
                // ✅ جلب الاشتراك النشط مباشرة
                $activeSubscription = Subscription::where('user_id', $user->id)
                    ->where('status', 'approved')
                    ->where('ends_at', '>=', now())
                    ->latest()
                    ->first();
                
                Log::info('Active subscription for user ' . $user->id . ': ' . ($activeSubscription ? 'Found' : 'Not found'));
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                    'age' => $user->age,
                    'gender' => $user->gender,
                    'height' => $user->height,
                    'weight' => $user->weight,
                    'waist' => $user->waist,
                    'hips' => $user->hips,
                    'goal' => $user->goal,
                    'workout_place' => $user->workout_place,
                    'program' => $user->program,
                    'health_notes' => $user->health_notes,
                    'is_active' => $user->is_active,
                    'has_active_subscription' => $user->has_active_subscription,
                    'subscription_start_date' => $activeSubscription ? $activeSubscription->starts_at->format('Y-m-d') : null,
                    'subscription_end_date' => $activeSubscription ? $activeSubscription->ends_at->format('Y-m-d') : null,
                    'subscription_plan_type' => $activeSubscription ? $activeSubscription->plan_type : null,
                    'created_at' => $user->created_at,
                ];
            } catch (\Exception $e) {
                Log::error('Error processing user ' . $user->id . ': ' . $e->getMessage());
                Log::error($e->getTraceAsString());
                throw $e;
            }
        });

        Log::info('Successfully processed all trainees');

        return response()->json([
            'success' => true,
            'data' => $result
        ], 200);

    } catch (\Exception $e) {
        Log::error('=== TrainingController index() ERROR ===');
        Log::error('Message: ' . $e->getMessage());
        Log::error('File: ' . $e->getFile() . ':' . $e->getLine());
        Log::error('Trace: ' . $e->getTraceAsString());

        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ أثناء جلب المتدربين',
            'error' => config('app.debug') ? $e->getMessage() : null,
            'file' => config('app.debug') ? $e->getFile() . ':' . $e->getLine() : null,
        ], 500);
    }
}

    /**
     * Get trainee details with plans
     * GET /api/admin/training/trainees/{id}?year=2024&month=1
     */
    public function show(int $id, Request $request): JsonResponse
    {
        try {
            $year = $request->query('year');
            $month = $request->query('month');
            
            $data = $this->trainingService->getTraineeDetails($id, $year, $month);
            
            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'تم جلب البيانات بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'المتدرب غير موجود',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching trainee details: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new trainee with avatar
     * POST /api/admin/training/trainees
     */
    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            Log::info('Store trainee request received', [
                'has_file' => $request->hasFile('avatar'),
                'content_type' => $request->header('Content-Type'),
                'all_data' => $request->except(['password', 'avatar'])
            ]);

            // Manual validation
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email|max:255',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string|max:255',
                'age' => 'nullable|integer|min:1|max:120',
                'height' => 'nullable|numeric|min:0',
                'weight' => 'nullable|numeric|min:0',
                'waist' => 'nullable|numeric|min:0',
                'hips' => 'nullable|numeric|min:0',
                'gender' => 'nullable|in:male,female',
                'goal' => 'nullable|in:weight-loss,muscle-gain,toning,fitness',
                'workout_place' => 'nullable|in:home,gym',
                'program' => 'nullable|string|max:255',
                'health_notes' => 'nullable|string',
                'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            ], [
                'name.required' => 'الاسم مطلوب',
                'email.required' => 'البريد الإلكتروني مطلوب',
                'email.email' => 'البريد الإلكتروني غير صحيح',
                'email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
                'password.required' => 'كلمة المرور مطلوبة',
                'password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
                'avatar.image' => 'يجب أن يكون الملف صورة',
                'avatar.mimes' => 'الصورة يجب أن تكون بصيغة jpeg, jpg, png, gif, أو webp',
                'avatar.max' => 'حجم الصورة يجب ألا يتجاوز 5MB',
            ]);
            
            if ($validator->fails()) {
                Log::error('Validation failed', ['errors' => $validator->errors()->toArray()]);
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في البيانات المدخلة',
                    'errors' => $validator->errors(),
                ], 422);
            }
            
            $data = $request->except(['avatar', '_method']);
            
            // Hash password
            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }
            
            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $avatar = $request->file('avatar');
                
                Log::info('Avatar file details', [
                    'original_name' => $avatar->getClientOriginalName(),
                    'mime_type' => $avatar->getMimeType(),
                    'size' => $avatar->getSize(),
                    'is_valid' => $avatar->isValid()
                ]);
                
                if ($avatar->isValid()) {
                    $avatarPath = $avatar->store('avatars', 'public');
                    $data['avatar'] = $avatarPath;
                    Log::info("Avatar uploaded successfully: {$avatarPath}");
                } else {
                    Log::error('Avatar file is not valid');
                }
            }
            
            // Set role as user (not admin)
            $data['role'] = 'user';
            
            $trainee = $this->trainingService->createTrainee($data);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'تم إضافة المتدرب بنجاح',
                'data' => $trainee,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating trainee: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة المتدرب',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update trainee with avatar
     * PUT/POST /api/admin/training/trainees/{id}
     */
    public function update(int $id, Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            Log::info('Update trainee request received', [
                'id' => $id,
                'has_file' => $request->hasFile('avatar'),
                'content_type' => $request->header('Content-Type'),
                'method' => $request->method()
            ]);

            // Manual validation
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => "sometimes|required|email|max:255|unique:users,email,{$id}",
                'password' => 'sometimes|nullable|string|min:8',
                'phone' => 'nullable|string|max:255',
                'age' => 'nullable|integer|min:1|max:120',
                'height' => 'nullable|numeric|min:0',
                'weight' => 'nullable|numeric|min:0',
                'waist' => 'nullable|numeric|min:0',
                'hips' => 'nullable|numeric|min:0',
                'gender' => 'nullable|in:male,female',
                'goal' => 'nullable|in:weight-loss,muscle-gain,toning,fitness',
                'workout_place' => 'nullable|in:home,gym',
                'program' => 'nullable|string|max:255',
                'health_notes' => 'nullable|string',
                'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
            ]);
            
            if ($validator->fails()) {
                Log::error('Validation failed', ['errors' => $validator->errors()->toArray()]);
                return response()->json([
                    'success' => false,
                    'message' => 'خطأ في البيانات المدخلة',
                    'errors' => $validator->errors(),
                ], 422);
            }
            
            $data = $request->except(['avatar', '_method']);
            
            // Hash password if provided and not empty
            if (isset($data['password']) && !empty($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password']);
            }
            
            // Handle avatar upload
            if ($request->hasFile('avatar')) {
                $trainee = $this->trainingService->getTraineeById($id);
                
                $avatar = $request->file('avatar');
                
                Log::info('Avatar file details', [
                    'original_name' => $avatar->getClientOriginalName(),
                    'mime_type' => $avatar->getMimeType(),
                    'size' => $avatar->getSize(),
                    'is_valid' => $avatar->isValid()
                ]);
                
                if ($avatar->isValid()) {
                    // Delete old avatar if exists
                    if ($trainee->avatar && Storage::disk('public')->exists($trainee->avatar)) {
                        Storage::disk('public')->delete($trainee->avatar);
                        Log::info("Old avatar deleted: {$trainee->avatar}");
                    }
                    
                    $avatarPath = $avatar->store('avatars', 'public');
                    $data['avatar'] = $avatarPath;
                    Log::info("Avatar updated successfully: {$avatarPath}");
                } else {
                    Log::error('Avatar file is not valid');
                }
            }
            
            $trainee = $this->trainingService->updateTrainee($id, $data);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'تم تحديث بيانات المتدرب بنجاح',
                'data' => $trainee,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'المتدرب غير موجود',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating trainee: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث البيانات',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete trainee
     * DELETE /api/admin/training/trainees/{id}
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $trainee = $this->trainingService->getTraineeById($id);
            
            // Delete avatar if exists
            if ($trainee->avatar && Storage::disk('public')->exists($trainee->avatar)) {
                Storage::disk('public')->delete($trainee->avatar);
            }
            
            $this->trainingService->deleteTrainee($id);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف المتدرب بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'المتدرب غير موجود',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting trainee: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف المتدرب',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Save nutrition plan for a trainee
     * POST /api/admin/training/trainees/{userId}/nutrition
     */
    public function saveNutritionPlan(int $userId, Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            Log::info("Saving nutrition plan for user {$userId}");
            Log::info("Request has file (pdf_file): " . ($request->hasFile('pdf_file') ? 'YES' : 'NO'));
            Log::info("Request data keys: " . implode(', ', array_keys($request->all())));
            
            // Get all request data
            $data = $request->all();
            
            // Parse meals JSON if it's a string
            if (isset($data['meals']) && is_string($data['meals'])) {
                $data['meals'] = json_decode($data['meals'], true);
                Log::info("Decoded meals JSON, count: " . (is_array($data['meals']) ? count($data['meals']) : 0));
            }
            
            // Handle PDF file
            if ($request->hasFile('pdf_file')) {
                $pdfFile = $request->file('pdf_file');
                Log::info('PDF file details', [
                    'original_name' => $pdfFile->getClientOriginalName(),
                    'mime_type' => $pdfFile->getMimeType(),
                    'size' => $pdfFile->getSize(),
                    'is_valid' => $pdfFile->isValid()
                ]);
                
                if ($pdfFile->isValid()) {
                    $data['pdf_file'] = $pdfFile;
                } else {
                    Log::error('PDF file is not valid');
                }
            }
            
            // Handle meal images from FormData
            foreach ($request->allFiles() as $key => $file) {
                if (strpos($key, 'image_') === 0) {
                    Log::info("Found meal image: {$key}");
                    $data[$key] = $file;
                }
            }
            
            $plan = $this->trainingService->saveNutritionPlan(
                $userId,
                $data,
                auth()->id()
            );
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حفظ النظام الغذائي بنجاح',
                'data' => $plan,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'المتدرب غير موجود',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving nutrition plan: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حفظ النظام الغذائي',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Save workout plan for a trainee
     * POST /api/admin/training/trainees/{userId}/workout
     */
    public function saveWorkoutPlan(int $userId, Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            Log::info("Saving workout plan for user {$userId}");
            Log::info("Request data keys: " . implode(', ', array_keys($request->all())));
            
            // Get all request data
            $data = $request->all();
            
            // Parse exercises JSON if it's a string
            if (isset($data['exercises']) && is_string($data['exercises'])) {
                $data['exercises'] = json_decode($data['exercises'], true);
                Log::info("Decoded exercises JSON, count: " . (is_array($data['exercises']) ? count($data['exercises']) : 0));
            }
            
            // Handle video files from FormData
            foreach ($request->allFiles() as $key => $file) {
                if (strpos($key, 'video_') === 0) {
                    Log::info("Found exercise video: {$key}");
                    $data[$key] = $file;
                }
            }
            
            $plan = $this->trainingService->saveWorkoutPlan(
                $userId,
                $data,
                auth()->id()
            );
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حفظ البرنامج التدريبي بنجاح',
                'data' => $plan,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'المتدرب غير موجود',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving workout plan: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حفظ البرنامج التدريبي',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle meal item completion status
     * POST /api/admin/training/nutrition/items/{itemId}/toggle
     */
    public function toggleMealItem(int $itemId): JsonResponse
    {
        try {
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
            ], 500);
        }
    }

    /**
     * Toggle exercise completion status
     * POST /api/admin/training/workout/exercises/{exerciseId}/toggle
     */
    public function toggleExercise(int $exerciseId): JsonResponse
    {
        try {
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
            ], 500);
        }
    }

    /**
     * Delete meal
     * DELETE /api/admin/training/nutrition/meals/{mealId}
     */
    public function deleteMeal(int $mealId): JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->trainingService->deleteMeal($mealId);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف الوجبة بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'الوجبة غير موجودة',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting meal: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء الحذف',
            ], 500);
        }
    }

    /**
     * Delete exercise
     * DELETE /api/admin/training/workout/exercises/{exerciseId}
     */
    public function deleteExercise(int $exerciseId): JsonResponse
    {
        DB::beginTransaction();
        try {
            $this->trainingService->deleteExercise($exerciseId);
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف التمرين بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'التمرين غير موجود',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting exercise: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء الحذف',
            ], 500);
        }
    }

    /**
     * Get progress statistics for a trainee
     * GET /api/admin/training/trainees/{userId}/progress?year=2024&month=1
     */
    public function getProgress(int $userId, Request $request): JsonResponse
    {
        try {
            $year = $request->query('year');
            $month = $request->query('month');
            
            $stats = $this->trainingService->getProgressStats($userId, $year, $month);
            
            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'تم جلب الإحصائيات بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'المتدرب غير موجود',
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching progress: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإحصائيات',
            ], 500);
        }
    }
}