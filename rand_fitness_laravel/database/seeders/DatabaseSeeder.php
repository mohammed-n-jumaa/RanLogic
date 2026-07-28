<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        // Create Admin User (Rand Jarar)
        User::create([
            'name' => 'Rand Jarar',
            'email' => 'admin@randjarar.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
            'gender' => 'female',
            'age' => 28,
        ]);

        echo "✅ Admin user created successfully!\n";
        echo "   Email: admin@randjarar.com\n";
        echo "   Password: admin123\n\n";

        // Create Demo Female User
        User::create([
            'name' => 'Sarah Ahmad',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
            
            // Body Measurements
            'height' => 165.0,
            'weight' => 68.5,
            'waist' => 75.0,
            'hips' => 95.0,
            'age' => 28,
            
            // Gender & Goal
            'gender' => 'female',
            'goal' => 'weight-loss',
            'workout_place' => 'home',
            'program' => 'Beginner Weight Loss Program',
            
            // Health Status
            'health_notes' => 'No major health issues. Slight knee pain during high-impact exercises.',
            
            // Subscription
            'has_active_subscription' => true,
            'subscription_start_date' => now(),
            'subscription_end_date' => now()->addMonth(),
        ]);

        // Create Demo Male User
        User::create([
            'name' => 'Ahmed Hassan',
            'email' => 'ahmed@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
            
            // Body Measurements
            'height' => 178.0,
            'weight' => 82.0,
            'waist' => 88.0,
            'hips' => null, // Males don't require hips measurement
            'age' => 32,
            
            // Gender & Goal
            'gender' => 'male',
            'goal' => 'muscle-gain',
            'workout_place' => 'gym',
            'program' => 'Advanced Muscle Building',
            
            // Health Status
            'health_notes' => 'Previous lower back injury (2 years ago). Fully recovered.',
            
            // Subscription
            'has_active_subscription' => true,
            'subscription_start_date' => now(),
            'subscription_end_date' => now()->addMonths(3),
        ]);

        // Create Female User - Toning Goal
        User::create([
            'name' => 'Layla Ibrahim',
            'email' => 'layla@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
            
            'height' => 160.0,
            'weight' => 55.0,
            'waist' => 65.0,
            'hips' => 88.0,
            'age' => 25,
            
            'gender' => 'female',
            'goal' => 'toning',
            'workout_place' => 'gym',
            'program' => 'Full Body Toning',
            
            'health_notes' => 'Lactose intolerant. No injuries.',
            
            'has_active_subscription' => false,
        ]);

        // Create Male User - General Fitness
        User::create([
            'name' => 'Omar Khaled',
            'email' => 'omar@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
            
            'height' => 175.0,
            'weight' => 75.0,
            'waist' => 82.0,
            'age' => 29,
            
            'gender' => 'male',
            'goal' => 'fitness',
            'workout_place' => 'home',
            'program' => 'General Fitness Program',
            
            'health_notes' => 'Mild asthma. Carry inhaler during intense cardio.',
            
            'has_active_subscription' => true,
            'subscription_start_date' => now()->subDays(15),
            'subscription_end_date' => now()->addDays(15),
        ]);

        // Create Female User - Muscle Gain
        User::create([
            'name' => 'Noor Mohammed',
            'email' => 'noor@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
            'email_verified_at' => now(),
            
            'height' => 170.0,
            'weight' => 62.0,
            'waist' => 70.0,
            'hips' => 92.0,
            'age' => 26,
            
            'gender' => 'female',
            'goal' => 'muscle-gain',
            'workout_place' => 'gym',
            'program' => 'Women\'s Strength Training',
            
            'health_notes' => 'Peanut allergy. No other health concerns.',
            
            'has_active_subscription' => true,
            'subscription_start_date' => now()->subWeek(),
            'subscription_end_date' => now()->addMonths(2)->subWeek(),
        ]);

        // Create Inactive User (for testing)
        User::create([
            'name' => 'Inactive User',
            'email' => 'inactive@example.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => false,
            'email_verified_at' => now(),
            
            'height' => 168.0,
            'weight' => 70.0,
            'waist' => 78.0,
            'hips' => 96.0,
            'age' => 30,
            
            'gender' => 'female',
            'goal' => 'weight-loss',
            'workout_place' => 'home',
            
            'has_active_subscription' => false,
        ]);

        echo "✅ Demo users created successfully!\n\n";
        
        echo "Female Users:\n";
        echo "  1. sarah@example.com / password123 (Weight Loss, Active)\n";
        echo "  2. layla@example.com / password123 (Toning, Inactive Sub)\n";
        echo "  3. noor@example.com / password123 (Muscle Gain, Active)\n\n";
        
        echo "Male Users:\n";
        echo "  1. ahmed@example.com / password123 (Muscle Gain, Active)\n";
        echo "  2. omar@example.com / password123 (Fitness, Active)\n\n";

        echo "🎉 Database seeded successfully!\n";
    }
}