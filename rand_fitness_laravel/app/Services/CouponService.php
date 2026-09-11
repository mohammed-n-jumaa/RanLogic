<?php

namespace App\Services;

use App\Models\Coupon;
use Illuminate\Validation\ValidationException;

class CouponService
{
    /**
     * Validate a coupon code against plan, duration, and amount.
     * Returns the Coupon model on success.
     *
     * @throws ValidationException
     */
    public function validate(string $code, string $planType, string $duration, float $amount): Coupon
    {
        $coupon = Coupon::where('code', strtoupper(trim($code)))->first();

        if (!$coupon) {
            throw ValidationException::withMessages(['coupon_code' => 'كود الخصم غير صالح']);
        }

        if (!$coupon->is_active) {
            throw ValidationException::withMessages(['coupon_code' => 'كود الخصم غير مفعل']);
        }

        if ($coupon->isExpired()) {
            throw ValidationException::withMessages(['coupon_code' => 'كود الخصم منتهي الصلاحية']);
        }

        if ($coupon->hasReachedLimit()) {
            throw ValidationException::withMessages(['coupon_code' => 'تم استنفاد عدد مرات استخدام الكود']);
        }

        if (!$coupon->isValidForPlan($planType)) {
            throw ValidationException::withMessages(['coupon_code' => 'كود الخصم لا ينطبق على هذه الخطة']);
        }

        if (!$coupon->isValidForDuration($duration)) {
            throw ValidationException::withMessages(['coupon_code' => 'كود الخصم لا ينطبق على هذه المدة']);
        }

        if ($coupon->starts_at !== null && $coupon->starts_at->isFuture()) {
            throw ValidationException::withMessages(['coupon_code' => 'كود الخصم لم يبدأ بعد']);
        }

        if ($coupon->min_amount !== null && $amount < (float) $coupon->min_amount) {
            throw ValidationException::withMessages([
                'coupon_code' => "الحد الأدنى لاستخدام الكود هو \${$coupon->min_amount}",
            ]);
        }

        return $coupon;
    }

    /**
     * Apply coupon discount to an amount. Returns [final_amount, discount_amount].
     */
    public function apply(Coupon $coupon, float $amount): array
    {
        $discount    = $coupon->calculateDiscount($amount);
        $finalAmount = round(max($amount - $discount, 0), 2);

        return [$finalAmount, $discount];
    }
}
