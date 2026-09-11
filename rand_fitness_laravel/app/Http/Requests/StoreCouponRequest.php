<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code'              => 'required|string|max:50|unique:coupons,code',
            'discount_type'     => 'required|in:percentage,fixed',
            'discount_value'    => 'required|numeric|min:0.01',
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
            'code.required'       => 'كود الخصم مطلوب',
            'code.unique'         => 'كود الخصم مستخدم مسبقاً',
            'code.max'            => 'كود الخصم يجب ألا يتجاوز 50 حرف',
            'discount_type.required' => 'نوع الخصم مطلوب',
            'discount_type.in'    => 'نوع الخصم غير صالح',
            'discount_value.required' => 'قيمة الخصم مطلوبة',
            'discount_value.min'  => 'قيمة الخصم يجب أن تكون أكبر من صفر',
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
