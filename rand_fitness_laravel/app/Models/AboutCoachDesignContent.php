<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutCoachDesignContent extends Model
{
    protected $table = 'about_coach_design_contents';

    protected $fillable = [
        'about_coach_id',
        'design_key',
        'badge_en',
        'badge_ar',
        'title_en',
        'title_ar',
        'main_description_en',
        'main_description_ar',
        'highlight_text_en',
        'highlight_text_ar',
    ];

    public function aboutCoach()
    {
        return $this->belongsTo(AboutCoach::class);
    }

    public function getBadge($locale = 'ar')
    {
        return $locale === 'en' ? $this->badge_en : $this->badge_ar;
    }

    public function getTitle($locale = 'ar')
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    public function getMainDescription($locale = 'ar')
    {
        return $locale === 'en' ? $this->main_description_en : $this->main_description_ar;
    }

    public function getHighlightText($locale = 'ar')
    {
        return $locale === 'en' ? $this->highlight_text_en : $this->highlight_text_ar;
    }
}
