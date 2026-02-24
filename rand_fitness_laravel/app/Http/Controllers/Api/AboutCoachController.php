<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAboutCoachRequest;
use App\Http\Requests\UploadCoachImageRequest;
use App\Services\AboutCoachService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AboutCoachController extends Controller
{
    protected $aboutCoachService;

    public function __construct(AboutCoachService $aboutCoachService)
    {
        $this->aboutCoachService = $aboutCoachService;
        
        // Admin-only routes
        $this->middleware('auth:sanctum')->except(['show']);
    }

    /**
     * Get about coach data for admin
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $about = $this->aboutCoachService->getAboutCoach();

            if (!$about) {
                return response()->json([
                    'success' => true,
                    'data' => null,
                    'message' => 'لا توجد بيانات. يرجى إضافة البيانات أولاً',
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $about->id,
                    'image_url' => $about->image_url,
                    'badge_en' => $about->badge_en,
                    'badge_ar' => $about->badge_ar,
                    'title_en' => $about->title_en,
                    'title_ar' => $about->title_ar,
                    'main_description_en' => $about->main_description_en,
                    'main_description_ar' => $about->main_description_ar,
                    'highlight_text_en' => $about->highlight_text_en,
                    'highlight_text_ar' => $about->highlight_text_ar,
                    'features' => $about->features->map(function ($feature) {
                        return [
                            'id' => $feature->id,
                            'icon' => $feature->icon,
                            'title_en' => $feature->title_en,
                            'title_ar' => $feature->title_ar,
                            'description_en' => $feature->description_en,
                            'description_ar' => $feature->description_ar,
                            'order' => $feature->order,
                        ];
                    }),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching about coach: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Get about coach for public website
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'ar'); // ar or en
            
            $about = $this->aboutCoachService->getAboutCoachForApi($locale);

            if (!$about) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا توجد بيانات',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $about,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching public about coach: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Update about coach
     * 
     * @param UpdateAboutCoachRequest $request
     * @return JsonResponse
     */
    public function update(UpdateAboutCoachRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $about = $this->aboutCoachService->updateAboutCoach(
                $request->validated(),
                $userId
            );

            Log::info('About coach updated', [
                'user_id' => $userId,
                'about_id' => $about->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث البيانات بنجاح',
                'data' => [
                    'id' => $about->id,
                    'image_url' => $about->image_url,
                    'badge_en' => $about->badge_en,
                    'badge_ar' => $about->badge_ar,
                    'title_en' => $about->title_en,
                    'title_ar' => $about->title_ar,
                    'main_description_en' => $about->main_description_en,
                    'main_description_ar' => $about->main_description_ar,
                    'highlight_text_en' => $about->highlight_text_en,
                    'highlight_text_ar' => $about->highlight_text_ar,
                    'features' => $about->features->map(function ($feature) {
                        return [
                            'id' => $feature->id,
                            'icon' => $feature->icon,
                            'title_en' => $feature->title_en,
                            'title_ar' => $feature->title_ar,
                            'description_en' => $feature->description_en,
                            'description_ar' => $feature->description_ar,
                            'order' => $feature->order,
                        ];
                    }),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating about coach: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث البيانات: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload coach image
     * 
     * @param UploadCoachImageRequest $request
     * @return JsonResponse
     */
    public function uploadImage(UploadCoachImageRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $about = $this->aboutCoachService->uploadImage(
                $request->file('image'),
                $userId
            );

            Log::info('Coach image uploaded', [
                'user_id' => $userId,
                'about_id' => $about->id,
                'image_name' => $about->image_name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الصورة بنجاح',
                'data' => [
                    'image_url' => $about->image_url,
                    'image_name' => $about->image_name,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading coach image: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete coach image
     * 
     * @return JsonResponse
     */
    public function deleteImage(): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $deleted = $this->aboutCoachService->deleteImageFromCoach($userId);

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا توجد صورة لحذفها',
                ], 404);
            }

            Log::info('Coach image deleted', [
                'user_id' => $userId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الصورة بنجاح',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting coach image: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الصورة',
            ], 500);
        }
    }
}