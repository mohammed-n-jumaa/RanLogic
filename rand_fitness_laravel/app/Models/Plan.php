<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'plan_id',
        'name_en',
        'name_ar',
        'subtitle_en',
        'subtitle_ar',
        'icon',
        'color',
        'is_popular',
        'badge_text_en',
        'badge_text_ar',
        'price_1month',
        'price_3months',
        'price_6months',
        'discount_3months',
        'discount_6months',
        'features_en',
        'features_ar',
        'is_active',
        'order',
    ];

    protected $casts = [
        'price_1month' => 'decimal:2',
        'price_3months' => 'decimal:2',
        'price_6months' => 'decimal:2',
        'features_en' => 'array',
        'features_ar' => 'array',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'discount_3months' => 'integer',
        'discount_6months' => 'integer',
    ];

    protected $appends = [
        'name_localized',
        'subtitle_localized',
        'features_localized',
        'badge_text_localized',
    ];

    /**
     * Get localized name.
     */
    public function getNameLocalizedAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? $this->name_ar : $this->name_en;
    }

    /**
     * Get localized subtitle.
     */
    public function getSubtitleLocalizedAttribute(): string
    {
        $locale = app()->getLocale();
        return $locale === 'ar' ? $this->subtitle_ar : $this->subtitle_en;
    }

    /**
     * Get localized badge text.
     */
    public function getBadgeTextLocalizedAttribute(): ?string
    {
        if (!$this->badge_text_en && !$this->badge_text_ar) {
            return null;
        }

        $locale = app()->getLocale();
        return $locale === 'ar' ? $this->badge_text_ar : $this->badge_text_en;
    }

    /**
     * Get localized features.
     */
    public function getFeaturesLocalizedAttribute(): array
    {
        $locale = app()->getLocale();
        $features = $locale === 'ar' ? $this->features_ar : $this->features_en;
        
        return is_array($features) ? $features : [];
    }

    /**
     * Get price for specific duration.
     */
    public function getPrice(string $duration): float
    {
        return match($duration) {
            '3months' => $this->price_3months,
            '6months' => $this->price_6months,
            default => $this->price_1month,
        };
    }

    /**
     * Get original price (before discount).
     */
    public function getOriginalPrice(string $duration): float
    {
        $monthlyPrice = $this->price_1month;
        
        return match($duration) {
            '3months' => $monthlyPrice * 3,
            '6months' => $monthlyPrice * 6,
            default => $monthlyPrice,
        };
    }

    /**
     * Get discount percentage for duration.
     */
    public function getDiscountPercent(string $duration): int
    {
        return match($duration) {
            '3months' => $this->discount_3months,
            '6months' => $this->discount_6months,
            default => 0,
        };
    }

    /**
     * Calculate discount amount.
     */
    public function getDiscountAmount(string $duration): float
    {
        $originalPrice = $this->getOriginalPrice($duration);
        $discountedPrice = $this->getPrice($duration);
        
        return $originalPrice - $discountedPrice;
    }

    /**
     * Get pricing data for API.
     */
    public function getPricingForApi(string $locale = 'ar'): array
    {
        $isArabic = $locale === 'ar';
        
        return [
            'id' => $this->plan_id,
            'name' => $isArabic ? $this->name_ar : $this->name_en,
            'subtitle' => $isArabic ? $this->subtitle_ar : $this->subtitle_en,
            'icon' => $this->icon,
            'color' => $this->color,
            'is_popular' => $this->is_popular,
            'badge' => $isArabic ? $this->badge_text_ar : $this->badge_text_en,
            'pricing' => [
                '1month' => [
                    'price' => $this->price_1month,
                    'originalPrice' => $this->getOriginalPrice('1month'),
                    'discount' => 0,
                ],
                '3months' => [
                    'price' => $this->price_3months,
                    'originalPrice' => $this->getOriginalPrice('3months'),
                    'discount' => $this->discount_3months,
                ],
                '6months' => [
                    'price' => $this->price_6months,
                    'originalPrice' => $this->getOriginalPrice('6months'),
                    'discount' => $this->discount_6months,
                ],
            ],
            'features' => $isArabic ? $this->features_ar : $this->features_en,
        ];
    }

    /**
     * Scope active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope ordered plans.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order')->orderBy('id');
    }

    /**
     * Scope popular plans.
     */
    public function scopePopular($query)
    {
        return $query->where('is_popular', true);
    }
}