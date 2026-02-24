<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserQuestion extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'user_questions';

    protected $fillable = [
        'name',
        'email',
        'question',
        'is_read',
        'read_by',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    /**
     * Get the admin who read this question
     */
    public function reader()
    {
        return $this->belongsTo(User::class, 'read_by');
    }

    /**
     * Scope unread questions
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope read questions
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Scope recent questions
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Mark as read
     */
    public function markAsRead($userId)
    {
        $this->update([
            'is_read' => true,
            'read_by' => $userId,
            'read_at' => now(),
        ]);
    }

    /**
     * Mark as unread
     */
    public function markAsUnread()
    {
        $this->update([
            'is_read' => false,
            'read_by' => null,
            'read_at' => null,
        ]);
    }
}