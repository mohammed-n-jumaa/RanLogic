<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCouponRequest;
use App\Http\Requests\UpdateCouponRequest;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class AdminCouponController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:sanctum', 'admin']);
    }

    // ─── GET /admin/coupons ──────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        try {
            $coupons = Coupon::orderByDesc('created_at')
                ->get()
                ->map(fn(Coupon $c) => $this->formatCoupon($c));

            return response()->json(['success' => true, 'data' => $coupons]);
        } catch (\Exception $e) {
            Log::error('AdminCouponController@index', ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء جلب الكوبونات'], 500);
        }
    }

    // ─── POST /admin/coupons ─────────────────────────────────────────────────

    public function store(StoreCouponRequest $request): JsonResponse
    {
        try {
            $coupon = Coupon::create($request->validated());

            Log::info('Coupon created', ['id' => $coupon->id, 'code' => $coupon->code]);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء كود الخصم بنجاح',
                'data'    => $this->formatCoupon($coupon),
            ], 201);
        } catch (\Exception $e) {
            Log::error('AdminCouponController@store', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء كود الخصم',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    // ─── PUT /admin/coupons/{coupon} ─────────────────────────────────────────

    public function update(UpdateCouponRequest $request, Coupon $coupon): JsonResponse
    {
        try {
            $coupon->update($request->validated());

            Log::info('Coupon updated', ['id' => $coupon->id, 'code' => $coupon->code]);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث كود الخصم بنجاح',
                'data'    => $this->formatCoupon($coupon->fresh()),
            ]);
        } catch (\Exception $e) {
            Log::error('AdminCouponController@update', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث كود الخصم',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    // ─── DELETE /admin/coupons/{coupon} ───────────────────────────────────────

    public function destroy(Coupon $coupon): JsonResponse
    {
        try {
            $code = $coupon->code;
            $coupon->delete();

            Log::info('Coupon deleted', ['code' => $code]);

            return response()->json(['success' => true, 'message' => 'تم حذف كود الخصم بنجاح']);
        } catch (\Exception $e) {
            Log::error('AdminCouponController@destroy', ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء حذف كود الخصم'], 500);
        }
    }

    // ─── PATCH /admin/coupons/{coupon}/toggle ────────────────────────────────

    public function toggle(Coupon $coupon): JsonResponse
    {
        try {
            $coupon->update(['is_active' => !$coupon->is_active]);

            return response()->json([
                'success' => true,
                'message' => $coupon->is_active ? 'تم تفعيل الكوبون' : 'تم تعطيل الكوبون',
                'data'    => $this->formatCoupon($coupon->fresh()),
            ]);
        } catch (\Exception $e) {
            Log::error('AdminCouponController@toggle', ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'حدث خطأ'], 500);
        }
    }

    // ─── Private ─────────────────────────────────────────────────────────────

    private function formatCoupon(Coupon $coupon): array
    {
        return [
            'id'                => $coupon->id,
            'code'              => $coupon->code,
            'discount_type'     => $coupon->discount_type,
            'discount_value'    => (float) $coupon->discount_value,
            'min_amount'        => $coupon->min_amount ? (float) $coupon->min_amount : null,
            'allowed_plans'     => $coupon->allowed_plans ?? [],
            'allowed_durations' => $coupon->allowed_durations ?? [],
            'max_uses'          => $coupon->max_uses,
            'times_used'        => $coupon->times_used,
            'is_active'         => $coupon->is_active,
            'starts_at'         => $coupon->starts_at?->format('Y-m-d H:i:s'),
            'expires_at'        => $coupon->expires_at?->format('Y-m-d H:i:s'),
            'created_at'        => $coupon->created_at->format('Y-m-d H:i:s'),
            'is_expired'        => $coupon->isExpired(),
            'has_reached_limit' => $coupon->hasReachedLimit(),
        ];
    }
}
