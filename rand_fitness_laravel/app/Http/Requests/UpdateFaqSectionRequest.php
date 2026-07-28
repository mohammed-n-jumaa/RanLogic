<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title_en' => 'required|string|max:255',
            'title_ar' => 'required|string|max:255',
            'subtitle_en' => 'nullable|string|max:500',
            'subtitle_ar' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'title_en.required' => 'العنوان بالإنجليزية مطلوب',
            'title_ar.required' => 'العنوان بالعربية مطلوب',
        ];
    }
}