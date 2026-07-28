<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'plan_type',
        'duration',
        'amount',
        'original_amount',
        'discount_percentage',
        'payment_method',
        'status',
        'paypal_order_id',
        'paypal_payer_id',
        'bank_transfer_number',
        'bank_receipt_path',
        'currency',
        'notes',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'original_amount' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'approved')
                     ->where('ends_at', '>', now());
    }

    public function getPlanNameAttribute()
    {
        $plans = [
            'basic' => 'Basic Plan',
            'nutrition' => 'Nutrition Plan',
            'elite' => 'Elite Plan',
            'vip' => 'VIP Plan',
        ];

        return $plans[$this->plan_type] ?? $this->plan_type;
    }

    public function getDurationNameAttribute()
    {
        $durations = [
            '1month' => '1 Month',
            '3months' => '3 Months',
            '6months' => '6 Months',
        ];

        return $durations[$this->duration] ?? $this->duration;
    }

    public function getPaymentMethodNameAttribute()
    {
        $methods = [
            'paypal' => 'PayPal',
            'bank_transfer' => 'Bank Transfer',
        ];

        return $methods[$this->payment_method] ?? $this->payment_method;
    }

    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => '<span class="badge bg-warning">Pending</span>',
            'approved' => '<span class="badge bg-success">Active</span>',
            'rejected' => '<span class="badge bg-danger">Rejected</span>',
            'cancelled' => '<span class="badge bg-secondary">Cancelled</span>',
        ];

        return $badges[$this->status] ?? '';
    }

    public function calculateEndDate()
    {
        $startDate = $this->starts_at ?? now();
        
        switch ($this->duration) {
            case '3months':
                return $startDate->copy()->addMonths(3);
            case '6months':
                return $startDate->copy()->addMonths(6);
            default:
                return $startDate->copy()->addMonth();
        }
    }

    public function activate()
    {
        $this->update([
            'status' => 'approved',
            'starts_at' => now(),
            'ends_at' => $this->calculateEndDate(),
        ]);

        // Update user subscription status
        $this->user->update([
            'has_active_subscription' => true,
            'subscription_start_date' => now(),
            'subscription_end_date' => $this->ends_at,
        ]);
    }

    /**
     * Get the plan for this subscription
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

}