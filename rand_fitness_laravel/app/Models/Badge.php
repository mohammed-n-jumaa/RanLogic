<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = ['key', 'name_ar', 'name_en', 'icon'];

    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('earned_at');
    }
}