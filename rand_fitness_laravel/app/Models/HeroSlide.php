<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class HeroSlide extends Model
{
    protected $fillable = [
        'hero_section_id', 'design_key',
        'image_path', 'image_name',
        'main_title_en', 'main_title_ar',
        'sub_title_en', 'sub_title_ar',
        'description_en', 'description_ar',
        'order', 'is_active',
    ];

    protected $casts = ['is_active' => 'boolean', 'order' => 'integer'];
    protected $appends = ['image_url'];

    public function heroSection() { return $this->belongsTo(HeroSection::class); }

    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) return null;
        $filename = basename($this->image_path);
        $publicPath = public_path('hero-slides/' . $filename);
        if (file_exists($publicPath)) return asset('hero-slides/' . $filename);
        return Storage::url($this->image_path);
    }

    public function getMainTitle($l = 'ar')   { return $l === 'en' ? $this->main_title_en  : $this->main_title_ar; }
    public function getSubTitle($l = 'ar')    { return $l === 'en' ? $this->sub_title_en   : $this->sub_title_ar; }
    public function getDescription($l = 'ar') { return $l === 'en' ? $this->description_en : $this->description_ar; }

    public function scopeActive($q) { return $q->where('is_active', true); }
    public function scopeOrdered($q) { return $q->orderBy('order'); }

    protected static function boot()
    {
        parent::boot();
        static::deleting(function ($slide) {
            if ($slide->image_path) {
                Storage::disk('public')->delete($slide->image_path);
                $pub = public_path('hero-slides/' . basename($slide->image_path));
                if (file_exists($pub)) @unlink($pub);
            }
        });
    }
}
