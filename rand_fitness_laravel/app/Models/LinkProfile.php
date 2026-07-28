<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LinkProfile extends Model
{
    protected $table = 'link_profiles';

    protected $fillable = [
        'name', 'bio', 'avatar', 'name_font', 'bio_font',
        'instagram', 'tiktok', 'youtube', 'twitter',
        'linkedin', 'facebook', 'github', 'twitch',
        'telegram', 'whatsapp', 'discord', 'snapchat',
        'pinterest', 'website', 'podcast',
    ];

    protected $hidden = ['created_at', 'updated_at'];
    
    protected $casts = [
        'instagram' => 'string',
        'tiktok' => 'string',
        'youtube' => 'string',
        'twitter' => 'string',
        'linkedin' => 'string',
        'facebook' => 'string',
        'github' => 'string',
        'twitch' => 'string',
        'telegram' => 'string',
        'whatsapp' => 'string',
        'discord' => 'string',
        'snapchat' => 'string',
        'pinterest' => 'string',
        'website' => 'string',
        'podcast' => 'string',
    ];
}