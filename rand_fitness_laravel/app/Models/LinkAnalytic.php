<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LinkAnalytic extends Model
{
    public $timestamps = false;

    protected $table = 'link_analytics';

    protected $fillable = [
        'link_id',
        'clicked_at',
        'ip_address',
        'user_agent',
        'referer',
    ];

    protected $casts = [
        'clicked_at' => 'datetime',
    ];

    public function link(): BelongsTo
    {
        return $this->belongsTo(LinkLink::class, 'link_id');
    }
}