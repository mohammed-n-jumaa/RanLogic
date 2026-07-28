<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $conversationId,
        public array $message,
        public array $conversation
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.{$this->conversationId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'message' => $this->message,
            'conversation' => $this->conversation,
        ];
    }
}