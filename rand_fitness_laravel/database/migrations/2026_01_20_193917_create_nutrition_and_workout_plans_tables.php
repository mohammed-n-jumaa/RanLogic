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
        // Nutrition Plans (Monthly)
        Schema::create('nutrition_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('month_start_date'); // Start date of the month
            $table->date('month_end_date');   // End date of the month
            $table->string('pdf_file')->nullable(); // Monthly PDF file
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'month_start_date']);
        });
        
        // Nutrition Meals (Daily meals within a plan)
        Schema::create('nutrition_meals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nutrition_plan_id')->constrained('nutrition_plans')->onDelete('cascade');
            $table->date('meal_date'); // Specific date within the month
            $table->string('meal_type'); // الإفطار، الغداء، العشاء، سناك
            $table->time('meal_time')->nullable();
            $table->string('meal_image')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->index(['nutrition_plan_id', 'meal_date']);
        });
        
        // Nutrition Items (Individual food items in a meal)
        Schema::create('nutrition_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nutrition_meal_id')->constrained('nutrition_meals')->onDelete('cascade');
            $table->string('name');
            $table->integer('calories')->default(0);
            $table->decimal('protein', 8, 2)->default(0);
            $table->decimal('carbs', 8, 2)->default(0);
            $table->decimal('fats', 8, 2)->default(0);
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
        
        // Workout Plans (Monthly)
        Schema::create('workout_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->date('month_start_date'); // Start date of the month
            $table->date('month_end_date');   // End date of the month
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('updated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['user_id', 'month_start_date']);
        });
        
        // Workout Exercises (Daily exercises within a plan)
        Schema::create('workout_exercises', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workout_plan_id')->constrained('workout_plans')->onDelete('cascade');
            $table->date('exercise_date'); // Specific date within the month
            $table->string('name');
            $table->integer('sets')->default(3);
            $table->integer('reps')->default(12);
            $table->text('notes')->nullable();
            $table->string('youtube_url')->nullable(); // YouTube link
            $table->string('video_file')->nullable();  // Uploaded video
            $table->boolean('completed')->default(false);
            $table->timestamp('completed_at')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->index(['workout_plan_id', 'exercise_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workout_exercises');
        Schema::dropIfExists('workout_plans');
        Schema::dropIfExists('nutrition_items');
        Schema::dropIfExists('nutrition_meals');
        Schema::dropIfExists('nutrition_plans');
    }
};