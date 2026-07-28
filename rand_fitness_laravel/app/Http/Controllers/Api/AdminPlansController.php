<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AdminPlansController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    // ─── GET /admin/plans ─────────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        try {
            $plans = Plan::ordered()->get()->map(fn($p) => $this->formatPlan($p));

            return response()->json(['success' => true, 'data' => $plans]);
        } catch (\Exception $e) {
            Log::error('AdminPlansController@index', ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء جلب الخطط'], 500);
        }
    }

    // ─── PUT /admin/plans/{id} ────────────────────────────────────────────────

    public function update(Request $request, int $id): JsonResponse
    {
        $plan = Plan::findOrFail($id);

        $validated = $request->validate([
            'name_ar'             => 'sometimes|string|max:100',
            'name_en'             => 'sometimes|string|max:100',
            'subtitle_ar'         => 'sometimes|string|max:200',
            'subtitle_en'         => 'sometimes|string|max:200',

            // Prices — must be positive numbers
            'original_price_1m'   => 'sometimes|numeric|min:1',
            'discount_1m'         => 'sometimes|integer|min:0|max:100',
            'original_price_3m'   => 'sometimes|numeric|min:1',
            'discount_3m'         => 'sometimes|integer|min:0|max:100',
            'original_price_6m'   => 'sometimes|numeric|min:1',
            'discount_6m'         => 'sometimes|integer|min:0|max:100',

            // Features
            'features_ar'         => 'sometimes|array|min:1',
            'features_ar.*'       => 'required|string|max:300',
            'features_en'         => 'sometimes|array|min:1',
            'features_en.*'       => 'required|string|max:300',

            // Badge / popular
            'is_popular'          => 'sometimes|boolean',
            'badge_ar' => 'sometimes|nullable|string|max:100',
            'badge_en' => 'sometimes|nullable|string|max:100',

            'is_active'           => 'sometimes|boolean',
        ]);

        try {
            return DB::transaction(function () use ($plan, $validated) {

                // Auto-calculate discounted prices from original + discount%
                foreach (['1m', '3m', '6m'] as $suffix) {
                    $origKey     = "original_price_{$suffix}";
                    $discKey     = "discount_{$suffix}";
                    $priceKey    = "price_{$suffix}";

                    $original = isset($validated[$origKey])
                        ? (float) $validated[$origKey]
                        : (float) $plan->$origKey;

                    $discount = isset($validated[$discKey])
                        ? (int) $validated[$discKey]
                        : (int) $plan->$discKey;

                    // Only update price column if either original or discount changed
                    if (isset($validated[$origKey]) || isset($validated[$discKey])) {
                        $validated[$priceKey] = round($original * (1 - $discount / 100), 2);
                    }
                }

                $plan->update($validated);

                Log::info('Plan updated', ['plan_key' => $plan->plan_key, 'id' => $plan->id]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم تحديث الخطة بنجاح',
                    'data'    => $this->formatPlan($plan->fresh()),
                ]);
            });
        } catch (\Exception $e) {
            Log::error('AdminPlansController@update', [
                'id'    => $id,
                'error' => $e->getMessage(),
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
            ]);

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء تحديث الخطة: ' . $e->getMessage()], 500);
        }
    }

    // ─── POST /admin/plans/bulk-update ────────────────────────────────────────

    public function bulkUpdate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'plans'               => 'required|array|min:1',
            'plans.*.id'          => 'required|integer|exists:plans,id',
            'plans.*.name_ar'     => 'sometimes|string|max:100',
            'plans.*.name_en'     => 'sometimes|string|max:100',
            'plans.*.subtitle_ar' => 'sometimes|string|max:200',
            'plans.*.subtitle_en' => 'sometimes|string|max:200',

            'plans.*.original_price_1m' => 'sometimes|numeric|min:1',
            'plans.*.discount_1m'       => 'sometimes|integer|min:0|max:100',
            'plans.*.original_price_3m' => 'sometimes|numeric|min:1',
            'plans.*.discount_3m'       => 'sometimes|integer|min:0|max:100',
            'plans.*.original_price_6m' => 'sometimes|numeric|min:1',
            'plans.*.discount_6m'       => 'sometimes|integer|min:0|max:100',

            'plans.*.features_ar'   => 'sometimes|array|min:1',
            'plans.*.features_ar.*' => 'required|string|max:300',
            'plans.*.features_en'   => 'sometimes|array|min:1',
            'plans.*.features_en.*' => 'required|string|max:300',

            'plans.*.is_popular' => 'sometimes|boolean',
            'plans.*.badge_ar' => 'sometimes|nullable|string|max:100',
            'plans.*.badge_en' => 'sometimes|nullable|string|max:100',
            'plans.*.is_active'  => 'sometimes|boolean',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                $updated = [];

                foreach ($validated['plans'] as $planData) {
                    $plan = Plan::findOrFail($planData['id']);
                    unset($planData['id']);

                    foreach (['1m', '3m', '6m'] as $suffix) {
                        $origKey  = "original_price_{$suffix}";
                        $discKey  = "discount_{$suffix}";
                        $priceKey = "price_{$suffix}";

                        $original = isset($planData[$origKey]) ? (float) $planData[$origKey] : (float) $plan->$origKey;
                        $discount = isset($planData[$discKey]) ? (int) $planData[$discKey]   : (int) $plan->$discKey;

                        if (isset($planData[$origKey]) || isset($planData[$discKey])) {
                            $planData[$priceKey] = round($original * (1 - $discount / 100), 2);
                        }
                    }

                    $plan->update($planData);
                    $updated[] = $this->formatPlan($plan->fresh());
                }

                Log::info('Plans bulk-updated', ['count' => count($updated)]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم تحديث جميع الخطط بنجاح',
                    'data'    => $updated,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('AdminPlansController@bulkUpdate', ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء التحديث: ' . $e->getMessage()], 500);
        }
    }

    // ─── Private ──────────────────────────────────────────────────────────────

    private function formatPlan(Plan $plan): array
    {
        return [
            'id'   => $plan->id,
            'plan_key' => $plan->plan_key,

            'name_ar'     => $plan->name_ar,
            'name_en'     => $plan->name_en,
            'subtitle_ar' => $plan->subtitle_ar,
            'subtitle_en' => $plan->subtitle_en,

            'pricing' => [
                '1month'  => [
                    'original_price' => (float) $plan->original_price_1m,
                    'discount'       => $plan->discount_1m,
                    'price'          => (float) $plan->price_1m,
                ],
                '3months' => [
                    'original_price' => (float) $plan->original_price_3m,
                    'discount'       => $plan->discount_3m,
                    'price'          => (float) $plan->price_3m,
                ],
                '6months' => [
                    'original_price' => (float) $plan->original_price_6m,
                    'discount'       => $plan->discount_6m,
                    'price'          => (float) $plan->price_6m,
                ],
            ],

            'features_ar' => $plan->features_ar,
            'features_en' => $plan->features_en,

            'is_popular' => $plan->is_popular,
            'badge_ar'   => $plan->badge_ar,
            'badge_en'   => $plan->badge_en,
            'color'      => $plan->color,
            'icon'       => $plan->icon,
            'sort_order' => $plan->sort_order,
            'is_active'  => $plan->is_active,
        ];
    }
}
