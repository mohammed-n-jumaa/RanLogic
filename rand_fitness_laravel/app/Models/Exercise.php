<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Exercise extends Model
{
    use HasFactory;

    protected $fillable = [
        'workout_day_id',
        'name',
        'sets',
        'reps',
        'notes',
        'video_type',
        'video_url',
        'video_path',
        'image_path',
        'is_completed',
        'completed_at',
        'order',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'completed_at' => 'datetime',
        'sets' => 'integer',
        'reps' => 'integer',
        'order' => 'integer',
    ];

    /**
     * Get the workout day that owns this exercise
     */
    public function workoutDay(): BelongsTo
    {
        return $this->belongsTo(WorkoutDay::class);
    }

    /**
     * Mark exercise as completed
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'is_completed' => true,
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark exercise as not completed
     */
    public function markAsNotCompleted(): void
    {
        $this->update([
            'is_completed' => false,
            'completed_at' => null,
        ]);
    }

    /**
     * Get video URL (either YouTube or uploaded file)
     */
    public function getVideoUrlAttribute($value): ?string
    {
        if ($this->video_type === 'youtube') {
            return $this->attributes['video_url'];
        } elseif ($this->video_type === 'upload' && $this->video_path) {
            return Storage::url($this->video_path);
        }
        return null;
    }

    /**
     * Get image URL
     */
    public function getImageUrlAttribute(): ?string
    {
        if ($this->image_path) {
            return Storage::url($this->image_path);
        }
        return null;
    }

    /**
     * Scope: Completed exercises
     */
    public function scopeCompleted($query)
    {
        return $query->where('is_completed', true);
    }

    /**
     * Scope: Pending exercises
     */
    public function scopePending($query)
    {
        return $query->where('is_completed', false);
    }

    /**
     * Scope: Order by order field
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    /**
     * Delete associated media files when exercise is deleted
     */
    protected static function booted()
    {
        static::deleting(function ($exercise) {
            if ($exercise->video_path) {
                Storage::delete($exercise->video_path);
            }
            if ($exercise->image_path) {
                Storage::delete($exercise->image_path);
            }
        });
    }
}