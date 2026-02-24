<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'plan_type' => 'required|in:basic,nutrition,elite,vip',
            'duration' => 'required|in:1month,3months,6months',
            'amount' => 'required|numeric|min:1',
            'original_amount' => 'nullable|numeric|min:1',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'payment_method' => 'required|in:paypal,bank_transfer',
            'notes' => 'nullable|string|max:500',
            'bank_transfer_number' => 'required_if:payment_method,bank_transfer|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'plan_type.required' => 'نوع الخطة مطلوب',
            'plan_type.in' => 'نوع الخطة غير صالح',
            'duration.required' => 'المدة مطلوبة',
            'duration.in' => 'المدة غير صالحة',
            'amount.required' => 'المبلغ مطلوب',
            'amount.numeric' => 'المبلغ يجب أن يكون رقم',
            'amount.min' => 'المبلغ يجب أن يكون أكبر من 0',
            'payment_method.required' => 'طريقة الدفع مطلوبة',
            'payment_method.in' => 'طريقة الدفع غير صالحة',
            'bank_transfer_number.required_if' => 'رقم التحويل البنكي مطلوب',
            'bank_transfer_number.max' => 'رقم التحويل البنكي يجب ألا يتجاوز 100 حرف',
            'notes.max' => 'الملاحظات يجب ألا تتجاوز 500 حرف',
        ];
    }
}