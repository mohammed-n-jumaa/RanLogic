<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'conversation_id',
        'message_id',
        'type',
        'title',
        'body',
        'data',
        'is_read',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * العلاقة مع المستخدم
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * العلاقة مع المحادثة
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * العلاقة مع الرسالة
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }

    /**
     * تحديد الإشعار كمقروء
     */
    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
    }

    /**
     * Scope للإشعارات غير المقروءة
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope للإشعارات المقروءة
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * إنشاء إشعار رسالة جديدة
     */
    public static function createNewMessageNotification(
        int $userId,
        Conversation $conversation,
        Message $message,
        string $senderName
    ): self {
        $body = $message->message_type === 'text'
            ? mb_substr($message->content, 0, 100) . (mb_strlen($message->content) > 100 ? '...' : '')
            : self::getFileTypeLabel($message->message_type);

        return self::create([
            'user_id' => $userId,
            'conversation_id' => $conversation->id,
            'message_id' => $message->id,
            'type' => $message->message_type === 'text' ? 'new_message' : 'file_received',
            'title' => "رسالة جديدة من {$senderName}",
            'body' => $body,
            'data' => [
                'sender_id' => $message->sender_id,
                'sender_name' => $senderName,
                'message_type' => $message->message_type,
                'trainee_id' => $conversation->trainee_id,
            ],
        ]);
    }

    /**
     * الحصول على تسمية نوع الملف
     */
    private static function getFileTypeLabel(string $type): string
    {
        return match($type) {
            'image' => '📷 أرسل صورة',
            'video' => '🎥 أرسل فيديو',
            'pdf' => '📄 أرسل ملف PDF',
            'doc' => '📝 أرسل مستند',
            'file' => '📎 أرسل ملف',
            default => '📎 أرسل مرفق',
        };
    }
}