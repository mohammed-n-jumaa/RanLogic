<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTestimonialsSectionRequest;
use App\Http\Requests\UpdateAllTestimonialsRequest;
use App\Http\Requests\UploadTestimonialImageRequest;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestimonialController extends Controller
{
    protected $testimonialService;

    public function __construct(TestimonialService $testimonialService)
    {
        $this->testimonialService = $testimonialService;
        
        // Admin-only routes
        $this->middleware('auth:sanctum')->except(['show']);
    }

    /**
     * Get all testimonials and section for admin
     * 
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $section = $this->testimonialService->getSection();
            $testimonials = $this->testimonialService->getTestimonials();

            return response()->json([
                'success' => true,
                'data' => [
                    'section' => $section ? [
                        'id' => $section->id,
                        'badge_en' => $section->badge_en,
                        'badge_ar' => $section->badge_ar,
                        'title_en' => $section->title_en,
                        'title_ar' => $section->title_ar,
                        'description_en' => $section->description_en,
                        'description_ar' => $section->description_ar,
                    ] : null,
                    'testimonials' => $testimonials->map(function ($t) {
                        return [
                            'id' => $t->id,
                            'image' => $t->image_url,
                            'name_en' => $t->name_en,
                            'name_ar' => $t->name_ar,
                            'title_en' => $t->title_en,
                            'title_ar' => $t->title_ar,
                            'text_en' => $t->text_en,
                            'text_ar' => $t->text_ar,
                            'rating' => $t->rating,
                            'order' => $t->order,
                        ];
                    }),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching testimonials: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Get testimonials for public website
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'ar'); // ar or en
            
            $data = $this->testimonialService->getTestimonialsForApi($locale);

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching public testimonials: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
            ], 500);
        }
    }

    /**
     * Update section settings
     * 
     * @param UpdateTestimonialsSectionRequest $request
     * @return JsonResponse
     */
    public function updateSection(UpdateTestimonialsSectionRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $section = $this->testimonialService->updateSection(
                $request->validated(),
                $userId
            );

            Log::info('Testimonials section updated', [
                'user_id' => $userId,
                'section_id' => $section->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث إعدادات القسم بنجاح',
                'data' => [
                    'id' => $section->id,
                    'badge_en' => $section->badge_en,
                    'badge_ar' => $section->badge_ar,
                    'title_en' => $section->title_en,
                    'title_ar' => $section->title_ar,
                    'description_en' => $section->description_en,
                    'description_ar' => $section->description_ar,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating section: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث إعدادات القسم: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update all testimonials (bulk update)
     * 
     * @param UpdateAllTestimonialsRequest $request
     * @return JsonResponse
     */
    public function updateAll(UpdateAllTestimonialsRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            $data = $request->validated();
            
            // Update section
            if (isset($data['section'])) {
                $this->testimonialService->updateSection($data['section'], $userId);
            }
            
            // Update testimonials
            if (isset($data['testimonials'])) {
                $testimonials = $this->testimonialService->bulkUpdateTestimonials(
                    $data['testimonials'],
                    $userId
                );
            }

            Log::info('All testimonials updated', [
                'user_id' => $userId,
                'testimonials_count' => count($data['testimonials'] ?? []),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ جميع التغييرات بنجاح',
                'data' => [
                    'testimonials' => isset($testimonials) ? $testimonials->map(function ($t) {
                        return [
                            'id' => $t->id,
                            'image' => $t->image_url,
                            'name_en' => $t->name_en,
                            'name_ar' => $t->name_ar,
                            'title_en' => $t->title_en,
                            'title_ar' => $t->title_ar,
                            'text_en' => $t->text_en,
                            'text_ar' => $t->text_ar,
                            'rating' => $t->rating,
                            'order' => $t->order,
                        ];
                    }) : [],
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating all testimonials: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حفظ التغييرات: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload testimonial image
     * 
     * @param UploadTestimonialImageRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function uploadImage(UploadTestimonialImageRequest $request, int $id): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $testimonial = $this->testimonialService->uploadImage(
                $id,
                $request->file('image'),
                $userId
            );

            Log::info('Testimonial image uploaded', [
                'user_id' => $userId,
                'testimonial_id' => $id,
                'image_name' => $testimonial->image_name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الصورة بنجاح',
                'data' => [
                    'image_url' => $testimonial->image_url,
                    'image_name' => $testimonial->image_name,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error uploading testimonial image: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete testimonial image
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function deleteImage(int $id): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $testimonial = \App\Models\Testimonial::findOrFail($id);
            
            if ($testimonial->image_path) {
                $this->testimonialService->deleteImage($testimonial->image_path);
                
                $testimonial->update([
                    'image_path' => null,
                    'image_name' => null,
                    'updated_by' => $userId,
                ]);
            }

            Log::info('Testimonial image deleted', [
                'user_id' => $userId,
                'testimonial_id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الصورة بنجاح',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting testimonial image: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الصورة',
            ], 500);
        }
    }
}