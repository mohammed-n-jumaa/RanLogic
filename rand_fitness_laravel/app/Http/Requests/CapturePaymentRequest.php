<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CapturePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'token' => 'required|string',
            'subscription_id' => 'required|integer|exists:subscriptions,id',
        ];
    }

    public function messages(): array
    {
        return [
            'token.required' => 'رمز الدفع مطلوب',
            'token.string' => 'رمز الدفع غير صالح',
            'subscription_id.required' => 'معرف الاشتراك مطلوب',
            'subscription_id.integer' => 'معرف الاشتراك غير صالح',
            'subscription_id.exists' => 'الاشتراك غير موجود',
        ];
    }
}