<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NutritionMeal extends Model
{
    use HasFactory;

    protected $fillable = [
        'nutrition_plan_id',
        'meal_date',
        'meal_type',
        'meal_time',
        'meal_image',
        'order',
    ];

    protected $casts = [
        'meal_date' => 'date',
        'meal_time' => 'datetime:H:i',
    ];

    public function nutritionPlan(): BelongsTo
    {
        return $this->belongsTo(NutritionPlan::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(NutritionItem::class)->orderBy('order');
    }

    public function getTotalCaloriesAttribute(): int
    {
        return $this->items->sum('calories');
    }

    public function getTotalProteinAttribute(): float
    {
        return $this->items->sum('protein');
    }

    public function getTotalCarbsAttribute(): float
    {
        return $this->items->sum('carbs');
    }

    public function getTotalFatsAttribute(): float
    {
        return $this->items->sum('fats');
    }

    public function getCompletionPercentageAttribute(): int
    {
        $total = $this->items->count();
        if ($total === 0) {
            return 0;
        }
        $completed = $this->items->where('completed', true)->count();
        return round(($completed / $total) * 100);
    }
}