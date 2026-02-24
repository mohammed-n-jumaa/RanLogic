<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkoutExercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_plan_id',
        'exercise_date',
        'name',
        'sets',
        'reps',
        'notes',
        'youtube_url',
        'video_file',
        'completed',
        'completed_at',
        'order',
    ];

    protected $casts = [
        'exercise_date' => 'date',
        'sets' => 'integer',
        'reps' => 'integer',
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    public function workoutPlan(): BelongsTo
    {
        return $this->belongsTo(WorkoutPlan::class);
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

    public function scopeForDate($query, string $date)
    {
        return $query->where('exercise_date', $date);
    }

    public function user()
{
    return $this->belongsTo(User::class);
}
}