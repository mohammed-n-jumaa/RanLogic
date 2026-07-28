<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = [
        'plan_key',
        'name_ar',
        'name_en',
        'subtitle_ar',
        'subtitle_en',
        'price_1m',
        'original_price_1m',
        'discount_1m',
        'price_3m',
        'original_price_3m',
        'discount_3m',
        'price_6m',
        'original_price_6m',
        'discount_6m',
        'features_ar',
        'features_en',
        'is_popular',
        'badge_ar',
        'badge_en',
        'color',
        'icon',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'price_1m'          => 'decimal:2',
        'original_price_1m' => 'decimal:2',
        'price_3m'          => 'decimal:2',
        'original_price_3m' => 'decimal:2',
        'price_6m'          => 'decimal:2',
        'original_price_6m' => 'decimal:2',
        'discount_1m'       => 'integer',
        'discount_3m'       => 'integer',
        'discount_6m'       => 'integer',
        'features_ar'       => 'array',
        'features_en'       => 'array',
        'is_popular'        => 'boolean',
        'is_active'         => 'boolean',
        'sort_order'        => 'integer',
    ];

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Return pricing for a given duration key (1month | 3months | 6months).
     * Throws if not found — callers should validate duration upstream.
     */
    public function pricingFor(string $duration): array
    {
        $map = [
            '1month'  => ['amount' => (float) $this->price_1m,  'original_amount' => (float) $this->original_price_1m,  'discount_percentage' => $this->discount_1m],
            '3months' => ['amount' => (float) $this->price_3m,  'original_amount' => (float) $this->original_price_3m,  'discount_percentage' => $this->discount_3m],
            '6months' => ['amount' => (float) $this->price_6m,  'original_amount' => (float) $this->original_price_6m,  'discount_percentage' => $this->discount_6m],
        ];

        if (!isset($map[$duration])) {
            throw new \InvalidArgumentException("Invalid duration: {$duration}");
        }

        return $map[$duration];
    }

    /**
     * Format the full plan payload for the public API response.
     */
    public function toApiArray(string $locale = 'ar'): array
    {
        $isArabic = $locale === 'ar';

        return [
            'id'       => $this->plan_key,
            'name'     => $isArabic ? $this->name_ar     : $this->name_en,
            'subtitle' => $isArabic ? $this->subtitle_ar  : $this->subtitle_en,
            'pricing'  => [
                '1month'  => ['price' => (float) $this->price_1m,  'originalPrice' => (float) $this->original_price_1m,  'discount' => $this->discount_1m],
                '3months' => ['price' => (float) $this->price_3m,  'originalPrice' => (float) $this->original_price_3m,  'discount' => $this->discount_3m],
                '6months' => ['price' => (float) $this->price_6m,  'originalPrice' => (float) $this->original_price_6m,  'discount' => $this->discount_6m],
            ],
            'popular'  => $this->is_popular,
            'badge'    => $isArabic ? $this->badge_ar : $this->badge_en,
            'features' => $isArabic ? $this->features_ar : $this->features_en,
            'color'    => $this->color,
            'icon'     => $this->icon,
        ];
    }
}
