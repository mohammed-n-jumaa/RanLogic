<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkoutExercise;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

/**
 * ExerciseLibraryController
 * 
 * PATH: app/Http/Controllers/Api/ExerciseLibraryController.php
 * 
 * Handles the Exercise Library – browsing, creating, updating, and deleting
 * exercises from the workout_exercises table (across all plans).
 */
class ExerciseLibraryController extends Controller
{
    /**
     * GET /api/admin/exercise-library
     * 
     * Returns a paginated list of all exercises.
     * Supports: search (name, notes), filter by exercise_date, sets, reps
     * Sorting: order, newest (created_at desc), date (exercise_date desc)
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = WorkoutExercise::query()->with(['workoutPlan.user']);

            // --- Search ---
            if ($search = $request->query('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('notes', 'like', "%{$search}%");
                });
            }

            // --- Filter: exercise_date ---
            if ($date = $request->query('exercise_date')) {
                $query->whereDate('exercise_date', $date);
            }

            // --- Filter: sets ---
            if ($sets = $request->query('sets')) {
                $query->where('sets', (int)$sets);
            }

            // --- Filter: reps ---
            if ($reps = $request->query('reps')) {
                $query->where('reps', (int)$reps);
            }

            // --- Sorting ---
            $sort = $request->query('sort', 'newest');
            match ($sort) {
                'date'   => $query->orderBy('exercise_date', 'desc'),
                'order'  => $query->orderBy('order')->orderBy('created_at', 'desc'),
                default  => $query->orderBy('created_at', 'desc'),  // newest
            };

            // --- Pagination ---
            $perPage = (int)$request->query('per_page', 20);
            $exercises = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data'    => $exercises,
            ]);

        } catch (\Exception $e) {
            Log::error('ExerciseLibrary index error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب التمارين',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * GET /api/admin/exercise-library/{id}
     * 
     * Returns a single exercise with full details.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $exercise = WorkoutExercise::with(['workoutPlan.user'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data'    => $exercise,
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'التمرين غير موجود',
            ], 404);
        } catch (\Exception $e) {
            Log::error('ExerciseLibrary show error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب التمرين',
            ], 500);
        }
    }

    /**
     * POST /api/admin/exercise-library
     * 
     * Creates a standalone exercise entry.
     * Requires workout_plan_id (the plan this exercise belongs to).
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'workout_plan_id' => 'required|exists:workout_plans,id',
            'exercise_date'   => 'required|date',
            'name'            => 'required|string|max:255',
            'sets'            => 'nullable|integer|min:1|max:100',
            'reps'            => 'nullable|integer|min:1|max:1000',
            'notes'           => 'nullable|string',
            'youtube_url'     => 'nullable|url',
            'video_file'      => 'nullable|file|mimes:mp4,mov,avi,webm|max:102400',
            'order'           => 'nullable|integer|min:0',
        ], [
            'workout_plan_id.required' => 'معرّف خطة التدريب مطلوب',
            'workout_plan_id.exists'   => 'خطة التدريب غير موجودة',
            'exercise_date.required'   => 'تاريخ التمرين مطلوب',
            'name.required'            => 'اسم التمرين مطلوب',
            'video_file.mimes'         => 'صيغة الفيديو غير مدعومة',
            'video_file.max'           => 'حجم الفيديو يجب ألا يتجاوز 100MB',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات',
                'errors'  => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $data = $request->except(['video_file']);
            $data['sets']      = $data['sets'] ?? 3;
            $data['reps']      = $data['reps'] ?? 12;
            $data['completed'] = false;

            if ($request->hasFile('video_file') && $request->file('video_file')->isValid()) {
                $data['video_file'] = $request->file('video_file')->store('exercise_videos', 'public');
            }

            $exercise = WorkoutExercise::create($data);

            DB::commit();

            Log::info("ExerciseLibrary: Created exercise {$exercise->id} - {$exercise->name}");

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة التمرين بنجاح',
                'data'    => $exercise->fresh()->load('workoutPlan.user'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ExerciseLibrary store error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة التمرين',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * POST /api/admin/exercise-library/{id}   (supports _method=PUT via FormData)
     * PUT  /api/admin/exercise-library/{id}
     * 
     * Updates an existing exercise.
     */
    public function update(int $id, Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'exercise_date' => 'sometimes|required|date',
            'name'          => 'sometimes|required|string|max:255',
            'sets'          => 'nullable|integer|min:1|max:100',
            'reps'          => 'nullable|integer|min:1|max:1000',
            'notes'         => 'nullable|string',
            'youtube_url'   => 'nullable|url',
            'video_file'    => 'nullable|file|mimes:mp4,mov,avi,webm|max:102400',
            'order'         => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات',
                'errors'  => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $exercise = WorkoutExercise::findOrFail($id);

            $data = $request->except(['video_file', '_method']);

            if ($request->hasFile('video_file') && $request->file('video_file')->isValid()) {
                // Delete old video
                if ($exercise->video_file && Storage::disk('public')->exists($exercise->video_file)) {
                    Storage::disk('public')->delete($exercise->video_file);
                }
                $data['video_file'] = $request->file('video_file')->store('exercise_videos', 'public');
            }

            $exercise->update($data);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث التمرين بنجاح',
                'data'    => $exercise->fresh()->load('workoutPlan.user'),
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'التمرين غير موجود'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ExerciseLibrary update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء التحديث',
            ], 500);
        }
    }

    /**
     * DELETE /api/admin/exercise-library/{id}
     * 
     * Deletes an exercise and its associated video file.
     */
    public function destroy(int $id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $exercise = WorkoutExercise::findOrFail($id);

            if ($exercise->video_file && Storage::disk('public')->exists($exercise->video_file)) {
                Storage::disk('public')->delete($exercise->video_file);
            }

            $exercise->delete();

            DB::commit();

            Log::info("ExerciseLibrary: Deleted exercise {$id}");

            return response()->json([
                'success' => true,
                'message' => 'تم حذف التمرين بنجاح',
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'التمرين غير موجود'], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ExerciseLibrary destroy error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء الحذف',
            ], 500);
        }
    }

    /**
     * GET /api/admin/exercise-library/stats
     * 
     * Returns quick stats: total exercises, unique names, today count.
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = [
                'total'        => WorkoutExercise::count(),
                'unique_names' => WorkoutExercise::distinct('name')->count('name'),
                'today'        => WorkoutExercise::whereDate('exercise_date', today())->count(),
                'with_video'   => WorkoutExercise::where(function ($q) {
                    $q->whereNotNull('youtube_url')->orWhereNotNull('video_file');
                })->count(),
            ];

            return response()->json(['success' => true, 'data' => $stats]);

        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'حدث خطأ'], 500);
        }
    }
}