<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:255'],
            'age' => ['nullable', 'integer', 'min:1', 'max:150'],
            'height' => ['nullable', 'numeric', 'min:0', 'max:300'],
            'weight' => ['nullable', 'numeric', 'min:0', 'max:500'],
            'waist' => ['nullable', 'numeric', 'min:0', 'max:300'],
            'hips' => ['nullable', 'numeric', 'min:0', 'max:300'],
            'gender' => ['nullable', Rule::in(['male', 'female'])],
            'goal' => ['nullable', Rule::in(['weight-loss', 'muscle-gain', 'toning', 'fitness'])],
            'workout_place' => ['nullable', Rule::in(['home', 'gym'])],
            'program' => ['nullable', 'string', 'max:255'],
            'health_notes' => ['nullable', 'string', 'max:2000'],
            'avatar' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:5120'], // 5MB max
            'has_active_subscription' => ['nullable', 'boolean'],
            'subscription_start_date' => ['nullable', 'date'],
            'subscription_end_date' => ['nullable', 'date', 'after_or_equal:subscription_start_date'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'الاسم مطلوب',
            'name.max' => 'الاسم يجب أن لا يتجاوز 255 حرف',
            'email.required' => 'البريد الإلكتروني مطلوب',
            'email.email' => 'البريد الإلكتروني غير صحيح',
            'email.unique' => 'البريد الإلكتروني مسجل مسبقاً',
            'age.integer' => 'العمر يجب أن يكون رقماً صحيحاً',
            'age.min' => 'العمر يجب أن يكون على الأقل 1',
            'age.max' => 'العمر يجب أن لا يتجاوز 150',
            'height.numeric' => 'الطول يجب أن يكون رقماً',
            'weight.numeric' => 'الوزن يجب أن يكون رقماً',
            'waist.numeric' => 'قياس الخصر يجب أن يكون رقماً',
            'hips.numeric' => 'قياس الأرداف يجب أن يكون رقماً',
            'gender.in' => 'الجنس المدخل غير صحيح',
            'goal.in' => 'الهدف المدخل غير صحيح',
            'workout_place.in' => 'مكان التدريب المدخل غير صحيح',
            'avatar.image' => 'الملف يجب أن يكون صورة',
            'avatar.mimes' => 'الصورة يجب أن تكون من نوع: jpeg, png, jpg, gif',
            'avatar.max' => 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت',
            'subscription_end_date.after_or_equal' => 'تاريخ انتهاء الاشتراك يجب أن يكون بعد أو يساوي تاريخ البداية',
        ];
    }
}