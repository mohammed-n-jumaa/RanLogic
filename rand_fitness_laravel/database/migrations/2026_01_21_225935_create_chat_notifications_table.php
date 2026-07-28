<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chat_notifications', function (Blueprint $table) {
            $table->id();
            
            // المستخدم المستلم للإشعار
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');
            
            // المحادثة المرتبطة
            $table->foreignId('conversation_id')
                ->constrained('conversations')
                ->onDelete('cascade');
            
            // الرسالة المرتبطة
            $table->foreignId('message_id')
                ->nullable()
                ->constrained('messages')
                ->onDelete('cascade');
            
            // نوع الإشعار
            $table->enum('type', ['new_message', 'file_received', 'message_read'])
                ->default('new_message');
            
            // العنوان والمحتوى
            $table->string('title');
            $table->text('body')->nullable();
            
            // معلومات إضافية
            $table->json('data')->nullable();
            
            // حالة القراءة
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index(['user_id', 'is_read', 'created_at']);
            $table->index(['conversation_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_notifications');
    }
};