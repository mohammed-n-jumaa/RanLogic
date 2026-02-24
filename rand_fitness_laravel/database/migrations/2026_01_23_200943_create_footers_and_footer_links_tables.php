<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('logo_id')->nullable()->constrained('logos')->onDelete('set null');
            
            // Content
            $table->text('description_en')->nullable();
            $table->text('description_ar')->nullable();
            $table->string('copyright_en')->nullable();
            $table->string('copyright_ar')->nullable();
            $table->string('quick_links_title_en')->default('Quick Links');
            $table->string('quick_links_title_ar')->default('روابط سريعة');
            
            // Contact
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address_en')->nullable();
            $table->text('address_ar')->nullable();
            
            // Social Media (JSON format)
            $table->json('social_links')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('footer_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('footer_id')->constrained()->onDelete('cascade');
            $table->string('text_en');
            $table->string('text_ar');
            $table->string('url');
            $table->enum('type', ['quick_link', 'legal_link'])->default('quick_link');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('footer_links');
        Schema::dropIfExists('footers');
    }
};