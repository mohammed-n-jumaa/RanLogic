<?php

namespace App\Models;

use App\Models\LinkAnalytic;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LinkLink extends Model
{
    protected $table = 'link_links';

    protected $fillable = [
        'title',
        'url',
        'icon',
        'active',
        'order',
        'clicks',
        'title_font',
    ];

    protected $casts = [
        'active' => 'boolean',
        'order'  => 'integer',
        'clicks' => 'integer',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function incrementClicks(): void
    {
        $this->increment('clicks');
    }

    public function analytics(): HasMany
{
    return $this->hasMany(LinkAnalytic::class, 'link_id');
}
}