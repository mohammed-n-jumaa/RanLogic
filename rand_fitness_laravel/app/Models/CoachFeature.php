<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'about_coach_id',
        'icon',
        'title_en',
        'title_ar',
        'description_en',
        'description_ar',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get about coach relationship
     */
    public function aboutCoach()
    {
        return $this->belongsTo(AboutCoach::class);
    }

    /**
     * Get localized title
     */
    public function getTitle($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    /**
     * Get localized description
     */
    public function getDescription($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->description_en : $this->description_ar;
    }

    /**
     * Scope active
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope ordered
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}