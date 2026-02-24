<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class AboutCoach extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'about_coach';

    protected $fillable = [
        'image_path',
        'image_name',
        'badge_en',
        'badge_ar',
        'title_en',
        'title_ar',
        'main_description_en',
        'main_description_ar',
        'highlight_text_en',
        'highlight_text_ar',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get features relationship
     */
    public function features()
    {
        return $this->hasMany(CoachFeature::class);
    }

    /**
     * Get active features
     */
    public function activeFeatures()
    {
        return $this->hasMany(CoachFeature::class)
            ->where('is_active', true)
            ->orderBy('order');
    }

    /**
     * Get updater relationship
     */
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Get image URL accessor
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        // Check public path first (Windows/WAMP compatibility)
        $publicPath = public_path('images/coach/' . basename($this->image_path));
        if (file_exists($publicPath)) {
            return asset('images/coach/' . basename($this->image_path));
        }

        // Fall back to storage
        return Storage::url($this->image_path);
    }

    /**
     * Get localized badge
     */
    public function getBadge($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->badge_en : $this->badge_ar;
    }

    /**
     * Get localized title
     */
    public function getTitle($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    /**
     * Get localized main description
     */
    public function getMainDescription($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->main_description_en : $this->main_description_ar;
    }

    /**
     * Get localized highlight text
     */
    public function getHighlightText($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->highlight_text_en : $this->highlight_text_ar;
    }

    /**
     * Scope active
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($aboutCoach) {
            // Delete image files
            if ($aboutCoach->image_path) {
                // Delete from storage
                Storage::delete($aboutCoach->image_path);

                // Delete from public (Windows/WAMP)
                $publicPath = public_path('images/coach/' . basename($aboutCoach->image_path));
                if (file_exists($publicPath)) {
                    @unlink($publicPath);
                }
            }
        });
    }
}