<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NutritionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'nutrition_meal_id',
        'name',
        'calories',
        'protein',
        'carbs',
        'fats',
        'completed',
        'completed_at',
        'order',
    ];

    protected $casts = [
        'calories' => 'integer',
        'protein' => 'float',
        'carbs' => 'float',
        'fats' => 'float',
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function nutritionMeal(): BelongsTo
    {
        return $this->belongsTo(NutritionMeal::class);
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'completed' => true,
            'completed_at' => now(),
        ]);
    }

    public function markAsIncomplete(): void
    {
        $this->update([
            'completed' => false,
            'completed_at' => null,
        ]);
    }

    public function scopeCompleted($query)
    {
        return $query->where('completed', true);
    }

    public function scopeIncomplete($query)
    {
        return $query->where('completed', false);
    }
}