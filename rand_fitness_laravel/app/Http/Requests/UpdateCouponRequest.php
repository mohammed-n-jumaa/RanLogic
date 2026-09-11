<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'              => ['sometimes', 'string', 'max:50', Rule::unique('coupons', 'code')->ignore($this->route('coupon'))],
            'discount_type'     => 'sometimes|in:percentage,fixed',
            'discount_value'    => 'sometimes|numeric|min:0.01',
            'min_amount'        => 'nullable|numeric|min:0',
            'allowed_plans'     => 'nullable|array',
            'allowed_plans.*'   => 'in:basic,nutrition,elite,vip',
            'allowed_durations'   => 'nullable|array',
            'allowed_durations.*' => 'in:1month,3months,6months',
            'max_uses'          => 'nullable|integer|min:1',
            'is_active'         => 'sometimes|boolean',
            'starts_at'         => 'nullable|date',
            'expires_at'        => 'nullable|date|after_or_equal:starts_at',
        ];
    }

    public function messages(): array
    {
        return [
            'code.unique'         => 'كود الخصم مستخدم مسبقاً',
            'expires_at.after_or_equal' => 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البداية',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('code')) {
            $this->merge(['code' => strtoupper(trim($this->code))]);
        }
    }
}
