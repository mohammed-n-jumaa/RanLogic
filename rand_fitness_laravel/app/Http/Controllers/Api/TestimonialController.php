<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateAllTestimonialsRequest;
use App\Http\Requests\UpdateTestimonialsSectionRequest;
use App\Http\Requests\UploadTestimonialImageRequest;
use App\Models\Testimonial;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TestimonialController extends Controller
{
    public function __construct(protected TestimonialService $testimonialService)
    {
        $this->middleware('auth:sanctum')->except(['show']);
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    /**
     * GET /api/testimonials  (public)
     */
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $this->testimonialService->getTestimonialsForApi(
                $request->get('locale', 'ar')
            ),
        ]);
    }

    // -------------------------------------------------------------------------
    // ADMIN — READ
    // -------------------------------------------------------------------------

    /**
     * GET /api/admin/testimonials  (admin)
     */
    public function index(): JsonResponse
    {
        $section      = $this->testimonialService->getSection();
        $testimonials = $this->testimonialService->getTestimonials();

        return response()->json([
            'success' => true,
            'data'    => [
                'section'      => $section ? $this->formatSectionData($section) : null,
                'testimonials' => $testimonials->map(fn($t) => $this->formatTestimonialData($t)),
            ],
        ]);
    }

    // -------------------------------------------------------------------------
    // ADMIN — WRITE
    // -------------------------------------------------------------------------

    /**
     * PUT /api/admin/testimonials/section  (admin)
     */
    public function updateSection(UpdateTestimonialsSectionRequest $request): JsonResponse
    {
        $section = $this->testimonialService->updateSection(
            $request->validated(),
            auth()->id()
        );

        Log::info('Testimonials section updated', ['user_id' => auth()->id(), 'section_id' => $section->id]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث إعدادات القسم بنجاح',
            'data'    => $this->formatSectionData($section),
        ]);
    }

    /**
     * POST /api/admin/testimonials/bulk  (admin)
     * Updates section + testimonials in one request.
     */
    public function updateAll(UpdateAllTestimonialsRequest $request): JsonResponse
    {
        $data   = $request->validated();
        $userId = auth()->id();

        if (!empty($data['section'])) {
            $this->testimonialService->updateSection($data['section'], $userId);
        }

        $testimonials = !empty($data['testimonials'])
            ? $this->testimonialService->bulkUpdateTestimonials($data['testimonials'], $userId)
            : collect();

        Log::info('All testimonials updated', [
            'user_id' => $userId,
            'count'   => $testimonials->count(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ جميع التغييرات بنجاح',
            'data'    => [
                'testimonials' => $testimonials->map(fn($t) => $this->formatTestimonialData($t)),
            ],
        ]);
    }

    /**
     * POST /api/admin/testimonials/{id}/image  (admin)
     */
    public function uploadImage(UploadTestimonialImageRequest $request, int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->uploadImage(
            $id,
            $request->file('image'),
            auth()->id()
        );

        Log::info('Testimonial image uploaded', [
            'user_id'        => auth()->id(),
            'testimonial_id' => $id,
            'image_name'     => $testimonial->image_name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الصورة بنجاح',
            'data'    => [
                'image_url'  => $testimonial->image_url,
                'image_name' => $testimonial->image_name,
            ],
        ]);
    }

    /**
     * DELETE /api/admin/testimonials/{id}/image  (admin)
     */
    public function deleteImage(int $id): JsonResponse
    {
        $testimonial = Testimonial::findOrFail($id);

        if ($testimonial->image_path) {
            $this->testimonialService->deleteImage($testimonial->image_path);

            $testimonial->update([
                'image_path' => null,
                'image_name' => null,
                'updated_by' => auth()->id(),
            ]);
        }

        Log::info('Testimonial image deleted', ['user_id' => auth()->id(), 'testimonial_id' => $id]);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الصورة بنجاح',
        ]);
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    private function formatSectionData($section): array
    {
        return [
            'id'             => $section->id,
            'badge_en'       => $section->badge_en,
            'badge_ar'       => $section->badge_ar,
            'title_en'       => $section->title_en,
            'title_ar'       => $section->title_ar,
            'description_en' => $section->description_en,
            'description_ar' => $section->description_ar,
        ];
    }

    private function formatTestimonialData($t): array
    {
        return [
            'id'       => $t->id,
            'image'    => $t->image_url,
            'name_en'  => $t->name_en,
            'name_ar'  => $t->name_ar,
            'title_en' => $t->title_en,
            'title_ar' => $t->title_ar,
            'text_en'  => $t->text_en,
            'text_ar'  => $t->text_ar,
            'rating'   => $t->rating,
            'order'    => $t->order,
        ];
    }
}