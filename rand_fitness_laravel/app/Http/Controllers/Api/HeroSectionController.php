<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateHeroSectionRequest;
use App\Http\Requests\UploadHeroVideoRequest;
use App\Services\HeroSectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HeroSectionController extends Controller
{
    protected $heroService;

    public function __construct(HeroSectionService $heroService)
    {
        $this->heroService = $heroService;
        
        // Admin-only routes
        $this->middleware('auth:sanctum')->except(['show']);
    }

    /**
     * Get active hero section
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $heroSection = $this->heroService->getActiveHeroSection();

            if (!$heroSection) {
                return response()->json([
                    'success' => false,
                    'message' => 'لم يتم العثور على Hero Section',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $heroSection->id,
                    'video_url' => $heroSection->video_url,
                    'video_name' => $heroSection->video_name,
                    'video_size' => $heroSection->video_size_formatted,
                    
                    // English Content
                    'badge_en' => $heroSection->badge_en,
                    'main_title_en' => $heroSection->main_title_en,
                    'sub_title_en' => $heroSection->sub_title_en,
                    'description_en' => $heroSection->description_en,
                    
                    // Arabic Content
                    'badge_ar' => $heroSection->badge_ar,
                    'main_title_ar' => $heroSection->main_title_ar,
                    'sub_title_ar' => $heroSection->sub_title_ar,
                    'description_ar' => $heroSection->description_ar,
                    
                    // Stats
                    'stats' => $heroSection->activeStats->map(function ($stat) {
                        return [
                            'id' => $stat->id,
                            'value' => $stat->value,
                            'label_en' => $stat->label_en,
                            'label_ar' => $stat->label_ar,
                            'order' => $stat->order,
                        ];
                    }),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching hero section: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Get hero section for public website
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'ar'); // ar or en
            
            $result = $this->heroService->getHeroSectionForApi($locale);

            if (!$result['success']) {
                return response()->json($result, 404);
            }

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error('Error fetching public hero section: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Update hero section content
     * 
     * @param UpdateHeroSectionRequest $request
     * @return JsonResponse
     */
    public function update(UpdateHeroSectionRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $heroSection = $this->heroService->updateHeroSection(
                $request->validated(),
                $userId
            );

            Log::info('Hero section updated', [
                'user_id' => $userId,
                'hero_section_id' => $heroSection->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث المحتوى بنجاح',
                'data' => [
                    'id' => $heroSection->id,
                    'video_url' => $heroSection->video_url,
                    
                    // English
                    'badge_en' => $heroSection->badge_en,
                    'main_title_en' => $heroSection->main_title_en,
                    'sub_title_en' => $heroSection->sub_title_en,
                    'description_en' => $heroSection->description_en,
                    
                    // Arabic
                    'badge_ar' => $heroSection->badge_ar,
                    'main_title_ar' => $heroSection->main_title_ar,
                    'sub_title_ar' => $heroSection->sub_title_ar,
                    'description_ar' => $heroSection->description_ar,
                    
                    'stats' => $heroSection->stats->map(function ($stat) {
                        return [
                            'id' => $stat->id,
                            'value' => $stat->value,
                            'label_en' => $stat->label_en,
                            'label_ar' => $stat->label_ar,
                            'order' => $stat->order,
                        ];
                    }),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating hero section: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء التحديث: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload hero video
     * 
     * @param UploadHeroVideoRequest $request
     * @return JsonResponse
     */
    public function uploadVideo(UploadHeroVideoRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $file = $request->file('video');
            
            $heroSection = $this->heroService->uploadVideo($file, $userId);

            Log::info('Hero video uploaded', [
                'user_id' => $userId,
                'video_name' => $heroSection->video_name,
                'video_size' => $heroSection->video_size,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الفيديو بنجاح',
                'data' => [
                    'id' => $heroSection->id,
                    'video_url' => $heroSection->video_url,
                    'video_name' => $heroSection->video_name,
                    'video_size' => $heroSection->video_size_formatted,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading hero video: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete hero video
     * 
     * @return JsonResponse
     */
    public function deleteVideo(): JsonResponse
    {
        try {
            $heroSection = $this->heroService->getActiveHeroSection();

            if (!$heroSection || !$heroSection->video_path) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يوجد فيديو لحذفه',
                ], 404);
            }

            // Delete video file
            $this->heroService->deleteVideo($heroSection->video_path);

            // Update hero section
            $heroSection->video_path = null;
            $heroSection->video_name = null;
            $heroSection->video_type = null;
            $heroSection->video_size = null;
            $heroSection->updated_by = auth()->id();
            $heroSection->save();

            Log::info('Hero video deleted', [
                'user_id' => auth()->id(),
                'hero_section_id' => $heroSection->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الفيديو بنجاح',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting hero video: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الفيديو',
            ], 500);
        }
    }
}