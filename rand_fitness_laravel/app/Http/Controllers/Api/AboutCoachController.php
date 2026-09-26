<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AboutCoachService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class AboutCoachController extends Controller
{
    public function __construct(protected AboutCoachService $aboutCoachService)
    {
        $this->middleware('auth:sanctum')->except(['show']);
    }

    public function show(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'ar');

        $about = Cache::remember("public:about-coach:{$locale}", 3600, function () use ($locale) {
            return $this->aboutCoachService->getAboutCoachForApi($locale);
        });

        if (!$about) {
            return response()->json(['success' => false, 'message' => 'لا توجد بيانات'], 404);
        }

        return response()->json(['success' => true, 'data' => $about]);
    }

    public function index(): JsonResponse
    {
        $data = $this->aboutCoachService->getAdminData();

        if (!$data) {
            return response()->json([
                'success' => true,
                'data'    => null,
                'message' => 'لا توجد بيانات',
            ]);
        }

        return response()->json(['success' => true, 'data' => $data]);
    }

    public function update(Request $request): JsonResponse
    {
        $designKey = $request->input('design_key', 'classic');

        $request->validate([
            'design_key'  => 'required|in:classic,editorial,bento,spotlight',
            'design_type' => 'nullable|in:classic,editorial,bento,spotlight',
            'content'     => 'nullable|array',
            'features'    => 'nullable|array',
        ]);

        $this->aboutCoachService->updateDesign(
        $request->only(['design_type', 'bg_style', 'content', 'features']),
            $designKey,
            auth()->id()
        );

        Cache::forget('public:about-coach:ar');
        Cache::forget('public:about-coach:en');

        Log::info('About coach updated', [
            'user_id'    => auth()->id(),
            'design_key' => $designKey,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث البيانات بنجاح',
            'data'    => $this->aboutCoachService->getAdminData(),
        ]);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $about = $this->aboutCoachService->uploadImage(
            $request->file('image'),
            auth()->id()
        );

        Cache::forget('public:about-coach:ar');
        Cache::forget('public:about-coach:en');

        return response()->json([
            'success' => true,
            'message' => 'تم رفع الصورة',
            'data'    => [
                'image_url'  => $about->image_url,
                'image_name' => $about->image_name,
            ],
        ]);
    }

    public function deleteImage(): JsonResponse
    {
        $deleted = $this->aboutCoachService->deleteImageFromCoach(auth()->id());

        if (!$deleted) {
            return response()->json(['success' => false, 'message' => 'لا توجد صورة'], 404);
        }

        Cache::forget('public:about-coach:ar');
        Cache::forget('public:about-coach:en');

        return response()->json(['success' => true, 'message' => 'تم حذف الصورة']);
    }
}
