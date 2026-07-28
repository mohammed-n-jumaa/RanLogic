<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdminChatListUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public array $conversation
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin.chat.list'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.admin.list.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'conversation' => $this->conversation,
        ];
    }
}