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
        'bg_style',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function features()
    {
        return $this->hasMany(CoachFeature::class)->orderBy('order');
    }

    public function activeFeatures()
    {
        return $this->hasMany(CoachFeature::class)
            ->where('is_active', true)
            ->orderBy('order');
    }

    public function designContents()
    {
        return $this->hasMany(AboutCoachDesignContent::class);
    }

    public function designContent($key)
    {
        return $this->designContents()->where('design_key', $key)->first();
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        $publicPath = public_path('images/coach/' . basename($this->image_path));
        if (file_exists($publicPath)) {
            return asset('images/coach/' . basename($this->image_path));
        }

        return Storage::url($this->image_path);
    }

    public function getBadge($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->badge_en : $this->badge_ar;
    }

    public function getTitle($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    public function getMainDescription($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->main_description_en : $this->main_description_ar;
    }

    public function getHighlightText($locale = 'ar'): ?string
    {
        return $locale === 'en' ? $this->highlight_text_en : $this->highlight_text_ar;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($aboutCoach) {
            if ($aboutCoach->image_path) {
                Storage::delete($aboutCoach->image_path);
                $publicPath = public_path('images/coach/' . basename($aboutCoach->image_path));
                if (file_exists($publicPath)) {
                    @unlink($publicPath);
                }
            }
        });
    }
}
