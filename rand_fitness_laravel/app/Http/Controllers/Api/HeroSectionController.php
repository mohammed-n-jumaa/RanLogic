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
    public function __construct(protected HeroSectionService $heroService)
    {
        $this->middleware('auth:sanctum')->except(['show']);
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    /**
     * GET /api/hero  (public)
     * Locale-aware hero section for the website frontend.
     */
    public function show(Request $request): JsonResponse
    {
        $result = $this->heroService->getHeroSectionForApi(
            $request->get('locale', 'ar')
        );

        return response()->json($result, $result['success'] ? 200 : 404);
    }

    // -------------------------------------------------------------------------
    // ADMIN — READ
    // -------------------------------------------------------------------------

    /**
     * GET /api/admin/hero  (admin)
     * Full hero data including raw bilingual fields and stats.
     */
    public function index(): JsonResponse
    {
        $hero = $this->heroService->getActiveHeroSection();

        if (!$hero) {
            return $this->notFound('لم يتم العثور على Hero Section');
        }

        return response()->json([
            'success' => true,
            'data'    => $this->formatAdminData($hero),
        ]);
    }

    // -------------------------------------------------------------------------
    // ADMIN — WRITE
    // -------------------------------------------------------------------------

    /**
     * PUT /api/admin/hero  (admin)
     */
    public function update(UpdateHeroSectionRequest $request): JsonResponse
    {
        $hero = $this->heroService->updateHeroSection(
            $request->validated(),
            auth()->id()
        );

        Log::info('Hero section updated', ['user_id' => auth()->id(), 'id' => $hero->id]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث المحتوى بنجاح',
            'data'    => $this->formatAdminData($hero),
        ]);
    }

    /**
     * POST /api/admin/hero/video  (admin)
     */
    public function uploadVideo(UploadHeroVideoRequest $request): JsonResponse
    {
        $hero = $this->heroService->uploadVideo($request->file('video'), auth()->id());

        Log::info('Hero video uploaded', [
            'user_id'    => auth()->id(),
            'video_name' => $hero->video_name,
            'video_size' => $hero->video_size,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الفيديو بنجاح',
            'data'    => [
                'id'         => $hero->id,
                'video_url'  => $hero->video_url,
                'video_name' => $hero->video_name,
                'video_size' => $hero->video_size_formatted,
            ],
        ]);
    }

    /**
     * DELETE /api/admin/hero/video  (admin)
     */
    public function deleteVideo(): JsonResponse
    {
        $hero = $this->heroService->getActiveHeroSection();

        if (!$hero?->video_path) {
            return $this->notFound('لا يوجد فيديو لحذفه');
        }

        $this->heroService->deleteVideo($hero->video_path);

        $hero->fill([
            'video_path' => null,
            'video_name' => null,
            'video_type' => null,
            'video_size' => null,
            'updated_by' => auth()->id(),
        ])->save();

        Log::info('Hero video deleted', ['user_id' => auth()->id(), 'hero_id' => $hero->id]);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الفيديو بنجاح',
        ]);
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    /**
     * Build the admin response payload for a hero section.
     */
    private function formatAdminData($hero): array
    {
        return [
            'id'             => $hero->id,
            'video_url'      => $hero->video_url,
            'video_name'     => $hero->video_name,
            'video_size'     => $hero->video_size_formatted,

            // English
            'badge_en'       => $hero->badge_en,
            'main_title_en'  => $hero->main_title_en,
            'sub_title_en'   => $hero->sub_title_en,
            'description_en' => $hero->description_en,

            // Arabic
            'badge_ar'       => $hero->badge_ar,
            'main_title_ar'  => $hero->main_title_ar,
            'sub_title_ar'   => $hero->sub_title_ar,
            'description_ar' => $hero->description_ar,

            'stats' => $hero->activeStats->map(fn($s) => [
                'id'       => $s->id,
                'value'    => $s->value,
                'label_en' => $s->label_en,
                'label_ar' => $s->label_ar,
                'order'    => $s->order,
            ]),
        ];
    }

    /**
     * Standard 404 JSON response.
     */
    private function notFound(string $message): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message], 404);
    }
}