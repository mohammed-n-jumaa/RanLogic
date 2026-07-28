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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            
            // المحادثة
            $table->foreignId('conversation_id')
                ->constrained('conversations')
                ->onDelete('cascade');
            
            // المرسل
            $table->foreignId('sender_id')
                ->constrained('users')
                ->onDelete('cascade');
            
            // نوع المرسل
            $table->enum('sender_type', ['admin', 'trainee']);
            
            // نوع الرسالة
            $table->enum('message_type', ['text', 'image', 'video', 'file', 'pdf', 'doc'])
                ->default('text');
            
            // محتوى الرسالة النصية
            $table->text('content')->nullable();
            
            // معلومات الملف
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->string('file_type')->nullable();
            $table->bigInteger('file_size')->nullable(); // بالبايت
            $table->string('file_mime_type')->nullable();
            
            // معلومات إضافية للصور والفيديو
            $table->integer('media_width')->nullable();
            $table->integer('media_height')->nullable();
            $table->integer('media_duration')->nullable(); // للفيديو بالثواني
            $table->string('thumbnail_path')->nullable(); // صورة مصغرة للفيديو
            
            // حالة القراءة
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            
            // حالة التسليم
            $table->enum('status', ['sending', 'sent', 'delivered', 'read', 'failed'])
                ->default('sent');
            
            // Soft delete
            $table->softDeletes();
            $table->timestamps();
            
            // Indexes
            $table->index(['conversation_id', 'created_at']);
            $table->index(['sender_id', 'sender_type']);
            $table->index(['is_read', 'conversation_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};