<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LinkUploadPhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
        ];
    }
}