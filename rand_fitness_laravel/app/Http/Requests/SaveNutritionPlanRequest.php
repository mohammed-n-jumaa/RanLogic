<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveNutritionPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'year' => 'nullable|integer|min:2020|max:2100',
            'month' => 'nullable|integer|min:1|max:12',
            'pdf_file' => 'nullable|file|mimes:pdf|max:10240',
            
            'meals' => 'nullable|array',
            'meals.*.id' => 'nullable|integer|exists:nutrition_meals,id',
            'meals.*.meal_date' => 'required|date',
            'meals.*.meal_type' => 'required|string|max:255',
            'meals.*.meal_time' => 'nullable|date_format:H:i',
            'meals.*.meal_image' => 'nullable|file|image|max:5120',
            'meals.*.order' => 'nullable|integer|min:0',
            
            'meals.*.items' => 'nullable|array',
            'meals.*.items.*.name' => 'required|string|max:255',
            'meals.*.items.*.calories' => 'nullable|integer|min:0',
            'meals.*.items.*.protein' => 'nullable|numeric|min:0',
            'meals.*.items.*.carbs' => 'nullable|numeric|min:0',
            'meals.*.items.*.fats' => 'nullable|numeric|min:0',
            'meals.*.items.*.completed' => 'nullable|boolean',
            'meals.*.items.*.order' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'pdf_file.mimes' => 'يجب أن يكون الملف PDF',
            'pdf_file.max' => 'حجم الملف يجب ألا يتجاوز 10MB',
            'meals.*.meal_date.required' => 'تاريخ الوجبة مطلوب',
            'meals.*.meal_type.required' => 'نوع الوجبة مطلوب',
            'meals.*.items.*.name.required' => 'اسم الطعام مطلوب',
        ];
    }
}