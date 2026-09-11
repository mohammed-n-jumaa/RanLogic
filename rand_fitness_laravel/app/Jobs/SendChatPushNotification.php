<?php

namespace App\Jobs;

use App\Models\Conversation;
use App\Models\Message;
use App\Services\ChatService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SendChatPushNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 30;

    public function __construct(
        public int $conversationId,
        public int $messageId,
        public string $senderType
    ) {}

    public function handle(ChatService $chatService): void
    {
        $conversation = Conversation::find($this->conversationId);
        $message = Message::find($this->messageId);

        if (!$conversation || !$message) {
            Log::warning('SendChatPushNotification: conversation or message no longer exists', [
                'conversation_id' => $this->conversationId,
                'message_id' => $this->messageId,
            ]);
            return;
        }

        $chatService->dispatchPushNotification($conversation, $message, $this->senderType);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('SendChatPushNotification job failed: ' . $exception->getMessage(), [
            'conversation_id' => $this->conversationId,
            'message_id' => $this->messageId,
        ]);
    }
}