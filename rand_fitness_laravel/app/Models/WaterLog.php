<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaterLog extends Model
{
    protected $fillable = ['user_id', 'cups', 'goal', 'logged_at'];

    protected $casts = [
        'logged_at' => 'date',
        'cups'      => 'integer',
        'goal'      => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}