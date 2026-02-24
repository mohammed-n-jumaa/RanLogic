<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class HeroSection extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'video_path',
        'video_name',
        'video_type',
        'video_size',
        'badge_en',
        'badge_ar',
        'main_title_en',
        'main_title_ar',
        'sub_title_en',
        'sub_title_ar',
        'description_en',
        'description_ar',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'video_size' => 'integer',
    ];

    protected $appends = [
        'video_url',
    ];

    /**
     * Get video URL
     */
    public function getVideoUrlAttribute(): ?string
    {
        if (!$this->video_path) {
            return null;
        }

        // للـ Windows/WAMP - نفس حل الـ Logo
        $filename = basename($this->video_path);
        
        // Try public/videos first
        $publicPath = public_path('videos/' . $filename);
        if (file_exists($publicPath)) {
            return asset('videos/' . $filename);
        }
        
        // Fallback to storage
        return Storage::url($this->video_path);
    }

    /**
     * Get formatted video size
     */
    public function getVideoSizeFormattedAttribute(): ?string
    {
        if (!$this->video_size) {
            return null;
        }

        $size = $this->video_size;
        
        if ($size < 1024 * 1024) {
            return round($size / 1024, 2) . ' KB';
        } else {
            return round($size / (1024 * 1024), 2) . ' MB';
        }
    }

    /**
     * Get stats relationship
     */
    public function stats()
    {
        return $this->hasMany(HeroStat::class)->orderBy('order');
    }

    /**
     * Get active stats
     */
    public function activeStats()
    {
        return $this->hasMany(HeroStat::class)
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
     * Scope active records
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get localized badge
     */
    public function getBadge($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->badge_en : $this->badge_ar;
    }

    /**
     * Get localized main title
     */
    public function getMainTitle($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->main_title_en : $this->main_title_ar;
    }

    /**
     * Get localized sub title
     */
    public function getSubTitle($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->sub_title_en : $this->sub_title_ar;
    }

    /**
     * Get localized description
     */
    public function getDescription($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->description_en : $this->description_ar;
    }

    /**
     * Delete video file when model is deleted
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($heroSection) {
            // Delete video from storage
            if ($heroSection->video_path && Storage::exists($heroSection->video_path)) {
                Storage::delete($heroSection->video_path);
            }
            
            // Delete from public
            $publicPath = public_path('videos/' . basename($heroSection->video_path));
            if (file_exists($publicPath)) {
                unlink($publicPath);
            }
        });
    }
}