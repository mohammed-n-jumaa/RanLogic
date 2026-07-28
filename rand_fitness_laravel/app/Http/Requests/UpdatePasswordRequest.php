<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string'],
            'new_password' => [
                'required',
                'string',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
            ],
            'confirm_password' => ['required', 'string', 'same:new_password'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'current_password.required' => 'كلمة المرور الحالية مطلوبة',
            'new_password.required' => 'كلمة المرور الجديدة مطلوبة',
            'new_password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'confirm_password.required' => 'تأكيد كلمة المرور مطلوب',
            'confirm_password.same' => 'كلمات المرور غير متطابقة',
        ];
    }
}