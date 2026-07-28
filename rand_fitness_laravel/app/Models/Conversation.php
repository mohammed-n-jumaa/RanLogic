<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'admin_id',
        'trainee_id',
        'last_message',
        'last_message_at',
        'last_message_sender',
        'admin_unread_count',
        'trainee_unread_count',
        'status',
        'is_archived',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
        'admin_unread_count' => 'integer',
        'trainee_unread_count' => 'integer',
        'is_archived'          => 'boolean',
    ];

    /**
     * العلاقة مع المدرب (Admin)
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * العلاقة مع المتدرب (Trainee)
     */
    public function trainee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'trainee_id');
    }

    /**
     * العلاقة مع الرسائل
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'asc');
    }

    /**
     * العلاقة مع الإشعارات
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(ChatNotification::class);
    }

    /**
     * الحصول على آخر رسالة
     */
    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * تحديث آخر رسالة
     */
    public function updateLastMessage(Message $message): void
    {
        $this->update([
            'last_message' => $message->message_type === 'text' 
                ? $message->content 
                : $this->getFileTypeLabel($message->message_type),
            'last_message_at' => $message->created_at,
            'last_message_sender' => $message->sender_type,
        ]);
    }

    /**
     * الحصول على تسمية نوع الملف
     */
    private function getFileTypeLabel(string $type): string
    {
        return match($type) {
            'image' => '📷 صورة',
            'video' => '🎥 فيديو',
            'pdf' => '📄 ملف PDF',
            'doc' => '📝 مستند',
            'file' => '📎 ملف',
            default => '📎 مرفق',
        };
    }

    /**
     * زيادة عداد الرسائل غير المقروءة للمدرب
     */
    public function incrementAdminUnread(): void
    {
        $this->increment('admin_unread_count');
    }

    /**
     * زيادة عداد الرسائل غير المقروءة للمتدرب
     */
    public function incrementTraineeUnread(): void
    {
        $this->increment('trainee_unread_count');
    }

    /**
     * تصفير عداد الرسائل غير المقروءة للمدرب
     */
    public function resetAdminUnread(): void
    {
        $this->update(['admin_unread_count' => 0]);
    }

    /**
     * تصفير عداد الرسائل غير المقروءة للمتدرب
     */
    public function resetTraineeUnread(): void
    {
        $this->update(['trainee_unread_count' => 0]);
    }

    /**
     * Scope للمحادثات النشطة
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope للمحادثات التي تحتوي على رسائل غير مقروءة للمدرب
     */
    public function scopeWithUnreadForAdmin($query)
    {
        return $query->where('admin_unread_count', '>', 0);
    }

    /**
     * البحث عن محادثة أو إنشاء واحدة جديدة
     */
    public static function findOrCreateForUsers(int $adminId, int $traineeId): self
    {
        return self::firstOrCreate(
            [
                'admin_id' => $adminId,
                'trainee_id' => $traineeId,
            ],
            [
                'status' => 'active',
            ]
        );
    }

     public function getTypeAttribute()
    {
        return $this->message_type; // text / image
    }

    // علشان الفرونت اللي يستخدم message.file_url
    public function getFileUrlAttribute()
    {
        if (!$this->file_path) return null;

        // disk public => /storage/...
        $url = Storage::disk('public')->url($this->file_path);

        // يطلع مثل: http://localhost:8000/storage/chat/images/xxx.jpg
        return asset($url);
    }
}