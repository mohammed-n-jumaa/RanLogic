<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BulkUpdateCertificationsRequest extends FormRequest
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
            'certifications' => 'required|array',
            'certifications.*.id' => 'nullable|integer|exists:certifications,id',
            'certifications.*.icon' => 'nullable|string|max:10',
            'certifications.*.title_en' => 'required|string|max:255',
            'certifications.*.title_ar' => 'required|string|max:255',
            'certifications.*.organization_en' => 'required|string|max:255',
            'certifications.*.organization_ar' => 'required|string|max:255',
            'certifications.*.is_verified' => 'nullable|boolean',
            'certifications.*.is_active' => 'nullable|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'certifications.required' => 'قائمة الشهادات مطلوبة',
            'certifications.array' => 'قائمة الشهادات يجب أن تكون مصفوفة',
            'certifications.*.id.exists' => 'الشهادة غير موجودة',
            'certifications.*.title_en.required' => 'العنوان بالإنجليزية مطلوب',
            'certifications.*.title_ar.required' => 'العنوان بالعربية مطلوب',
            'certifications.*.organization_en.required' => 'اسم المنظمة بالإنجليزية مطلوب',
            'certifications.*.organization_ar.required' => 'اسم المنظمة بالعربية مطلوب',
        ];
    }
}