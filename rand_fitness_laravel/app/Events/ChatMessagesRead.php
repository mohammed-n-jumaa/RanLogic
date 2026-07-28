<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatMessagesRead implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $conversationId,
        public string $readerRole,
        public array $messageIds,
        public string $readAt
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("chat.{$this->conversationId}"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'chat.messages.read';
    }

    public function broadcastWith(): array
    {
        return [
            'conversation_id' => $this->conversationId,
            'reader_role' => $this->readerRole,
            'message_ids' => $this->messageIds,
            'read_at' => $this->readAt,
        ];
    }
}