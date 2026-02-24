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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            
            // المدرب (Admin)
            $table->foreignId('admin_id')
                ->constrained('users')
                ->onDelete('cascade');
            
            // المتدرب (Trainee)
            $table->foreignId('trainee_id')
                ->constrained('users')
                ->onDelete('cascade');
            
            // آخر رسالة (للعرض السريع)
            $table->text('last_message')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->enum('last_message_sender', ['admin', 'trainee'])->nullable();
            
            // عدد الرسائل غير المقروءة للمدرب
            $table->integer('admin_unread_count')->default(0);
            
            // عدد الرسائل غير المقروءة للمتدرب
            $table->integer('trainee_unread_count')->default(0);
            
            // حالة المحادثة
            $table->enum('status', ['active', 'archived', 'blocked'])->default('active');
            
            // Soft delete
            $table->softDeletes();
            $table->timestamps();
            
            // Indexes
            $table->unique(['admin_id', 'trainee_id']);
            $table->index(['admin_id', 'last_message_at']);
            $table->index(['trainee_id', 'last_message_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};