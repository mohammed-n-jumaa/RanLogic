<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateFooterRequest;
use App\Services\FooterService;
use App\Services\LogoService;
use Illuminate\Http\JsonResponse;

class FooterController extends Controller
{
    protected $footerService;
    protected $logoService;

    public function __construct(FooterService $footerService, LogoService $logoService)
    {
        $this->footerService = $footerService;
        $this->logoService   = $logoService;
    }

    /**
     * GET /api/footer/public
     */
    public function getPublicFooter(): JsonResponse
    {
        try {
            $logo   = $this->logoService->getActiveLogo();
            $footer = $this->footerService->getActiveFooter();

            return response()->json([
                'success' => true,
                'data'    => $this->formatPublic($logo, $footer),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to retrieve footer.'], 500);
        }
    }

    /**
     * GET /api/admin/footer
     */
    public function getFooterForAdmin(): JsonResponse
    {
        try {
            $logo   = $this->logoService->getActiveLogo();
            $footer = $this->footerService->getFooterForAdmin();

            return response()->json([
                'success' => true,
                'data'    => $this->formatAdmin($logo, $footer),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to retrieve footer.'], 500);
        }
    }

    /**
     * PUT /api/admin/footer
     */
    public function update(UpdateFooterRequest $request): JsonResponse
    {
        try {
            $footer = $this->footerService->createOrUpdate($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ بيانات الفوتر بنجاح.',
                'data'    => $this->formatAdmin(null, $footer),
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to update footer.'], 500);
        }
    }

    // ── formatters ────────────────────────────────────────────────────────────

    private function formatPublic($logo, $footer): array
    {
        return [
            'logo'         => $logo ? ['url' => $logo->full_url, 'alt' => 'Logo'] : null,
            'description_ar' => $footer->description_ar ?? '',
            'description_en' => $footer->description_en ?? '',
            'copyright_ar'   => $footer->copyright_ar   ?? '© 2026 RanLogic. جميع الحقوق محفوظة.',
            'copyright_en'   => $footer->copyright_en   ?? '© 2026 RanLogic. All rights reserved.',
            'quick_links_title_ar' => $footer->quick_links_title_ar ?? 'روابط سريعة',
            'quick_links_title_en' => $footer->quick_links_title_en ?? 'Quick Links',
            'email'        => $footer->email    ?? '',
            'phone'        => $footer->phone    ?? '',
            'address_ar'   => $footer->address_ar ?? '',
            'address_en'   => $footer->address_en ?? '',
            'social_links' => $footer->social_links ?? [],
        ];
    }

    private function formatAdmin($logo, $footer): array
    {
        if (!$footer) {
            return [
                'logo'                  => null,
                'description_en'        => '',
                'description_ar'        => '',
                'copyright_en'          => '',
                'copyright_ar'          => '',
                'quick_links_title_en'  => 'Quick Links',
                'quick_links_title_ar'  => 'روابط سريعة',
                'email'                 => '',
                'phone'                 => '',
                'address_en'            => '',
                'address_ar'            => '',
                'social_links'          => [],
            ];
        }

        return [
            'logo' => $logo ? [
                'id'  => $logo->id,
                'url' => $logo->full_url,
            ] : null,
            'description_en'        => $footer->description_en        ?? '',
            'description_ar'        => $footer->description_ar        ?? '',
            'copyright_en'          => $footer->copyright_en          ?? '',
            'copyright_ar'          => $footer->copyright_ar          ?? '',
            'quick_links_title_en'  => $footer->quick_links_title_en  ?? 'Quick Links',
            'quick_links_title_ar'  => $footer->quick_links_title_ar  ?? 'روابط سريعة',
            'email'                 => $footer->email                  ?? '',
            'phone'                 => $footer->phone                  ?? '',
            'address_en'            => $footer->address_en             ?? '',
            'address_ar'            => $footer->address_ar             ?? '',
            'social_links'          => $footer->social_links           ?? [],
        ];
    }
}