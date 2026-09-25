<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HeroSectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class HeroSectionController extends Controller
{
    public function __construct(protected HeroSectionService $heroService)
    {
        $this->middleware('auth:sanctum')->except(['show']);
    }

    /**
     * GET /api/hero-section/public  (public)
     */
    public function show(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'ar');
        $result = Cache::remember("public:hero-section:{$locale}", 3600, function () use ($locale) {
            return $this->heroService->getHeroSectionForApi($locale);
        });
        return response()->json($result, $result['success'] ? 200 : 404);
    }

    /**
     * GET /api/admin/hero-section  (admin) — full data for all 3 designs
     */
    public function index(): JsonResponse
    {
        $data = $this->heroService->getAdminData();
        if (!$data) return response()->json(['success' => false, 'message' => 'لم يتم العثور على Hero Section'], 404);
        return response()->json(['success' => true, 'data' => $data]);
    }

    /**
     * PUT /api/admin/hero-section  (admin) — update one design tab
     * Expects: { design_key, design_type?, content, stats, cta_buttons }
     */
    public function update(Request $request): JsonResponse
    {
        $designKey = $request->input('design_key', 'classic');

        $request->validate([
            'design_key'   => 'required|in:classic,cinematic,split',
            'design_type'  => 'nullable|in:classic,cinematic,split',
            'content'      => 'nullable|array',
            'stats'        => 'nullable|array',
            'cta_buttons'  => 'nullable|array',
        ]);

        $hero = $this->heroService->updateDesign(
            $request->only(['design_type', 'content', 'stats', 'cta_buttons']),
            $designKey,
            auth()->id()
        );

        Cache::forget('public:hero-section:ar');
        Cache::forget('public:hero-section:en');

        Log::info('Hero section updated', ['user_id' => auth()->id(), 'design_key' => $designKey]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المحتوى بنجاح',
            'data'    => $this->heroService->getAdminData(),
        ]);
    }

    /**
     * POST /api/admin/hero-section/video  (admin) — classic video
     */
    public function uploadVideo(Request $request): JsonResponse
    {
        $request->validate(['video' => 'required|file|mimes:mp4,webm,mov,avi|max:204800']);

        $hero = $this->heroService->uploadVideo($request->file('video'), auth()->id());

        Cache::forget('public:hero-section:ar');
        Cache::forget('public:hero-section:en');

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الفيديو بنجاح',
            'data'    => ['video_url' => $hero->video_url, 'video_name' => $hero->video_name, 'video_size' => $hero->video_size_formatted],
        ]);
    }

    /**
     * DELETE /api/admin/hero-section/video  (admin)
     */
    public function deleteVideo(): JsonResponse
    {
        $hero = $this->heroService->getActiveHeroSection();
        if (!$hero?->video_path) return response()->json(['success' => false, 'message' => 'لا يوجد فيديو'], 404);

        $this->heroService->deleteVideo($hero->video_path);
        $hero->fill(['video_path' => null, 'video_name' => null, 'video_type' => null, 'video_size' => null, 'updated_by' => auth()->id()])->save();

        Cache::forget('public:hero-section:ar');
        Cache::forget('public:hero-section:en');

        return response()->json(['success' => true, 'message' => 'تم حذف الفيديو بنجاح']);
    }

    // ─── Slides ───────────────────────────────────────────────────────

    /**
     * POST /api/admin/hero-section/slides  — upload slide image + text
     */
    public function uploadSlide(Request $request): JsonResponse
    {
        $request->validate([
            'image'      => 'required|image|mimes:jpeg,png,webp,gif|max:10240',
            'design_key' => 'required|in:cinematic,split',
        ]);

        $slide = $this->heroService->uploadSlideImage(
            $request->file('image'),
            $request->input('design_key'),
            $request->only(['main_title_en', 'main_title_ar', 'sub_title_en', 'sub_title_ar', 'description_en', 'description_ar']),
            auth()->id()
        );

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الصورة بنجاح',
            'data'    => [
                'id' => $slide->id, 'image_url' => $slide->image_url,
                'image_name' => $slide->image_name, 'order' => $slide->order,
            ],
        ]);
    }

    /**
     * PUT /api/admin/hero-section/slides/{id}  — update slide text
     */
    public function updateSlide(Request $request, int $id): JsonResponse
    {
        $slide = $this->heroService->updateSlide($id, $request->only([
            'main_title_en', 'main_title_ar', 'sub_title_en', 'sub_title_ar',
            'description_en', 'description_ar', 'order',
        ]));

        return response()->json(['success' => true, 'message' => 'تم التحديث', 'data' => $slide]);
    }

    /**
     * DELETE /api/admin/hero-section/slides/{id}
     */
    public function deleteSlide(int $id): JsonResponse
    {
        $this->heroService->deleteSlide($id);
        return response()->json(['success' => true, 'message' => 'تم حذف السلايد']);
    }
}
