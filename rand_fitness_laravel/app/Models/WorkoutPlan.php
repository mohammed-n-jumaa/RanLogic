<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkoutPlan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'month_start_date',
        'month_end_date',
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

    public function exercises(): HasMany
    {
        return $this->hasMany(WorkoutExercise::class)->orderBy('exercise_date')->orderBy('order');
    }

    public function exercisesForDate(string $date): HasMany
    {
        return $this->hasMany(WorkoutExercise::class)->where('exercise_date', $date)->orderBy('order');
    }

    public function getTotalExercisesAttribute(): int
    {
        return $this->exercises->count();
    }

    public function getCompletedExercisesAttribute(): int
    {
        return $this->exercises->where('completed', true)->count();
    }

    public function getCompletionPercentageAttribute(): int
    {
        $total = $this->total_exercises;
        if ($total === 0) {
            return 0;
        }
        return round(($this->completed_exercises / $total) * 100);
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