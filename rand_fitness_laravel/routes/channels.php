<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Conversation;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('chat.{conversationId}', function ($user, int $conversationId) {
    $conversation = Conversation::where('id', $conversationId)
        ->where(function ($query) use ($user) {
            $query->where('admin_id', $user->id)
                  ->orWhere('trainee_id', $user->id);
        })
        ->first();

    if (!$conversation) {
        return false;
    }

    return [
        'id' => $user->id,
        'name' => $user->name,
        'role' => $user->role,
    ];
});

Broadcast::channel('admin.chat.list', function ($user) {
    return $user->role === 'admin'
        ? [
            'id' => $user->id,
            'name' => $user->name,
            'role' => $user->role,
        ]
        : false;
});