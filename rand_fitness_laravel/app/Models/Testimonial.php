<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Testimonial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'image_path',
        'image_name',
        'name_en',
        'name_ar',
        'title_en',
        'title_ar',
        'text_en',
        'text_ar',
        'rating',
        'order',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'rating' => 'integer',
        'order' => 'integer',
    ];

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
        $publicPath = public_path('images/testimonials/' . basename($this->image_path));
        if (file_exists($publicPath)) {
            return asset('images/testimonials/' . basename($this->image_path));
        }

        // Fall back to storage
        return Storage::url($this->image_path);
    }

    /**
     * Get localized name
     */
    public function getName($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->name_en : $this->name_ar;
    }

    /**
     * Get localized title
     */
    public function getTitle($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    /**
     * Get localized text
     */
    public function getText($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->text_en : $this->text_ar;
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

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($testimonial) {
            // Delete image files
            if ($testimonial->image_path) {
                // Delete from storage
                Storage::disk('public')->delete($testimonial->image_path);

                // Delete from public (Windows/WAMP)
                $publicPath = public_path('images/testimonials/' . basename($testimonial->image_path));
                if (file_exists($publicPath)) {
                    @unlink($publicPath);
                }
            }
        });
    }
}