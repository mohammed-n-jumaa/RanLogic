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
            'description_en'        => 'nullable|string|max:1000',
            'description_ar'        => 'nullable|string|max:1000',
            'copyright_en'          => 'nullable|string|max:255',
            'copyright_ar'          => 'nullable|string|max:255',
            'quick_links_title_en'  => 'nullable|string|max:100',
            'quick_links_title_ar'  => 'nullable|string|max:100',
            'email'                 => 'nullable|email|max:255',
            'phone'                 => 'nullable|string|max:50',
            'address_en'            => 'nullable|string|max:500',
            'address_ar'            => 'nullable|string|max:500',
            'social_links'          => 'nullable|array',
            'social_links.*.platform' => 'required_with:social_links|string|max:50',
            'social_links.*.url'    => 'required_with:social_links|string|max:255',
        ];
    }
}