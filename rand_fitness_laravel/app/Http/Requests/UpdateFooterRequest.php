<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFooterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'required_with:social_links|string',
            'social_links.*.url' => 'required_with:social_links|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'social_links.*.platform.required_with' => 'Platform is required for social links.',
            'social_links.*.url.required_with' => 'URL is required for social links.',
        ];
    }
}