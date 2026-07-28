<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LinkUpdateThemeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'theme_id' => ['required', 'string', 'max:100'],
        ];
    }
}