<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model
{
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_amount',
        'allowed_plans',
        'allowed_durations',
        'max_uses',
        'times_used',
        'is_active',
        'starts_at',
        'expires_at',
    ];

    protected $casts = [
        'discount_value'    => 'decimal:2',
        'min_amount'        => 'decimal:2',
        'allowed_plans'     => 'array',
        'allowed_durations' => 'array',
        'max_uses'          => 'integer',
        'times_used'        => 'integer',
        'is_active'         => 'boolean',
        'starts_at'         => 'datetime',
        'expires_at'        => 'datetime',
    ];

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ─── Relations ───────────────────────────────────────────────────────────

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function hasReachedLimit(): bool
    {
        return $this->max_uses !== null && $this->times_used >= $this->max_uses;
    }

    public function isValidForPlan(string $planKey): bool
    {
        if (empty($this->allowed_plans)) {
            return true;
        }

        return in_array($planKey, $this->allowed_plans, true);
    }

    public function isValidForDuration(string $duration): bool
    {
        if (empty($this->allowed_durations)) {
            return true;
        }

        return in_array($duration, $this->allowed_durations, true);
    }

    public function calculateDiscount(float $amount): float
    {
        if ($this->discount_type === 'percentage') {
            return round($amount * ($this->discount_value / 100), 2);
        }

        return min($this->discount_value, $amount);
    }

    public function incrementUsage(): void
    {
        $this->increment('times_used');
    }
}
