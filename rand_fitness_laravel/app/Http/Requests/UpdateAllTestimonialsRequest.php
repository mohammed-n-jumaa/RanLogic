<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAllTestimonialsRequest extends FormRequest
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
            // Section
            'section' => 'nullable|array',
            'section.badge_en' => 'nullable|string|max:100',
            'section.badge_ar' => 'nullable|string|max:100',
            'section.title_en' => 'required_with:section|string|max:255',
            'section.title_ar' => 'required_with:section|string|max:255',
            'section.description_en' => 'nullable|string|max:1000',
            'section.description_ar' => 'nullable|string|max:1000',
            
            // Testimonials
            'testimonials' => 'required|array',
            'testimonials.*.id' => 'nullable|integer|exists:testimonials,id',
            'testimonials.*.name_en' => 'required|string|max:255',
            'testimonials.*.name_ar' => 'required|string|max:255',
            'testimonials.*.title_en' => 'required|string|max:255',
            'testimonials.*.title_ar' => 'required|string|max:255',
            'testimonials.*.text_en' => 'required|string|max:2000',
            'testimonials.*.text_ar' => 'required|string|max:2000',
            'testimonials.*.rating' => 'required|integer|min:1|max:5',
            'testimonials.*.is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // Section
            'section.title_en.required_with' => 'عنوان القسم بالإنجليزية مطلوب',
            'section.title_ar.required_with' => 'عنوان القسم بالعربية مطلوب',
            
            // Testimonials
            'testimonials.required' => 'يجب إضافة رأي واحد على الأقل',
            'testimonials.*.name_en.required' => 'اسم العميل بالإنجليزية مطلوب',
            'testimonials.*.name_ar.required' => 'اسم العميل بالعربية مطلوب',
            'testimonials.*.title_en.required' => 'المهنة بالإنجليزية مطلوبة',
            'testimonials.*.title_ar.required' => 'المهنة بالعربية مطلوبة',
            'testimonials.*.text_en.required' => 'نص الرأي بالإنجليزية مطلوب',
            'testimonials.*.text_ar.required' => 'نص الرأي بالعربية مطلوب',
            'testimonials.*.rating.required' => 'التقييم مطلوب',
            'testimonials.*.rating.min' => 'التقييم يجب أن يكون بين 1 و 5',
            'testimonials.*.rating.max' => 'التقييم يجب أن يكون بين 1 و 5',
            'testimonials.*.text_en.max' => 'نص الرأي بالإنجليزية يجب أن لا يتجاوز 2000 حرف',
            'testimonials.*.text_ar.max' => 'نص الرأي بالعربية يجب أن لا يتجاوز 2000 حرف',
        ];
    }
}