<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTraineeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('id');
        
        return [
            'name' => 'sometimes|required|string|max:255',
            'email' => "sometimes|required|email|max:255|unique:users,email,{$userId}",
            'password' => 'sometimes|nullable|string|min:8',
            'phone' => 'nullable|string|max:255',
            'age' => 'nullable|integer|min:1|max:120',
            'height' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'waist' => 'nullable|numeric|min:0',
            'hips' => 'nullable|numeric|min:0',
            'gender' => 'nullable|in:male,female',
            'goal' => 'nullable|in:weight-loss,muscle-gain,toning,fitness',
            'workout_place' => 'nullable|in:home,gym',
            'program' => 'nullable|string|max:255',
            'health_notes' => 'nullable|string',
            'avatar' => 'nullable|file|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
        ];
    }
    
    public function messages(): array
    {
        return [
            'avatar.image' => 'يجب أن يكون الملف صورة',
            'avatar.mimes' => 'الصورة يجب أن تكون بصيغة jpeg, jpg, png, gif, أو webp',
            'avatar.max' => 'حجم الصورة يجب ألا يتجاوز 5MB',
            'avatar.file' => 'يجب أن يكون الملف صالحاً',
        ];
    }
}