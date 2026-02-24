<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCertificationRequest extends FormRequest
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
            'icon' => 'nullable|string|max:10',
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'organization_en' => 'required|string|max:255',
            'organization_ar' => 'required|string|max:255',
            'is_verified' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title_en.required' => 'العنوان بالإنجليزية مطلوب',
            'title_en.max' => 'العنوان بالإنجليزية يجب أن لا يتجاوز 255 حرف',
            'title_ar.required' => 'العنوان بالعربية مطلوب',
            'title_ar.max' => 'العنوان بالعربية يجب أن لا يتجاوز 255 حرف',
            'organization_en.required' => 'اسم المنظمة بالإنجليزية مطلوب',
            'organization_en.max' => 'اسم المنظمة بالإنجليزية يجب أن لا يتجاوز 255 حرف',
            'organization_ar.required' => 'اسم المنظمة بالعربية مطلوب',
            'organization_ar.max' => 'اسم المنظمة بالعربية يجب أن لا يتجاوز 255 حرف',
            'icon.max' => 'الأيقونة يجب أن لا تتجاوز 10 أحرف',
            'order.integer' => 'الترتيب يجب أن يكون رقم صحيح',
            'order.min' => 'الترتيب يجب أن يكون أكبر من أو يساوي 0',
        ];
    }
}