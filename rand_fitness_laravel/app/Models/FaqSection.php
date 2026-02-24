<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FaqSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'faq_section';

    protected $fillable = [
        'title_en',
        'title_ar',
        'subtitle_en',
        'subtitle_ar',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get the user who last updated
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get localized title
     */
    public function getTitle($locale = 'ar')
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    /**
     * Get localized subtitle
     */
    public function getSubtitle($locale = 'ar')
    {
        return $locale === 'en' ? $this->subtitle_en : $this->subtitle_ar;
    }

    /**
     * Scope active sections
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}