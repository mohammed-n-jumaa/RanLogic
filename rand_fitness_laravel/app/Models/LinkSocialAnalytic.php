<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LinkSocialAnalytic extends Model
{
    public $timestamps = false;

    protected $table = 'link_social_analytics';

    protected $fillable = [
        'platform',
        'clicked_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'clicked_at' => 'datetime',
    ];
}