<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NutritionPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'month_start_date',
        'month_end_date',
        'pdf_file',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'month_start_date' => 'date',
        'month_end_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function meals(): HasMany
    {
        return $this->hasMany(NutritionMeal::class)->orderBy('meal_date')->orderBy('order');
    }

    public function mealsForDate(string $date): HasMany
    {
        return $this->hasMany(NutritionMeal::class)->where('meal_date', $date)->orderBy('order');
    }

    public function getTotalCaloriesAttribute(): int
    {
        return $this->meals->sum(function ($meal) {
            return $meal->items->sum('calories');
        });
    }

    public function getCompletionPercentageAttribute(): int
    {
        $totalItems = $this->meals->sum(function ($meal) {
            return $meal->items->count();
        });

        if ($totalItems === 0) {
            return 0;
        }

        $completedItems = $this->meals->sum(function ($meal) {
            return $meal->items->where('completed', true)->count();
        });

        return round(($completedItems / $totalItems) * 100);
    }

    public function scopeForMonth($query, int $year, int $month)
    {
        $startDate = sprintf('%04d-%02d-01', $year, $month);
        return $query->where('month_start_date', $startDate);
    }

    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }
}