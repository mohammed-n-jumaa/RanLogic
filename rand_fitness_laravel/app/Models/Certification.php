<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Certification extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'icon',
        'title_en',
        'title_ar',
        'organization_en',
        'organization_ar',
        'is_verified',
        'order',
        'is_active',
        'updated_by',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'is_active' => 'boolean',
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
     * Scope active certifications
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope verified certifications
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope ordered certifications
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Get localized title
     */
    public function getTitle($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->title_en : $this->title_ar;
    }

    /**
     * Get localized organization
     */
    public function getOrganization($locale = 'ar'): string
    {
        return $locale === 'en' ? $this->organization_en : $this->organization_ar;
    }

    /**
     * Get full certification data for API
     */
    public function toApiArray($locale = 'ar'): array
    {
        return [
            'id' => $this->id,
            'icon' => $this->icon,
            'title' => $this->getTitle($locale),
            'organization' => $this->getOrganization($locale),
            'is_verified' => $this->is_verified,
            'order' => $this->order,
        ];
    }
}