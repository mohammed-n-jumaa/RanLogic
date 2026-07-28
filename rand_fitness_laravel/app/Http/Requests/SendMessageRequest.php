<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'content' => 'required|string|max:5000',
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'محتوى الرسالة مطلوب',
            'content.max' => 'الرسالة طويلة جداً (الحد الأقصى 5000 حرف)',
        ];
    }
}