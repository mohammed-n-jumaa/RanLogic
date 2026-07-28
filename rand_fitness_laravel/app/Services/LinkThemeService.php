<?php

namespace App\Services;

use App\Models\SiteSetting;

class LinkThemeService
{
    private const THEME_KEY = 'active_link_theme';
    private const DEFAULT_THEME = 'minimal';

    public function getTheme(): string
    {
        $setting = SiteSetting::where('key', self::THEME_KEY)->first();

        return $setting ? $setting->value : self::DEFAULT_THEME;
    }

    public function updateTheme(string $themeId): string
    {
        $setting = SiteSetting::updateOrCreate(
            ['key' => self::THEME_KEY],
            ['value' => $themeId]
        );

        return $setting->value;
    }
}