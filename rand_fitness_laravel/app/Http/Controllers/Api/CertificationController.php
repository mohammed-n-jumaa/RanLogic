<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCertificationRequest;
use App\Http\Requests\UpdateCertificationRequest;
use App\Http\Requests\BulkUpdateCertificationsRequest;
use App\Services\CertificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CertificationController extends Controller
{
    protected $certService;

    public function __construct(CertificationService $certService)
    {
        $this->certService = $certService;
        
        // Admin-only routes
        $this->middleware('auth:sanctum')->except(['index']);
    }

    /**
     * Get all certifications (Admin)
     * 
     * @return JsonResponse
     */
    public function adminIndex(): JsonResponse
    {
        try {
            $certifications = $this->certService->getAllCertifications();

            return response()->json([
                'success' => true,
                'data' => $certifications->map(function ($cert) {
                    return [
                        'id' => $cert->id,
                        'icon' => $cert->icon,
                        'title_en' => $cert->title_en,
                        'title_ar' => $cert->title_ar,
                        'organization_en' => $cert->organization_en,
                        'organization_ar' => $cert->organization_ar,
                        'is_verified' => $cert->is_verified,
                        'order' => $cert->order,
                        'is_active' => $cert->is_active,
                    ];
                }),
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching certifications: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الشهادات',
            ], 500);
        }
    }

    /**
     * Get active certifications for public
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'ar'); // ar or en
            
            $certifications = $this->certService->getActiveCertifications($locale);

            return response()->json([
                'success' => true,
                'data' => $certifications,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching public certifications: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الشهادات',
            ], 500);
        }
    }

    /**
     * Store new certification
     * 
     * @param StoreCertificationRequest $request
     * @return JsonResponse
     */
    public function store(StoreCertificationRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $certification = $this->certService->createCertification(
                $request->validated(),
                $userId
            );

            Log::info('Certification created', [
                'user_id' => $userId,
                'certification_id' => $certification->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة الشهادة بنجاح',
                'data' => [
                    'id' => $certification->id,
                    'icon' => $certification->icon,
                    'title_en' => $certification->title_en,
                    'title_ar' => $certification->title_ar,
                    'organization_en' => $certification->organization_en,
                    'organization_ar' => $certification->organization_ar,
                    'is_verified' => $certification->is_verified,
                    'order' => $certification->order,
                    'is_active' => $certification->is_active,
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating certification: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة الشهادة',
            ], 500);
        }
    }

    /**
     * Update certification
     * 
     * @param UpdateCertificationRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateCertificationRequest $request, int $id): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $certification = $this->certService->updateCertification(
                $id,
                $request->validated(),
                $userId
            );

            Log::info('Certification updated', [
                'user_id' => $userId,
                'certification_id' => $certification->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الشهادة بنجاح',
                'data' => [
                    'id' => $certification->id,
                    'icon' => $certification->icon,
                    'title_en' => $certification->title_en,
                    'title_ar' => $certification->title_ar,
                    'organization_en' => $certification->organization_en,
                    'organization_ar' => $certification->organization_ar,
                    'is_verified' => $certification->is_verified,
                    'order' => $certification->order,
                    'is_active' => $certification->is_active,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating certification: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الشهادة',
            ], 500);
        }
    }

    /**
     * Delete certification
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->certService->deleteCertification($id);

            Log::info('Certification deleted', [
                'user_id' => auth()->id(),
                'certification_id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الشهادة بنجاح',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting certification: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الشهادة',
            ], 500);
        }
    }

    /**
     * Reorder certifications
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'order' => 'required|array',
            'order.*' => 'required|integer|exists:certifications,id',
        ]);

        try {
            $userId = auth()->id();
            
            $this->certService->reorderCertifications(
                $request->input('order'),
                $userId
            );

            Log::info('Certifications reordered', [
                'user_id' => $userId,
                'order' => $request->input('order'),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إعادة ترتيب الشهادات بنجاح',
            ]);

        } catch (\Exception $e) {
            Log::error('Error reordering certifications: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إعادة الترتيب',
            ], 500);
        }
    }

    /**
     * Bulk update certifications
     * 
     * @param BulkUpdateCertificationsRequest $request
     * @return JsonResponse
     */
    public function bulkUpdate(BulkUpdateCertificationsRequest $request): JsonResponse
    {
        try {
            $userId = auth()->id();
            
            $certifications = $this->certService->bulkUpdate(
                $request->input('certifications'),
                $userId
            );

            Log::info('Certifications bulk updated', [
                'user_id' => $userId,
                'count' => count($certifications),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ جميع الشهادات بنجاح',
                'data' => collect($certifications)->map(function ($cert) {
                    return [
                        'id' => $cert->id,
                        'icon' => $cert->icon,
                        'title_en' => $cert->title_en,
                        'title_ar' => $cert->title_ar,
                        'organization_en' => $cert->organization_en,
                        'organization_ar' => $cert->organization_ar,
                        'is_verified' => $cert->is_verified,
                        'order' => $cert->order,
                        'is_active' => $cert->is_active,
                    ];
                }),
            ]);

        } catch (\Exception $e) {
            Log::error('Error bulk updating certifications: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حفظ الشهادات: ' . $e->getMessage(),
            ], 500);
        }
    }
}