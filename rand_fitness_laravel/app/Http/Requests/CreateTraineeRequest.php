<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateTraineeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Allow all authenticated users (check in middleware)
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:255',
            'age' => 'nullable|integer|min:1|max:120',
            'height' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'waist' => 'nullable|numeric|min:0',
            'hips' => 'nullable|numeric|min:0',
            'gender' => 'nullable|in:male,female',
            'goal' => 'nullable|in:weight-loss,muscle-gain,toning,fitness',
            'workout_place' => 'nullable|in:home,gym',
            'program' => 'nullable|string|max:255',
            'health_notes' => 'nullable|string',
            'avatar' => 'nullable|file|image|mimes:jpeg,jpg,png,gif,webp|max:5120', // 5MB max
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'الاسم مطلوب',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صحيح',
            'email.unique' => 'البريد الإلكتروني مستخدم بالفعل',
            'password.required' => 'كلمة المرور مطلوبة',
            'password.min' => 'كلمة المرور يجب أن تكون 8 أحرف على الأقل',
            'avatar.image' => 'يجب أن يكون الملف صورة',
            'avatar.mimes' => 'الصورة يجب أن تكون بصيغة jpeg, jpg, png, gif, أو webp',
            'avatar.max' => 'حجم الصورة يجب ألا يتجاوز 5MB',
            'avatar.file' => 'يجب أن يكون الملف صالحاً',
        ];
    }
}