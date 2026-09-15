<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class SiteColorsController extends Controller
{
    private const DEFAULTS = [
        'site_primary'       => '#FDB813',
        'site_secondary'     => '#1C1C1C',
        'site_accent'        => '#FFF8E1',
        'site_background'    => '#FFFFFF',
        'site_text'          => '#1C1C1C',
        'site_text_light'    => '#757575',
    ];

    public function index(): JsonResponse
    {
        try {
            $colors = Cache::remember('site_colors', 3600, function () {
                $saved = SiteSetting::where('key', 'like', 'color_%')
                    ->pluck('value', 'key')
                    ->mapWithKeys(fn($v, $k) => [str_replace('color_', '', $k) => $v])
                    ->toArray();

                return array_merge(self::DEFAULTS, $saved);
            });

            return response()->json(['success' => true, 'data' => $colors]);
        } catch (\Exception $e) {
            Log::error('SiteColorsController@index', ['error' => $e->getMessage()]);
            return response()->json(['success' => true, 'data' => self::DEFAULTS]);
        }
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'colors' => 'required|array',
            'colors.*' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{3,8})$/'],
        ], [
            'colors.required' => 'الألوان مطلوبة',
            'colors.*.regex'  => 'صيغة اللون غير صالحة',
        ]);

        try {
            $validKeys = array_keys(self::DEFAULTS);
            foreach ($request->input('colors') as $key => $value) {
                if (!in_array($key, $validKeys, true)) continue;
                SiteSetting::updateOrCreate(['key' => 'color_' . $key], ['value' => $value]);
            }

            Cache::forget('site_colors');
            Log::info('Site colors updated', ['by' => auth()->id()]);

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ الألوان بنجاح',
                'data'    => $this->getCurrent(),
            ]);
        } catch (\Exception $e) {
            Log::error('SiteColorsController@update', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء حفظ الألوان'], 500);
        }
    }

    public function reset(): JsonResponse
    {
        try {
            SiteSetting::where('key', 'like', 'color_%')->delete();
            Cache::forget('site_colors');
            Log::info('Site colors reset', ['by' => auth()->id()]);
            return response()->json(['success' => true, 'message' => 'تم إعادة الألوان للافتراضي', 'data' => self::DEFAULTS]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'حدث خطأ'], 500);
        }
    }

    private function getCurrent(): array
    {
        $saved = SiteSetting::where('key', 'like', 'color_%')
            ->pluck('value', 'key')
            ->mapWithKeys(fn($v, $k) => [str_replace('color_', '', $k) => $v])
            ->toArray();
        return array_merge(self::DEFAULTS, $saved);
    }
}
