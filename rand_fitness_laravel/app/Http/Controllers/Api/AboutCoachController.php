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
    public function __construct(protected AboutCoachService $aboutCoachService)
    {
        $this->middleware('auth:sanctum')->except(['show']);
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    /**
     * GET /api/about  (public)
     */
    public function show(Request $request): JsonResponse
    {
        $about = $this->aboutCoachService->getAboutCoachForApi(
            $request->get('locale', 'ar')
        );

        if (!$about) {
            return $this->notFound('لا توجد بيانات');
        }

        return response()->json(['success' => true, 'data' => $about]);
    }

    // -------------------------------------------------------------------------
    // ADMIN — READ
    // -------------------------------------------------------------------------

    /**
     * GET /api/admin/about  (admin)
     */
    public function index(): JsonResponse
    {
        $about = $this->aboutCoachService->getAboutCoach();

        if (!$about) {
            return response()->json([
                'success' => true,
                'data'    => null,
                'message' => 'لا توجد بيانات. يرجى إضافة البيانات أولاً',
            ]);
        }

        return response()->json([
            'success' => true,
            'data'    => $this->formatAdminData($about),
        ]);
    }

    // -------------------------------------------------------------------------
    // ADMIN — WRITE
    // -------------------------------------------------------------------------

    /**
     * PUT /api/admin/about  (admin)
     */
    public function update(UpdateAboutCoachRequest $request): JsonResponse
    {
        $about = $this->aboutCoachService->updateAboutCoach(
            $request->validated(),
            auth()->id()
        );

        Log::info('About coach updated', ['user_id' => auth()->id(), 'about_id' => $about->id]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'data'    => $this->formatAdminData($about),
        ]);
    }

    /**
     * POST /api/admin/about/image  (admin)
     */
    public function uploadImage(UploadCoachImageRequest $request): JsonResponse
    {
        $about = $this->aboutCoachService->uploadImage(
            $request->file('image'),
            auth()->id()
        );

        Log::info('Coach image uploaded', [
            'user_id'    => auth()->id(),
            'about_id'   => $about->id,
            'image_name' => $about->image_name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الصورة بنجاح',
            'data'    => [
                'image_url'  => $about->image_url,
                'image_name' => $about->image_name,
            ],
        ]);
    }

    /**
     * DELETE /api/admin/about/image  (admin)
     */
    public function deleteImage(): JsonResponse
    {
        $deleted = $this->aboutCoachService->deleteImageFromCoach(auth()->id());

        if (!$deleted) {
            return $this->notFound('لا توجد صورة لحذفها');
        }

        Log::info('Coach image deleted', ['user_id' => auth()->id()]);

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الصورة بنجاح',
        ]);
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    private function formatAdminData($about): array
    {
        return [
            'id'                   => $about->id,
            'image_url'            => $about->image_url,
            'badge_en'             => $about->badge_en,
            'badge_ar'             => $about->badge_ar,
            'title_en'             => $about->title_en,
            'title_ar'             => $about->title_ar,
            'main_description_en'  => $about->main_description_en,
            'main_description_ar'  => $about->main_description_ar,
            'highlight_text_en'    => $about->highlight_text_en,
            'highlight_text_ar'    => $about->highlight_text_ar,
            'features'             => $about->features->map(fn($f) => [
                'id'             => $f->id,
                'icon'           => $f->icon,
                'title_en'       => $f->title_en,
                'title_ar'       => $f->title_ar,
                'description_en' => $f->description_en,
                'description_ar' => $f->description_ar,
                'order'          => $f->order,
            ]),
        ];
    }

    private function notFound(string $message): JsonResponse
    {
        return response()->json(['success' => false, 'message' => $message], 404);
    }
}