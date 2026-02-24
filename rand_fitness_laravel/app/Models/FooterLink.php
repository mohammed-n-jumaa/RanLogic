<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FooterLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'footer_id',
        'text_en',
        'text_ar',
        'url',
        'type',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function footer()
    {
        return $this->belongsTo(Footer::class);
    }

    public function getTextAttribute()
    {
        return app()->getLocale() === 'ar' 
            ? ($this->text_ar ?? $this->text_en)
            : ($this->text_en ?? $this->text_ar);
    }
}