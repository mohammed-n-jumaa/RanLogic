<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            // كلمة مرور قوية: 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، رمز خاص
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+=\-\[\]{};:,.<>]).+$/'
            ],
            'password_confirmation' => 'required|string|min:8',
            'language' => 'nullable|string|in:ar,en',
            'gender' => 'nullable|string|in:male,female',
            'phone' => 'nullable|string|max:20',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'الاسم مطلوب',
            'name.min' => 'الاسم يجب أن يكون 3 أحرف على الأقل',
            'name.max' => 'الاسم يجب أن لا يتجاوز 255 حرف',
            
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صحيح',
            'email.max' => 'البريد الإلكتروني يجب أن لا يتجاوز 255 حرف',
            'email.unique' => 'هذا البريد الإلكتروني مستخدم بالفعل',
            
            'password.required' => 'كلمة المرور مطلوبة',
            'password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'password.regex' => 'كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز خاص',
            'password.confirmed' => 'كلمة المرور غير متطابقة',
            
            'password_confirmation.required' => 'تأكيد كلمة المرور مطلوب',
            'password_confirmation.min' => 'تأكيد كلمة المرور يجب أن يكون 8 أحرف على الأقل',
            
            'language.in' => 'اللغة يجب أن تكون إما عربية أو إنجليزية',
            
            'gender.in' => 'الجنس يجب أن يكون ذكر أو أنثى',
            
            'phone.max' => 'رقم الهاتف يجب أن لا يتجاوز 20 رقم',
        ];
    }
}