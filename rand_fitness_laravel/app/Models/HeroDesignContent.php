<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroDesignContent extends Model
{
    protected $fillable = [
        'hero_section_id', 'design_key',
        'badge_en', 'badge_ar',
        'main_title_en', 'main_title_ar',
        'sub_title_en', 'sub_title_ar',
        'description_en', 'description_ar',
    ];

    public function heroSection() { return $this->belongsTo(HeroSection::class); }

    public function getBadge($l = 'ar')       { return $l === 'en' ? $this->badge_en       : $this->badge_ar; }
    public function getMainTitle($l = 'ar')   { return $l === 'en' ? $this->main_title_en  : $this->main_title_ar; }
    public function getSubTitle($l = 'ar')    { return $l === 'en' ? $this->sub_title_en   : $this->sub_title_ar; }
    public function getDescription($l = 'ar') { return $l === 'en' ? $this->description_en : $this->description_ar; }
}
