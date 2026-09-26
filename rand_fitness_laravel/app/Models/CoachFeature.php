<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CoachFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'about_coach_id',
        'design_key',
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

    public function aboutCoach()
    {
        return $this->belongsTo(AboutCoach::class);
    }

    public function getTitle($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    public function getDescription($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->description_en : $this->description_ar;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeForDesign($query, $key)
    {
        return $query->where('design_key', $key);
    }
}
