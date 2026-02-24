<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLogoRequest;
use App\Services\LogoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogoController extends Controller
{
    protected LogoService $logoService;

    /**
     * Create a new controller instance.
     *
     * @param LogoService $logoService
     */
    public function __construct(LogoService $logoService)
    {
        $this->logoService = $logoService;
        
        // Apply middleware for authentication and rate limiting
        // Uncomment and adjust based on your auth system
        // $this->middleware('auth:sanctum');
        // $this->middleware('throttle:logo-uploads')->only(['store']);
    }

    /**
     * Get the currently active logo.
     *
     * @return JsonResponse
     */
    public function getActiveLogo(): JsonResponse
    {
        try {
            $logo = $this->logoService->getActiveLogo();

            if (!$logo) {
                return response()->json([
                    'success' => true,
                    'message' => 'لا يوجد شعار نشط حالياً.',
                    'data' => null,
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الشعار بنجاح.',
                'data' => [
                    'id' => $logo->id,
                    'file_name' => $logo->file_name,
                    'file_url' => $logo->full_url,
                    'file_type' => $logo->file_type,
                    'file_size' => $logo->file_size,
                    'file_size_formatted' => $logo->file_size_formatted,
                    'width' => $logo->width,
                    'height' => $logo->height,
                    'uploaded_at' => $logo->created_at->format('Y-m-d H:i:s'),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching active logo: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الشعار.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Upload a new logo.
     *
     * @param StoreLogoRequest $request
     * @return JsonResponse
     */
    public function store(StoreLogoRequest $request): JsonResponse
    {
        try {
            // Get uploaded file
            $file = $request->file('logo');

            // Get the authenticated user ID (adjust based on your auth system)
            $uploadedBy = auth()->id() ?? null; // or $request->user()?->id

            // Upload logo using service
            $logo = $this->logoService->uploadLogo($file, $uploadedBy);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الشعار بنجاح.',
                'data' => [
                    'id' => $logo->id,
                    'file_name' => $logo->file_name,
                    'file_url' => $logo->full_url,
                    'file_type' => $logo->file_type,
                    'file_size' => $logo->file_size,
                    'file_size_formatted' => $logo->file_size_formatted,
                    'width' => $logo->width,
                    'height' => $logo->height,
                    'is_active' => $logo->is_active,
                    'uploaded_at' => $logo->created_at->format('Y-m-d H:i:s'),
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error uploading logo: ' . $e->getMessage(), [
                'file_name' => $request->file('logo')?->getClientOriginalName(),
                'file_size' => $request->file('logo')?->getSize(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage() ?: 'حدث خطأ أثناء رفع الشعار.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get all logos (paginated).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 10);
            $logos = $this->logoService->getAllLogos($perPage);

            return response()->json([
                'success' => true,
                'message' => 'تم جلب الشعارات بنجاح.',
                'data' => $logos->map(function ($logo) {
                    return [
                        'id' => $logo->id,
                        'file_name' => $logo->file_name,
                        'file_url' => $logo->full_url,
                        'file_type' => $logo->file_type,
                        'file_size_formatted' => $logo->file_size_formatted,
                        'width' => $logo->width,
                        'height' => $logo->height,
                        'is_active' => $logo->is_active,
                        'uploaded_at' => $logo->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
                'pagination' => [
                    'total' => $logos->total(),
                    'per_page' => $logos->perPage(),
                    'current_page' => $logos->currentPage(),
                    'last_page' => $logos->lastPage(),
                    'from' => $logos->firstItem(),
                    'to' => $logos->lastItem(),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching logos: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الشعارات.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete a logo.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->logoService->deleteLogo($id);

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الشعار بنجاح.',
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'الشعار غير موجود.',
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error deleting logo: ' . $e->getMessage(), [
                'logo_id' => $id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الشعار.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Activate a specific logo.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function activate(int $id): JsonResponse
    {
        try {
            $logo = $this->logoService->activateLogo($id);

            return response()->json([
                'success' => true,
                'message' => 'تم تفعيل الشعار بنجاح.',
                'data' => [
                    'id' => $logo->id,
                    'file_name' => $logo->file_name,
                    'file_url' => $logo->full_url,
                    'is_active' => $logo->is_active,
                ],
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'الشعار غير موجود.',
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error activating logo: ' . $e->getMessage(), [
                'logo_id' => $id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تفعيل الشعار.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}