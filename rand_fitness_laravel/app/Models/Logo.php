<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Logo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'width',
        'height',
        'is_active',
        'uploaded_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'file_size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $hidden = [
        'uploaded_by',
        'deleted_at',
    ];

    protected $appends = [
        'full_url',
        'file_size_formatted',
    ];

    /**
     * Get the full URL of the logo.
     * 
     * حل للـ Windows/WAMP - يبحث في public/logos أولاً
     * ثم يستخدم storage URL كـ fallback
     */
    public function getFullUrlAttribute(): string
    {
        $filename = basename($this->file_path);
        
        // Try public/logos first (للـ Windows/WAMP)
        $publicPath = public_path('logos/' . $filename);
        if (file_exists($publicPath)) {
            return asset('logos/' . $filename);
        }
        
        // Fallback to storage URL
        return Storage::url($this->file_path);
    }

    /**
     * Get the formatted file size.
     */
    public function getFileSizeFormattedAttribute(): string
    {
        $size = $this->file_size;
        
        if ($size < 1024) {
            return $size . ' B';
        } elseif ($size < 1024 * 1024) {
            return round($size / 1024, 2) . ' KB';
        } else {
            return round($size / (1024 * 1024), 2) . ' MB';
        }
    }

    /**
     * Scope a query to only include active logos.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include inactive logos.
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope to get the latest logo.
     */
    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Delete the logo file from storage when model is deleted.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($logo) {
            // Delete from storage
            if (Storage::exists($logo->file_path)) {
                Storage::delete($logo->file_path);
            }
            
            // Delete from public
            $publicPath = public_path('logos/' . basename($logo->file_path));
            if (file_exists($publicPath)) {
                unlink($publicPath);
            }
        });
    }
}