<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaveWorkoutPlanRequest extends FormRequest
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
            
            'exercises' => 'nullable|array',
            'exercises.*.id' => 'nullable|integer|exists:workout_exercises,id',
            'exercises.*.exercise_date' => 'required|date',
            'exercises.*.name' => 'required|string|max:255',
            'exercises.*.sets' => 'nullable|integer|min:1|max:100',
            'exercises.*.reps' => 'nullable|integer|min:1|max:1000',
            'exercises.*.notes' => 'nullable|string|max:2000',
            'exercises.*.youtube_url' => 'nullable|url|max:500',
            'exercises.*.video_file' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:51200',
            'exercises.*.completed' => 'nullable|boolean',
            'exercises.*.order' => 'nullable|integer|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'exercises.*.exercise_date.required' => 'تاريخ التمرين مطلوب',
            'exercises.*.name.required' => 'اسم التمرين مطلوب',
            'exercises.*.youtube_url.url' => 'رابط YouTube غير صحيح',
            'exercises.*.video_file.mimes' => 'الفيديو يجب أن يكون mp4, mov, avi, أو wmv',
            'exercises.*.video_file.max' => 'حجم الفيديو يجب ألا يتجاوز 50MB',
        ];
    }
}