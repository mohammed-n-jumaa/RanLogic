<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'sender_type',
        'message_type',
        'content',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'file_mime_type',
        'media_width',
        'media_height',
        'media_duration',
        'thumbnail_path',
        'is_read',
        'read_at',
        'status',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'file_size' => 'integer',
        'media_width' => 'integer',
        'media_height' => 'integer',
        'media_duration' => 'integer',
    ];

    protected $appends = ['file_url', 'thumbnail_url', 'formatted_file_size'];

    /**
     * العلاقة مع المحادثة
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * العلاقة مع المرسل
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * الحصول على رابط الملف
     */
    public function getFileUrlAttribute(): ?string
    {
        if (!$this->file_path) {
            return null;
        }
        return Storage::disk('public')->url($this->file_path);
    }

    /**
     * الحصول على رابط الصورة المصغرة
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail_path) {
            return null;
        }
        return Storage::disk('public')->url($this->thumbnail_path);
    }

    /**
     * الحصول على حجم الملف بصيغة مقروءة
     */
    public function getFormattedFileSizeAttribute(): ?string
    {
        if (!$this->file_size) {
            return null;
        }

        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * تحديد الرسالة كمقروءة
     */
    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
                'status' => 'read',
            ]);
        }
    }

    /**
     * هل الرسالة تحتوي على ملف
     */
    public function hasFile(): bool
    {
        return $this->message_type !== 'text' && $this->file_path;
    }

    /**
     * هل الرسالة صورة
     */
    public function isImage(): bool
    {
        return $this->message_type === 'image';
    }

    /**
     * هل الرسالة فيديو
     */
    public function isVideo(): bool
    {
        return $this->message_type === 'video';
    }

    /**
     * هل الرسالة PDF
     */
    public function isPdf(): bool
    {
        return $this->message_type === 'pdf';
    }

    /**
     * هل الرسالة مستند
     */
    public function isDocument(): bool
    {
        return in_array($this->message_type, ['doc', 'file']);
    }

    /**
     * حذف الملفات المرتبطة
     */
    public function deleteFiles(): void
    {
        if ($this->file_path && Storage::disk('public')->exists($this->file_path)) {
            Storage::disk('public')->delete($this->file_path);
        }
        
        if ($this->thumbnail_path && Storage::disk('public')->exists($this->thumbnail_path)) {
            Storage::disk('public')->delete($this->thumbnail_path);
        }
    }

    /**
     * Scope للرسائل غير المقروءة
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope للرسائل النصية
     */
    public function scopeText($query)
    {
        return $query->where('message_type', 'text');
    }

    /**
     * Scope للرسائل التي تحتوي على ملفات
     */
    public function scopeWithFiles($query)
    {
        return $query->where('message_type', '!=', 'text');
    }

    /**
     * الحصول على أيقونة نوع الملف
     */
    public function getFileIcon(): string
    {
        return match($this->message_type) {
            'image' => '🖼️',
            'video' => '🎬',
            'pdf' => '📄',
            'doc' => '📝',
            default => '📎',
        };
    }

    /**
     * حدث الحذف - حذف الملفات
     */
    protected static function booted(): void
    {
        static::forceDeleting(function (Message $message) {
            $message->deleteFiles();
        });
    }
}