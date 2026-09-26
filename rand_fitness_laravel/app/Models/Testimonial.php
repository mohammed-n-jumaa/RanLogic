<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TestimonialsSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'testimonials_section';

    protected $fillable = [
        'badge_en',
        'badge_ar',
        'title_en',
        'title_ar',
        'description_en',
        'description_ar',
        'is_active',
        'design_type',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getBadge($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->badge_en : $this->badge_ar;
    }

    public function getTitle($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    public function getDescription($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->description_en : $this->description_ar;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
