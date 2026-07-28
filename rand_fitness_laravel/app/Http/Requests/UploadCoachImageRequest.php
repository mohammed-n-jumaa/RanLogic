<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadCoachImageRequest extends FormRequest
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
            'image' => 'required|file|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'image.required' => 'الصورة مطلوبة',
            'image.file' => 'يجب أن يكون ملف',
            'image.image' => 'يجب أن تكون صورة',
            'image.mimes' => 'نوع الصورة يجب أن يكون: jpeg, jpg, png, webp',
            'image.max' => 'حجم الصورة يجب أن لا يتجاوز 5MB',
        ];
    }
}