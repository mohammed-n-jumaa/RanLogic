<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAboutCoachRequest extends FormRequest
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
            // Badge
            'badge_en' => 'nullable|string|max:100',
            'badge_ar' => 'nullable|string|max:100',
            
            // Title
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            
            // Main Description
            'main_description_en' => 'required|string|max:2000',
            'main_description_ar' => 'required|string|max:2000',
            
            // Highlight Text
            'highlight_text_en' => 'nullable|string|max:1000',
            'highlight_text_ar' => 'nullable|string|max:1000',
            
            // Features
            'features' => 'nullable|array',
            'features.*.id' => 'nullable|integer|exists:coach_features,id',
            'features.*.icon' => 'nullable|string|max:10',
            'features.*.title_en' => 'required|string|max:255',
            'features.*.title_ar' => 'required|string|max:255',
            'features.*.description_en' => 'required|string|max:500',
            'features.*.description_ar' => 'required|string|max:500',
            'features.*.is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'badge_en.max' => 'الشارة بالإنجليزية يجب أن لا تتجاوز 100 حرف',
            'badge_ar.max' => 'الشارة بالعربية يجب أن لا تتجاوز 100 حرف',
            
            'title_en.required' => 'العنوان بالإنجليزية مطلوب',
            'title_en.max' => 'العنوان بالإنجليزية يجب أن لا يتجاوز 255 حرف',
            'title_ar.required' => 'العنوان بالعربية مطلوب',
            'title_ar.max' => 'العنوان بالعربية يجب أن لا يتجاوز 255 حرف',
            
            'main_description_en.required' => 'الوصف الرئيسي بالإنجليزية مطلوب',
            'main_description_en.max' => 'الوصف الرئيسي بالإنجليزية يجب أن لا يتجاوز 2000 حرف',
            'main_description_ar.required' => 'الوصف الرئيسي بالعربية مطلوب',
            'main_description_ar.max' => 'الوصف الرئيسي بالعربية يجب أن لا يتجاوز 2000 حرف',
            
            'highlight_text_en.max' => 'النص المميز بالإنجليزية يجب أن لا يتجاوز 1000 حرف',
            'highlight_text_ar.max' => 'النص المميز بالعربية يجب أن لا يتجاوز 1000 حرف',
            
            'features.*.title_en.required' => 'عنوان الميزة بالإنجليزية مطلوب',
            'features.*.title_ar.required' => 'عنوان الميزة بالعربية مطلوب',
            'features.*.description_en.required' => 'وصف الميزة بالإنجليزية مطلوب',
            'features.*.description_ar.required' => 'وصف الميزة بالعربية مطلوب',
        ];
    }
}