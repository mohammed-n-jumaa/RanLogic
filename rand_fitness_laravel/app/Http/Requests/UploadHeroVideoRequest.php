<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadHeroVideoRequest extends FormRequest
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
            'video' => [
                'required',
                'file',
                'mimetypes:video/mp4,video/webm,video/quicktime,video/x-msvideo',
                'max:51200', // 50MB in KB
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'video.required' => 'الفيديو مطلوب',
            'video.file' => 'يجب أن يكون ملف فيديو',
            'video.mimetypes' => 'الصيغ المدعومة فقط: MP4, WEBM, MOV',
            'video.max' => 'حجم الفيديو يجب أن لا يتجاوز 50MB',
        ];
    }
}