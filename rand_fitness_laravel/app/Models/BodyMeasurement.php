<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BodyMeasurement extends Model
{
    protected $fillable = ['user_id', 'waist', 'hips', 'arm', 'thigh', 'chest', 'measured_at'];

    protected $casts = [
        'measured_at' => 'date',
        'waist'       => 'decimal:2',
        'hips'        => 'decimal:2',
        'arm'         => 'decimal:2',
        'thigh'       => 'decimal:2',
        'chest'       => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}