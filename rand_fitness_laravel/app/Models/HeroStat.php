<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeroStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_section_id',
        'value',
        'label_en',
        'label_ar',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get hero section relationship
     */
    public function heroSection()
    {
        return $this->belongsTo(HeroSection::class);
    }

    /**
     * Scope active stats
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope ordered stats
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Get localized label
     */
    public function getLabel($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->label_en : $this->label_ar;
    }
}