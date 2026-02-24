<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SendFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required',
            'caption' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (!$this->hasFile('file')) {
                return;
            }
            
            $file = $this->file('file');
            
            // Check if file is valid
            if (!$file->isValid()) {
                $validator->errors()->add('file', 'فشل في رفع الملف. تأكد من إعدادات السيرفر.');
                return;
            }
            
            $extension = strtolower($file->getClientOriginalExtension());
            $mimeType = $file->getMimeType() ?? 'application/octet-stream';
            $fileSize = $file->getSize();
            
            // Video extensions - always allowed regardless of mime type
            $videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'mkv', 'webm', '3gp', 'flv', 'm4v', 'mpeg', 'mpg', 'ts', 'mts'];
            
            // Image extensions
            $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
            
            // Document extensions
            $docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
            
            // Archive extensions
            $archiveExtensions = ['zip', 'rar', '7z'];
            
            // All allowed extensions
            $allowedExtensions = array_merge($videoExtensions, $imageExtensions, $docExtensions, $archiveExtensions);
            
            // Check by extension first (more reliable for videos)
            $isVideo = in_array($extension, $videoExtensions);
            $isImage = in_array($extension, $imageExtensions);
            $isDoc = in_array($extension, $docExtensions);
            $isArchive = in_array($extension, $archiveExtensions);
            
            // Also check mime type for videos
            if (!$isVideo && (str_starts_with($mimeType, 'video/') || $mimeType === 'application/octet-stream')) {
                // If mime says it's a video, allow it
                $isVideo = true;
            }
            
            // Validate extension
            if (!in_array($extension, $allowedExtensions) && !$isVideo) {
                $validator->errors()->add(
                    'file',
                    'نوع الملف غير مدعوم (' . $extension . '). الأنواع المدعومة: صور، فيديو، PDF، مستندات Office'
                );
                return;
            }
            
            // Size limits - Videos have NO limit, others have 100MB limit
            if (!$isVideo && $fileSize > 100 * 1024 * 1024) {
                $validator->errors()->add(
                    'file',
                    'حجم الملف يجب أن لا يتجاوز 100 ميجابايت'
                );
            }
            
            // Videos - no size limit at all (PHP/Apache settings will handle this)
        });
    }

    public function messages(): array
    {
        return [
            'file.required' => 'يرجى اختيار ملف للرفع',
            'caption.max' => 'الوصف يجب أن لا يتجاوز 1000 حرف',
        ];
    }
    
    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'فشل التحقق من الملف',
            'errors' => $validator->errors()
        ], 422));
    }
}