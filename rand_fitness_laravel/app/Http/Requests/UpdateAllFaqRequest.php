<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAllFaqRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            // Section
            'section' => 'nullable|array',
            'section.title_en' => 'required_with:section|string|max:255',
            'section.title_ar' => 'required_with:section|string|max:255',
            'section.subtitle_en' => 'nullable|string|max:500',
            'section.subtitle_ar' => 'nullable|string|max:500',
            
            // Arabic Questions
            'arabic_questions' => 'nullable|array',
            'arabic_questions.*.id' => 'nullable|integer|exists:faq_questions_ar,id',
            'arabic_questions.*.category' => 'required|string|max:255',
            'arabic_questions.*.question' => 'required|string|max:1000',
            'arabic_questions.*.answer' => 'required|string|max:2000',
            'arabic_questions.*.icon' => 'nullable|string|max:10',
            
            // English Questions
            'english_questions' => 'nullable|array',
            'english_questions.*.id' => 'nullable|integer|exists:faq_questions_en,id',
            'english_questions.*.category' => 'required|string|max:255',
            'english_questions.*.question' => 'required|string|max:1000',
            'english_questions.*.answer' => 'required|string|max:2000',
            'english_questions.*.icon' => 'nullable|string|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'section.title_en.required_with' => 'عنوان القسم بالإنجليزية مطلوب',
            'section.title_ar.required_with' => 'عنوان القسم بالعربية مطلوب',
            
            'arabic_questions.*.category.required' => 'الفئة مطلوبة',
            'arabic_questions.*.question.required' => 'السؤال مطلوب',
            'arabic_questions.*.answer.required' => 'الجواب مطلوب',
            
            'english_questions.*.category.required' => 'Category is required',
            'english_questions.*.question.required' => 'Question is required',
            'english_questions.*.answer.required' => 'Answer is required',
        ];
    }
}