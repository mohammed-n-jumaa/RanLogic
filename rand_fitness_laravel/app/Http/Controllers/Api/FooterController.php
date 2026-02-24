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
        $this->logoService = $logoService;
    }

    /**
     * Get footer for public website
     */
    public function getPublicFooter(): JsonResponse
    {
        try {
            // جلب الشعار النشط
            $logo = $this->logoService->getActiveLogo();
            
            // جلب إعدادات الفوتر (السوشيال ميديا فقط)
            $footer = $this->footerService->getActiveFooter();

            return response()->json([
                'success' => true,
                'message' => 'Footer retrieved successfully.',
                'data' => $this->formatFooterData($logo, $footer),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve footer.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get footer for admin panel
     */
    public function getFooterForAdmin(): JsonResponse
    {
        try {
            // جلب الشعار النشط
            $logo = $this->logoService->getActiveLogo();
            
            // جلب إعدادات الفوتر (السوشيال ميديا فقط)
            $footer = $this->footerService->getFooterForAdmin();

            return response()->json([
                'success' => true,
                'message' => 'Footer data retrieved successfully.',
                'data' => $this->formatFooterDataForAdmin($logo, $footer),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve footer data.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update footer configuration (السوشيال ميديا فقط)
     */
    public function update(UpdateFooterRequest $request): JsonResponse
    {
        try {
            // تحديث السوشيال ميديا فقط
            $footer = $this->footerService->createOrUpdate($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Social media links updated successfully.',
                'data' => $this->formatFooterDataForAdmin(null, $footer),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update social media links.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Format footer data for public API
     */
    private function formatFooterData($logo, $footer): array
    {
        // روابط سريعة ثابتة
        $quickLinks = [
            ['text_en' => 'Home', 'text_ar' => 'الرئيسية', 'url' => '#home'],
            ['text_en' => 'About Coach', 'text_ar' => 'عن المدرب', 'url' => '#about'],
            ['text_en' => 'Programs', 'text_ar' => 'البرامج', 'url' => '#programs'],
            ['text_en' => 'Testimonials', 'text_ar' => 'آراء العملاء', 'url' => '#testimonials'],
        ];

        // روابط قانونية ثابتة
        $legalLinks = [
            ['text_en' => 'Privacy Policy', 'text_ar' => 'سياسة الخصوصية', 'url' => '/privacy'],
            ['text_en' => 'Terms & Conditions', 'text_ar' => 'الشروط والأحكام', 'url' => '/terms'],
        ];

        // معلومات الاتصال ثابتة
        $contactInfo = [
            'email' => 'info@randjarar.com',
            'phone' => '+966 55 123 4567',
            'address_en' => 'Saudi Arabia, Riyadh',
            'address_ar' => 'المملكة العربية السعودية، الرياض',
        ];

        return [
            'logo' => $logo ? [
                'url' => $logo->full_url,
                'alt' => 'RAND JARAR Logo',
            ] : null,
            'description' => app()->getLocale() === 'ar' 
                ? 'مدربة لياقة بدنية معتمدة دولياً تساعدك في تحقيق أهدافك'
                : 'Internationally Certified Fitness Coach helping you achieve your goals',
            'copyright' => app()->getLocale() === 'ar'
                ? '© 2024 RAND JARAR. جميع الحقوق محفوظة.'
                : '© 2024 RAND JARAR. All rights reserved.',
            'quick_links_title' => app()->getLocale() === 'ar' ? 'روابط سريعة' : 'Quick Links',
            'quick_links' => array_map(function($link) {
                return [
                    'text' => app()->getLocale() === 'ar' ? $link['text_ar'] : $link['text_en'],
                    'url' => $link['url'],
                ];
            }, $quickLinks),
            'legal_links' => array_map(function($link) {
                return [
                    'text' => app()->getLocale() === 'ar' ? $link['text_ar'] : $link['text_en'],
                    'url' => $link['url'],
                ];
            }, $legalLinks),
            'social_links' => $footer && $footer->social_links ? $footer->social_links : [],
            'contact_info' => [
                'email' => $contactInfo['email'],
                'phone' => $contactInfo['phone'],
                'address' => app()->getLocale() === 'ar' ? $contactInfo['address_ar'] : $contactInfo['address_en'],
            ],
        ];
    }

    /**
     * Format footer data for admin API
     */
    private function formatFooterDataForAdmin($logo, $footer): array
    {
        if (!$footer) {
            return [
                'social_links' => [],
            ];
        }

        return [
            'logo' => $logo ? [
                'id' => $logo->id,
                'url' => $logo->full_url,
                'name' => $logo->file_name,
            ] : null,
            'social_links' => $footer->social_links ?? [],
        ];
    }
}