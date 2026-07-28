<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTestimonialsSectionRequest extends FormRequest
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
            'badge_en' => 'nullable|string|max:100',
            'badge_ar' => 'nullable|string|max:100',
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'description_en' => 'nullable|string|max:1000',
            'description_ar' => 'nullable|string|max:1000',
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
            'badge_en.max' => 'الشارة بالإنجليزية يجب أن لا تتجاوز 100 حرف',
            'badge_ar.max' => 'الشارة بالعربية يجب أن لا تتجاوز 100 حرف',
            'description_en.max' => 'الوصف بالإنجليزية يجب أن لا يتجاوز 1000 حرف',
            'description_ar.max' => 'الوصف بالعربية يجب أن لا يتجاوز 1000 حرف',
        ];
    }
}