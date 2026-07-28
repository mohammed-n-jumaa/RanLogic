<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    protected $fillable = ['name_ar', 'name_en', 'icon', 'color', 'duration_days', 'is_active'];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('started_at', 'completed_days', 'is_completed')
            ->withTimestamps();
    }
}