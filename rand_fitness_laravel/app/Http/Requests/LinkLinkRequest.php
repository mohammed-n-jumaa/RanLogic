<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LinkLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'      => ['required', 'string', 'max:255'],
            'url'        => ['required', 'url', 'max:2048'],
            'icon'       => ['sometimes', 'string', 'max:100'],
            'active'     => ['sometimes', 'boolean'],
            'title_font' => ['sometimes', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required.',
            'url.required'   => 'URL is required.',
            'url.url'        => 'Must be a valid URL starting with http:// or https://',
        ];
    }
}