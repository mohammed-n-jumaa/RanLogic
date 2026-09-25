<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroCtaButton extends Model
{
    protected $fillable = [
        'hero_section_id', 'design_key',
        'label_en', 'label_ar', 'style',
        'target_type', 'target_value',
        'order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean', 'order' => 'integer'];

    public function heroSection() { return $this->belongsTo(HeroSection::class); }
    public function getLabel($l = 'ar') { return $l === 'en' ? $this->label_en : $this->label_ar; }
    public function scopeActive($q) { return $q->where('is_active', true); }
    public function scopeOrdered($q) { return $q->orderBy('order'); }
    public function scopeForDesign($q, $key) { return $q->where('design_key', $key); }
}
