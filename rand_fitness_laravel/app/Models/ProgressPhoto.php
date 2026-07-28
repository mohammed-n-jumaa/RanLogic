<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressPhoto extends Model
{
   protected $fillable = ['user_id', 'photo_path', 'weight_at_photo', 'note', 'marketing_consent', 'taken_at'];

    protected $casts = [
        'taken_at'        => 'date',
        'weight_at_photo' => 'decimal:2',
    ];

    protected $appends = ['photo_url'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getPhotoUrlAttribute()
    {
        return $this->photo_path ? asset('storage/' . $this->photo_path) : null;
    }
}