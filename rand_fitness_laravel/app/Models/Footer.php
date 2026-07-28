<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Footer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'logo_id',
        'description_en',
        'description_ar',
        'copyright_en',
        'copyright_ar',
        'quick_links_title_en',
        'quick_links_title_ar',
        'email',
        'phone',
        'address_en',
        'address_ar',
        'social_links',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'social_links' => 'array',
    ];

    public function logo()
    {
        return $this->belongsTo(Logo::class);
    }

    public function links()
    {
        return $this->hasMany(FooterLink::class)->orderBy('order');
    }

    public function quickLinks()
    {
        return $this->links()->where('type', 'quick_link');
    }

    public function legalLinks()
    {
        return $this->links()->where('type', 'legal_link');
    }

    // Accessors
    public function getDescriptionAttribute()
    {
        return app()->getLocale() === 'ar' 
            ? ($this->description_ar ?? $this->description_en)
            : ($this->description_en ?? $this->description_ar);
    }

    public function getCopyrightAttribute()
    {
        return app()->getLocale() === 'ar' 
            ? ($this->copyright_ar ?? $this->copyright_en)
            : ($this->copyright_en ?? $this->copyright_ar);
    }

    public function getQuickLinksTitleAttribute()
    {
        return app()->getLocale() === 'ar' 
            ? ($this->quick_links_title_ar ?? $this->quick_links_title_en)
            : ($this->quick_links_title_en ?? $this->quick_links_title_ar);
    }

    public function getAddressAttribute()
    {
        return app()->getLocale() === 'ar' 
            ? ($this->address_ar ?? $this->address_en)
            : ($this->address_en ?? $this->address_ar);
    }
}