<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LinkUpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $socials = [
            'instagram', 'tiktok', 'youtube', 'twitter', 'linkedin',
            'facebook', 'github', 'twitch', 'telegram', 'whatsapp',
            'discord', 'snapchat', 'pinterest', 'website', 'podcast',
        ];

        $merge = [];
        foreach ($socials as $key) {
            if ($this->has($key)) {
                $merge[$key] = trim((string) $this->input($key));
            }
        }

        $this->merge($merge);
    }

    public function rules(): array
    {
        return [
            'name'      => ['nullable', 'string', 'max:60'],
            'bio'       => ['nullable', 'string', 'max:160'],
            'name_font' => ['nullable', 'string', 'max:100'],
            'bio_font'  => ['nullable', 'string', 'max:100'],
            'instagram' => ['nullable', 'string', 'max:500'],
            'tiktok'    => ['nullable', 'string', 'max:500'],
            'youtube'   => ['nullable', 'string', 'max:500'],
            'twitter'   => ['nullable', 'string', 'max:500'],
            'linkedin'  => ['nullable', 'string', 'max:500'],
            'facebook'  => ['nullable', 'string', 'max:500'],
            'github'    => ['nullable', 'string', 'max:500'],
            'twitch'    => ['nullable', 'string', 'max:500'],
            'telegram'  => ['nullable', 'string', 'max:500'],
            'whatsapp'  => ['nullable', 'string', 'max:500'],
            'discord'   => ['nullable', 'string', 'max:500'],
            'snapchat'  => ['nullable', 'string', 'max:500'],
            'pinterest' => ['nullable', 'string', 'max:500'],
            'website'   => ['nullable', 'string', 'max:500'],
            'podcast'   => ['nullable', 'string', 'max:500'],
        ];
    }
}