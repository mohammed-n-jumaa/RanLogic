<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHeroSectionRequest extends FormRequest
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
            // English Content
            'badge_en' => 'nullable|string|max:255',
            'main_title_en' => 'nullable|string|max:255',
            'sub_title_en' => 'nullable|string|max:255',
            'description_en' => 'nullable|string|max:1000',
            
            // Arabic Content
            'badge_ar' => 'nullable|string|max:255',
            'main_title_ar' => 'nullable|string|max:255',
            'sub_title_ar' => 'nullable|string|max:255',
            'description_ar' => 'nullable|string|max:1000',
            
            // Stats
            'stats' => 'nullable|array',
            'stats.*.id' => 'nullable|integer|exists:hero_stats,id',
            'stats.*.value' => 'required_with:stats|string|max:50',
            'stats.*.label_en' => 'required_with:stats|string|max:255',
            'stats.*.label_ar' => 'required_with:stats|string|max:255',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // English
            'badge_en.max' => 'الشارة الإنجليزية يجب أن لا تتجاوز 255 حرف',
            'main_title_en.max' => 'العنوان الرئيسي الإنجليزي يجب أن لا يتجاوز 255 حرف',
            'sub_title_en.max' => 'العنوان الفرعي الإنجليزي يجب أن لا يتجاوز 255 حرف',
            'description_en.max' => 'الوصف الإنجليزي يجب أن لا يتجاوز 1000 حرف',
            
            // Arabic
            'badge_ar.max' => 'الشارة العربية يجب أن لا تتجاوز 255 حرف',
            'main_title_ar.max' => 'العنوان الرئيسي العربي يجب أن لا يتجاوز 255 حرف',
            'sub_title_ar.max' => 'العنوان الفرعي العربي يجب أن لا يتجاوز 255 حرف',
            'description_ar.max' => 'الوصف العربي يجب أن لا يتجاوز 1000 حرف',
            
            // Stats
            'stats.array' => 'الإحصائيات يجب أن تكون مصفوفة',
            'stats.*.id.exists' => 'الإحصائية غير موجودة',
            'stats.*.value.required_with' => 'قيمة الإحصائية مطلوبة',
            'stats.*.value.max' => 'قيمة الإحصائية يجب أن لا تتجاوز 50 حرف',
            'stats.*.label_en.required_with' => 'تسمية الإحصائية بالإنجليزية مطلوبة',
            'stats.*.label_en.max' => 'تسمية الإحصائية بالإنجليزية يجب أن لا تتجاوز 255 حرف',
            'stats.*.label_ar.required_with' => 'تسمية الإحصائية بالعربية مطلوبة',
            'stats.*.label_ar.max' => 'تسمية الإحصائية بالعربية يجب أن لا تتجاوز 255 حرف',
        ];
    }
}