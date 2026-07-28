<?php

namespace Database\Seeders;

use App\Models\AboutCoach;
use App\Models\CoachFeature;
use Illuminate\Database\Seeder;

class AboutCoachSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create about coach
        $about = AboutCoach::create([
            'badge_en' => 'Who Am I',
            'badge_ar' => 'من أنا',
            
            'title_en' => 'About the Coach',
            'title_ar' => 'عن المدربة',
            
            'main_description_en' => 'An internationally certified fitness coach with over 5 years of experience transforming women\'s lives. I believe that every body is unique, which is why I design personalized training and nutrition programs tailored to your needs and personal goals.',
            'main_description_ar' => 'مدربة لياقة بدنية معتمدة دولياً مع أكثر من 5 سنوات من الخبرة في تحويل حياة النساء. أؤمن بأن كل جسم فريد من نوعه، ولهذا أصمم برامج تدريب وتغذية مخصصة تتناسب مع احتياجاتك وأهدافك الشخصية.',
            
            'highlight_text_en' => 'I have helped over 500 trainees achieve their fitness and health goals through comprehensive programs that combine effective training, proper nutrition, and continuous psychological support.',
            'highlight_text_ar' => 'ساعدت أكثر من 500 متدربة على تحقيق أهدافهن في اللياقة والصحة من خلال برامج شاملة تجمع بين التدريب الفعال، التغذية السليمة، والدعم النفسي المستمر.',
            
            'is_active' => true,
        ]);

        // Create features
        $features = [
            [
                'icon' => '🍎',
                'title_en' => 'Personalized Nutrition Plans',
                'title_ar' => 'أنظمة غذائية مخصصة',
                'description_en' => 'Nutrition plans designed especially for you',
                'description_ar' => 'خطط تغذية مصممة خصيصاً لك',
                'order' => 0,
            ],
            [
                'icon' => '💪',
                'title_en' => 'Online Personal Training',
                'title_ar' => 'تدريب شخصي أونلاين',
                'description_en' => 'Diverse daily training and follow-up sessions',
                'description_ar' => 'جلسات تدريب متنوعة ومتابعة يومية',
                'order' => 1,
            ],
            [
                'icon' => '📊',
                'title_en' => 'Continuous Follow-up',
                'title_ar' => 'متابعة مستمرة',
                'description_en' => 'Support and follow-up throughout the week',
                'description_ar' => 'دعم ومتابعة على مدار الأسبوع',
                'order' => 2,
            ],
            [
                'icon' => '🏋️‍♀️',
                'title_en' => 'Cutting, Sculpting, Muscle Gain',
                'title_ar' => 'تنشيف، نحت، زيادة عضل',
                'description_en' => 'Comprehensive programs to achieve your goals',
                'description_ar' => 'برامج شاملة لتحقيق أهدافك',
                'order' => 3,
            ],
        ];

        foreach ($features as $feature) {
            CoachFeature::create([
                'about_coach_id' => $about->id,
                'icon' => $feature['icon'],
                'title_en' => $feature['title_en'],
                'title_ar' => $feature['title_ar'],
                'description_en' => $feature['description_en'],
                'description_ar' => $feature['description_ar'],
                'order' => $feature['order'],
                'is_active' => true,
            ]);
        }

        echo "✅ About Coach seeded successfully!\n";
        echo "   - Bilingual content (English & Arabic)\n";
        echo "   - 4 features created\n";
        echo "   - Ready for image upload\n";
    }
}