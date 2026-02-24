<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'avatar',
        'phone',
        'height',
        'weight',
        'waist',
        'hips',
        'age',
        'gender',
        'goal',
        'workout_place',
        'program',
        'health_notes',
        'has_active_subscription',
        'subscription_start_date',
        'subscription_end_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'has_active_subscription' => 'boolean',
        'height' => 'decimal:2',
        'weight' => 'decimal:2',
        'waist' => 'decimal:2',
        'hips' => 'decimal:2',
        'age' => 'integer',
        'subscription_start_date' => 'date',
        'subscription_end_date' => 'date',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'avatar_url',
        'is_subscription_active',
        'bmi',
        'goal_label',
        'workout_place_label',
    ];

    /**
     * Get the user's avatar URL.
     *
     * @return string|null
     */
    public function getAvatarUrlAttribute(): ?string
    {
        if ($this->avatar) {
            // Check if it's a base64 image
            if (strpos($this->avatar, 'data:image') === 0) {
                return $this->avatar;
            }
            
            // Check if it's a full URL
            if (strpos($this->avatar, 'http') === 0) {
                return $this->avatar;
            }
            
            // Otherwise, it's a stored file
            return asset('storage/' . $this->avatar);
        }
        
        // Default avatar based on gender
        if ($this->gender === 'female') {
            return asset('images/default-avatar-female.png');
        }
        
        return asset('images/default-avatar-male.png');
    }

    /**
     * Check if subscription is currently active.
     *
     * @return bool
     */
    public function getIsSubscriptionActiveAttribute(): bool
    {
        if (!$this->has_active_subscription) {
            return false;
        }

        if (!$this->subscription_end_date) {
            return false;
        }

        return $this->subscription_end_date->isFuture();
    }

    /**
     * Calculate BMI (Body Mass Index).
     *
     * @return float|null
     */
    public function getBmiAttribute(): ?float
    {
        if (!$this->height || !$this->weight) {
            return null;
        }

        $heightInMeters = $this->height / 100;
        $bmi = $this->weight / ($heightInMeters * $heightInMeters);
        
        return round($bmi, 2);
    }

    /**
     * Get goal label.
     *
     * @return string|null
     */
    public function getGoalLabelAttribute(): ?string
    {
        $goals = [
            'weight-loss' => 'Weight Loss',
            'muscle-gain' => 'Muscle Gain',
            'toning' => 'Toning',
            'fitness' => 'General Fitness',
        ];

        return $goals[$this->goal] ?? null;
    }

    /**
     * Get workout place label.
     *
     * @return string|null
     */
    public function getWorkoutPlaceLabelAttribute(): ?string
    {
        $places = [
            'home' => 'Home',
            'gym' => 'Gym',
        ];

        return $places[$this->workout_place] ?? null;
    }

    /**
 * Subscriptions relationship
 */
public function subscriptions()
{
    return $this->hasMany(\App\Models\Subscription::class);
}

    /**
 * Get the user's active subscription
 */
public function activeSubscription()
{
    return $this->hasOne(Subscription::class)
        ->where('status', 'approved')
        ->where('ends_at', '>=', now())
        ->latest();
}

    /**
     * Scope a query to only include admins.
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope a query to only include regular users.
     */
    public function scopeRegularUsers($query)
    {
        return $query->where('role', 'user');
    }

    /**
     * Scope a query to only include active users.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include users with active subscriptions.
     */
    public function scopeWithActiveSubscription($query)
    {
        return $query->where('has_active_subscription', true)
            ->where('subscription_end_date', '>=', now());
    }

    /**
     * Scope by gender.
     */
    public function scopeByGender($query, $gender)
    {
        return $query->where('gender', $gender);
    }

    /**
     * Scope by goal.
     */
    public function scopeByGoal($query, $goal)
    {
        return $query->where('goal', $goal);
    }

    /**
     * Scope by workout place.
     */
    public function scopeByWorkoutPlace($query, $place)
    {
        return $query->where('workout_place', $place);
    }

    /**
     * Check if user is admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is regular user.
     *
     * @return bool
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    /**
     * Check if user is female.
     *
     * @return bool
     */
    public function isFemale(): bool
    {
        return $this->gender === 'female';
    }

    /**
     * Check if user is male.
     *
     * @return bool
     */
    public function isMale(): bool
    {
        return $this->gender === 'male';
    }

    /**
     * Update subscription status based on end date.
     *
     * @return void
     */
    public function updateSubscriptionStatus(): void
    {
        if ($this->subscription_end_date && $this->subscription_end_date->isPast()) {
            $this->update([
                'has_active_subscription' => false,
            ]);
        }
    }

    /**
     * Get BMI category.
     *
     * @return string|null
     */
    public function getBmiCategory(): ?string
    {
        $bmi = $this->bmi;

        if (!$bmi) {
            return null;
        }

        if ($bmi < 18.5) {
            return 'Underweight';
        } elseif ($bmi < 25) {
            return 'Normal';
        } elseif ($bmi < 30) {
            return 'Overweight';
        } else {
            return 'Obese';
        }
    }

    /**
     * Check if hips measurement is required (for females).
     *
     * @return bool
     */
    public function requiresHipsMeasurement(): bool
    {
        return $this->gender === 'female';
    }

    public function nutritionPlans()
{
    return $this->hasMany(NutritionPlan::class);
}

public function workoutPlans()
{
    return $this->hasMany(WorkoutPlan::class);
}

/**
 * Get subscription start date
 */
public function getSubscriptionStartDateAttribute()
{
    $subscription = $this->subscriptions()
        ->where('status', 'approved')
        ->whereDate('ends_at', '>=', now()) // ✅ تصحيح
        ->latest()
        ->first();
    
    return $subscription ? $subscription->starts_at : null; // ✅ تصحيح
}

/**
 * Get subscription end date  
 */
public function getSubscriptionEndDateAttribute()
{
    $subscription = $this->subscriptions()
        ->where('status', 'approved')
        ->whereDate('ends_at', '>=', now()) // ✅ تصحيح
        ->latest()
        ->first();
    
    return $subscription ? $subscription->ends_at : null; // ✅ تصحيح
}
// في User Model
public function workoutExercises()
{
    return $this->hasMany(WorkoutExercise::class);
}

public function nutritionItems()
{
    return $this->hasManyThrough(NutritionItem::class, NutritionPlan::class);
}

// في Subscription Model
public function user()
{
    return $this->belongsTo(User::class);
}
}