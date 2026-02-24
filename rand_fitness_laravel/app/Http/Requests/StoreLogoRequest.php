<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreLogoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Add your authorization logic here
        // For example: return $this->user()->can('manage-logos');
        return true; // Change this based on your auth system
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'logo' => [
                'required',
                'file',
                File::types(['png', 'jpg', 'jpeg', 'svg', 'webp'])
                    ->max(5 * 1024), // 5MB in kilobytes
                function ($attribute, $value, $fail) {
                    // Additional MIME type validation for security
                    $allowedMimes = [
                        'image/png',
                        'image/jpeg',
                        'image/jpg',
                        'image/svg+xml',
                        'image/webp'
                    ];
                    
                    if (!in_array($value->getMimeType(), $allowedMimes)) {
                        $fail('نوع الملف غير مدعوم. يرجى رفع صورة صالحة.');
                    }
                },
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'logo.required' => 'يرجى اختيار ملف الشعار.',
            'logo.file' => 'يجب أن يكون الشعار ملفاً صالحاً.',
            'logo.mimes' => 'نوع الملف غير مدعوم. الصيغ المدعومة: PNG, JPG, JPEG, SVG, WEBP.',
            'logo.max' => 'حجم الملف يجب أن لا يتجاوز 5 ميجابايت.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        throw new \Illuminate\Validation\ValidationException($validator, response()->json([
            'success' => false,
            'message' => 'فشل التحقق من البيانات.',
            'errors' => $validator->errors(),
        ], 422));
    }
}