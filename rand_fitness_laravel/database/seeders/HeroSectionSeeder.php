<?php

namespace Database\Seeders;

use App\Models\HeroSection;
use App\Models\HeroStat;
use Illuminate\Database\Seeder;

class HeroSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create hero section
        $heroSection = HeroSection::create([
            // English Content
            'badge_en' => 'Personalized Training Program',
            'main_title_en' => 'Train Your Body with Confidence',
            'sub_title_en' => 'A program designed especially for you',
            'description_en' => "Training and nutrition based on your body, goal, and lifestyle\nStart your journey to the better version of you",
            
            // Arabic Content
            'badge_ar' => 'برنامج تدريبي مخصص لكِ',
            'main_title_ar' => 'درّبي جسمك بثقة',
            'sub_title_ar' => 'برنامج مصمم خصيصًا لك',
            'description_ar' => "تدريب وتغذية مبنية على جسمك، هدفك، ونمط حياتك\nابدئي رحلتك نحو النسخة الأفضل منك",
            
            'is_active' => true,
        ]);

        // Create stats
        $stats = [
            [
                'value' => '500+',
                'label_en' => 'Happy Trainees',
                'label_ar' => 'متدربة سعيدة',
                'order' => 0,
            ],
            [
                'value' => '5+',
                'label_en' => 'Years of Experience',
                'label_ar' => 'سنوات خبرة',
                'order' => 1,
            ],
            [
                'value' => '98%',
                'label_en' => 'Success Rate',
                'label_ar' => 'نسبة النجاح',
                'order' => 2,
            ],
        ];

        foreach ($stats as $statData) {
            HeroStat::create([
                'hero_section_id' => $heroSection->id,
                ...$statData,
            ]);
        }

        echo "✅ Hero Section seeded successfully!\n";
        echo "   - Content: English & Arabic\n";
        echo "   - Stats: 3 items\n";
    }
}