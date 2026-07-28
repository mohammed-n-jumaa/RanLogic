<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('plan_type', ['basic', 'nutrition', 'elite', 'vip']);
            $table->enum('duration', ['1month', '3months', '6months']);
            $table->decimal('amount', 10, 2);
            $table->decimal('original_amount', 10, 2)->nullable();
            $table->integer('discount_percentage')->default(0);
            $table->enum('payment_method', ['paypal', 'bank_transfer']);
            $table->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $table->string('paypal_order_id')->nullable();
            $table->string('paypal_payer_id')->nullable();
            $table->string('bank_transfer_number')->nullable();
            $table->string('bank_receipt_path')->nullable();
            $table->string('currency')->default('USD');
            $table->text('notes')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'status']);
            $table->index(['plan_type', 'duration']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};