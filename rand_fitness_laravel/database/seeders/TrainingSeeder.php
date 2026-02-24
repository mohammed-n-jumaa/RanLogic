<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\WorkoutPlan;
use App\Models\WorkoutDay;
use App\Models\Exercise;
use App\Models\NutritionPlan;
use App\Models\NutritionDay;
use App\Models\Meal;
use App\Models\MealItem;
use Carbon\Carbon;

class TrainingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample clients (users with role = 'user')
        $clients = $this->createSampleClients();
        
        // Create workout and nutrition plans for first client
        $this->createWorkoutPlan($clients[0]);
        $this->createNutritionPlan($clients[0]);
        
        $this->command->info('✅ Training system seeded successfully!');
    }

    /**
     * Create sample clients
     */
    private function createSampleClients(): array
    {
        $clients = [];

        // Client 1 - Sara Ahmed (Active)
        $clients[] = User::create([
            'name' => 'سارة أحمد',
            'email' => 'sara@example.com',
            'password' => bcrypt('password'),
            'phone' => '0791234567',
            'age' => 28,
            'height' => 165,
            'weight' => 65,
            'waist' => 75,
            'hips' => 95,
            'gender' => 'female',
            'goal' => 'weight-loss',
            'workout_place' => 'home',
            'program' => 'برنامج إنقاص الوزن المنزلي',
            'health_notes' => 'لا توجد ملاحظات صحية',
            'role' => 'user',
            'is_active' => true,
            'has_active_subscription' => true,
            'subscription_start_date' => Carbon::now()->subDays(10),
            'subscription_end_date' => Carbon::now()->addMonths(3),
        ]);

        // Client 2 - Layla Mahmoud (Active)
        $clients[] = User::create([
            'name' => 'ليلى محمود',
            'email' => 'layla@example.com',
            'password' => bcrypt('password'),
            'phone' => '0797654321',
            'age' => 32,
            'height' => 168,
            'weight' => 58,
            'waist' => 68,
            'hips' => 90,
            'gender' => 'female',
            'goal' => 'muscle-gain',
            'workout_place' => 'gym',
            'program' => 'برنامج بناء العضلات',
            'health_notes' => null,
            'role' => 'user',
            'is_active' => true,
            'has_active_subscription' => true,
            'subscription_start_date' => Carbon::now()->subMonths(1),
            'subscription_end_date' => Carbon::now()->addMonths(2),
        ]);

        // Client 3 - Noor Aldin (Expired)
        $clients[] = User::create([
            'name' => 'نور الدين',
            'email' => 'noor@example.com',
            'password' => bcrypt('password'),
            'phone' => '0799876543',
            'age' => 25,
            'height' => 178,
            'weight' => 80,
            'waist' => 85,
            'hips' => null,
            'gender' => 'male',
            'goal' => 'toning',
            'workout_place' => 'gym',
            'program' => 'برنامج التنشيف',
            'health_notes' => 'ألم في الركبة اليمنى',
            'role' => 'user',
            'is_active' => true,
            'has_active_subscription' => false,
            'subscription_start_date' => Carbon::now()->subMonths(3),
            'subscription_end_date' => Carbon::now()->subDays(5),
        ]);

        // Client 4 - Mariam Salem (Pending)
        $clients[] = User::create([
            'name' => 'مريم سالم',
            'email' => 'mariam@example.com',
            'password' => bcrypt('password'),
            'phone' => '0795555555',
            'age' => 30,
            'height' => 162,
            'weight' => 68,
            'waist' => 78,
            'hips' => 98,
            'gender' => 'female',
            'goal' => 'fitness',
            'workout_place' => 'home',
            'program' => 'برنامج اللياقة العامة',
            'health_notes' => 'حساسية من الفول السوداني',
            'role' => 'user',
            'is_active' => true,
            'has_active_subscription' => false,
            'subscription_start_date' => null,
            'subscription_end_date' => null,
        ]);

        return $clients;
    }

    /**
     * Create workout plan for client
     */
    private function createWorkoutPlan(User $client): void
    {
        $admin = User::where('role', 'admin')->first();
        
        // Create workout plan for current month
        $plan = WorkoutPlan::create([
            'user_id' => $client->id,
            'month' => Carbon::now()->format('Y-m'),
            'description' => 'برنامج تدريبي مكثف لإنقاص الوزن - 4 أسابيع',
            'is_active' => true,
            'created_by' => $admin?->id,
        ]);

        // Create workout days for one week
        $this->createWorkoutDays($plan);
    }

    /**
     * Create workout days with exercises
     */
    private function createWorkoutDays(WorkoutPlan $plan): void
    {
        $startDate = Carbon::now()->startOfMonth();
        
        $daysData = [
            [
                'day_name' => 'السبت',
                'exercises' => [
                    ['name' => 'سكوات', 'sets' => 3, 'reps' => 12, 'notes' => 'ركز على النزول الكامل والحفاظ على استقامة الظهر', 'video_type' => 'youtube', 'video_url' => 'https://www.youtube.com/watch?v=aclHkVaku9U'],
                    ['name' => 'ضغط صدر', 'sets' => 3, 'reps' => 10, 'notes' => 'استخدمي أوزان متوسطة'],
                    ['name' => 'تمديد ظهر', 'sets' => 3, 'reps' => 15, 'notes' => ''],
                ],
            ],
            [
                'day_name' => 'الأحد',
                'exercises' => [
                    ['name' => 'رفع أثقال', 'sets' => 4, 'reps' => 10, 'notes' => 'ركزي على التحكم بالحركة'],
                    ['name' => 'بلانك', 'sets' => 3, 'reps' => 30, 'notes' => 'احتفظي بالوضعية 30 ثانية'],
                ],
            ],
            [
                'day_name' => 'الإثنين',
                'exercises' => [
                    ['name' => 'كارديو', 'sets' => 1, 'reps' => 20, 'notes' => '20 دقيقة جري أو مشي سريع', 'video_type' => 'youtube', 'video_url' => 'https://www.youtube.com/watch?v=ml6cT4AZdqI'],
                ],
            ],
            [
                'day_name' => 'الثلاثاء',
                'exercises' => [], // Rest day
            ],
            [
                'day_name' => 'الأربعاء',
                'exercises' => [
                    ['name' => 'تمارين البطن', 'sets' => 4, 'reps' => 15, 'notes' => 'كرانش متنوع'],
                    ['name' => 'لونجز', 'sets' => 3, 'reps' => 12, 'notes' => 'بديل لكل ساق'],
                ],
            ],
            [
                'day_name' => 'الخميس',
                'exercises' => [], // Rest day
            ],
            [
                'day_name' => 'الجمعة',
                'exercises' => [], // Rest day
            ],
        ];

        foreach ($daysData as $index => $dayData) {
            $day = WorkoutDay::create([
                'workout_plan_id' => $plan->id,
                'date' => $startDate->copy()->addDays($index),
                'day_name' => $dayData['day_name'],
                'notes' => null,
            ]);

            foreach ($dayData['exercises'] as $exerciseIndex => $exerciseData) {
                Exercise::create([
                    'workout_day_id' => $day->id,
                    'name' => $exerciseData['name'],
                    'sets' => $exerciseData['sets'],
                    'reps' => $exerciseData['reps'],
                    'notes' => $exerciseData['notes'],
                    'video_type' => $exerciseData['video_type'] ?? null,
                    'video_url' => $exerciseData['video_url'] ?? null,
                    'is_completed' => $index < 2 && $exerciseIndex < 2, // Mark some as completed
                    'completed_at' => $index < 2 && $exerciseIndex < 2 ? now() : null,
                    'order' => $exerciseIndex,
                ]);
            }
        }
    }

    /**
     * Create nutrition plan for client
     */
    private function createNutritionPlan(User $client): void
    {
        $admin = User::where('role', 'admin')->first();
        
        // Create nutrition plan for current month
        $plan = NutritionPlan::create([
            'user_id' => $client->id,
            'month' => Carbon::now()->format('Y-m'),
            'description' => 'نظام غذائي متوازن لإنقاص الوزن - 1500 سعرة حرارية يومياً',
            'is_active' => true,
            'created_by' => $admin?->id,
        ]);

        // Create nutrition days for one week
        $this->createNutritionDays($plan);
    }

    /**
     * Create nutrition days with meals
     */
    private function createNutritionDays(NutritionPlan $plan): void
    {
        $startDate = Carbon::now()->startOfMonth();
        
        $daysData = [
            [
                'day_name' => 'السبت',
                'meals' => [
                    [
                        'meal_type' => 'الإفطار',
                        'meal_time' => '08:00',
                        'items' => [
                            ['name' => 'شوفان مع حليب', 'calories' => 250, 'protein' => 10, 'carbs' => 40, 'fats' => 5],
                            ['name' => 'موز', 'calories' => 90, 'protein' => 1, 'carbs' => 23, 'fats' => 0],
                            ['name' => 'بيض مسلوق', 'calories' => 150, 'protein' => 13, 'carbs' => 1, 'fats' => 10],
                        ],
                    ],
                    [
                        'meal_type' => 'الغداء',
                        'meal_time' => '13:00',
                        'items' => [
                            ['name' => 'دجاج مشوي', 'calories' => 300, 'protein' => 40, 'carbs' => 0, 'fats' => 15],
                            ['name' => 'أرز بني', 'calories' => 200, 'protein' => 4, 'carbs' => 45, 'fats' => 2],
                            ['name' => 'سلطة خضراء', 'calories' => 50, 'protein' => 2, 'carbs' => 10, 'fats' => 1],
                        ],
                    ],
                    [
                        'meal_type' => 'العشاء',
                        'meal_time' => '19:00',
                        'items' => [
                            ['name' => 'سمك مشوي', 'calories' => 250, 'protein' => 35, 'carbs' => 0, 'fats' => 12],
                            ['name' => 'خضار مطبوخة', 'calories' => 100, 'protein' => 3, 'carbs' => 20, 'fats' => 2],
                        ],
                    ],
                    [
                        'meal_type' => 'سناك',
                        'meal_time' => '16:00',
                        'items' => [
                            ['name' => 'مكسرات', 'calories' => 180, 'protein' => 6, 'carbs' => 8, 'fats' => 15],
                        ],
                    ],
                ],
            ],
            [
                'day_name' => 'الأحد',
                'meals' => [
                    [
                        'meal_type' => 'الإفطار',
                        'meal_time' => '08:00',
                        'items' => [
                            ['name' => 'توست أسمر مع زبدة فول سوداني', 'calories' => 280, 'protein' => 12, 'carbs' => 35, 'fats' => 10],
                            ['name' => 'عصير برتقال طبيعي', 'calories' => 110, 'protein' => 2, 'carbs' => 26, 'fats' => 0],
                        ],
                    ],
                    [
                        'meal_type' => 'الغداء',
                        'meal_time' => '13:00',
                        'items' => [
                            ['name' => 'برجر لحم قليل الدسم', 'calories' => 350, 'protein' => 30, 'carbs' => 35, 'fats' => 12],
                            ['name' => 'بطاطا مشوية', 'calories' => 150, 'protein' => 3, 'carbs' => 35, 'fats' => 1],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($daysData as $index => $dayData) {
            $day = NutritionDay::create([
                'nutrition_plan_id' => $plan->id,
                'date' => $startDate->copy()->addDays($index),
                'day_name' => $dayData['day_name'],
                'notes' => null,
            ]);

            foreach ($dayData['meals'] as $mealIndex => $mealData) {
                $meal = Meal::create([
                    'nutrition_day_id' => $day->id,
                    'meal_type' => $mealData['meal_type'],
                    'meal_time' => $mealData['meal_time'],
                    'order' => $mealIndex,
                ]);

                foreach ($mealData['items'] as $itemIndex => $itemData) {
                    MealItem::create([
                        'meal_id' => $meal->id,
                        'name' => $itemData['name'],
                        'calories' => $itemData['calories'],
                        'protein' => $itemData['protein'],
                        'carbs' => $itemData['carbs'],
                        'fats' => $itemData['fats'],
                        'is_completed' => $index === 0 && $mealIndex === 0, // Mark breakfast items as completed
                        'completed_at' => $index === 0 && $mealIndex === 0 ? now() : null,
                        'order' => $itemIndex,
                    ]);
                }
            }
        }
    }
}