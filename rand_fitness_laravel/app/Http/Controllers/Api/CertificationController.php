<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BulkUpdateCertificationsRequest;
use App\Http\Requests\StoreCertificationRequest;
use App\Http\Requests\UpdateCertificationRequest;
use App\Models\Certification;
use App\Services\CertificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CertificationController extends Controller
{
    public function __construct(protected CertificationService $certService)
    {
        $this->middleware('auth:sanctum')->except(['index']);
    }

    // -------------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------------

    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'ar');

        $data = Cache::remember("public:certifications:{$locale}", 3600, function () use ($locale) {
            return $this->certService->getActiveCertifications($locale);
        });

        $designType = Certification::value('design_type') ?? 'classic';

        return response()->json([
            'success'     => true,
            'data'        => $data,
            'design_type' => $designType,
        ]);
    }

    // -------------------------------------------------------------------------
    // ADMIN — READ
    // -------------------------------------------------------------------------

    public function adminIndex(): JsonResponse
    {
        $designType = Certification::value('design_type') ?? 'classic';

        return response()->json([
            'success'     => true,
            'data'        => $this->certService->getAllCertifications()
                ->map(fn($cert) => $this->formatAdminData($cert)),
            'design_type' => $designType,
        ]);
    }

    // -------------------------------------------------------------------------
    // ADMIN — WRITE
    // -------------------------------------------------------------------------

    public function store(StoreCertificationRequest $request): JsonResponse
    {
        $cert = $this->certService->createCertification(
            $request->validated(),
            auth()->id()
        );

        Log::info('Certification created', ['user_id' => auth()->id(), 'id' => $cert->id]);
        $this->clearPublicCache();

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة الشهادة بنجاح',
            'data'    => $this->formatAdminData($cert),
        ], 201);
    }

    public function update(UpdateCertificationRequest $request, int $id): JsonResponse
    {
        $cert = $this->certService->updateCertification($id, $request->validated(), auth()->id());

        Log::info('Certification updated', ['user_id' => auth()->id(), 'id' => $cert->id]);
        $this->clearPublicCache();

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الشهادة بنجاح',
            'data'    => $this->formatAdminData($cert),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->certService->deleteCertification($id);

        Log::info('Certification deleted', ['user_id' => auth()->id(), 'id' => $id]);
        $this->clearPublicCache();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الشهادة بنجاح',
        ]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'order'   => 'required|array',
            'order.*' => 'required|integer|exists:certifications,id',
        ]);

        $this->certService->reorderCertifications($request->input('order'), auth()->id());

        Log::info('Certifications reordered', ['user_id' => auth()->id()]);
        $this->clearPublicCache();

        return response()->json([
            'success' => true,
            'message' => 'تم إعادة ترتيب الشهادات بنجاح',
        ]);
    }

    public function bulkUpdate(BulkUpdateCertificationsRequest $request): JsonResponse
    {
        $certs = $this->certService->bulkUpdate(
            $request->input('certifications'),
            auth()->id()
        );

        Log::info('Certifications bulk updated', ['user_id' => auth()->id(), 'count' => $certs->count()]);
        $this->clearPublicCache();

        return response()->json([
            'success' => true,
            'message' => 'تم حفظ جميع الشهادات بنجاح',
            'data'    => $certs->map(fn($cert) => $this->formatAdminData($cert)),
        ]);
    }

    public function updateDesignType(Request $request): JsonResponse
    {
        $request->validate([
            'design_type' => 'required|in:classic,dots,medals,shields',
        ]);

        Certification::query()->update([
            'design_type' => $request->input('design_type'),
        ]);

        $this->clearPublicCache();

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث تصميم الشهادات',
        ]);
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    private function formatAdminData($cert): array
    {
        return [
            'id'              => $cert->id,
            'icon'            => $cert->icon,
            'title_en'        => $cert->title_en,
            'title_ar'        => $cert->title_ar,
            'organization_en' => $cert->organization_en,
            'organization_ar' => $cert->organization_ar,
            'is_verified'     => $cert->is_verified,
            'order'           => $cert->order,
            'is_active'       => $cert->is_active,
        ];
    }

    private function clearPublicCache(): void
    {
        Cache::forget('public:certifications:ar');
        Cache::forget('public:certifications:en');
    }
}