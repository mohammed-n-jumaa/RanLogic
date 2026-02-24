<?php

namespace Database\Seeders;

use App\Models\FaqSection;
use App\Models\FaqQuestionAr;
use App\Models\FaqQuestionEn;
use App\Models\UserQuestion;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        // Create section
        $section = FaqSection::create([
            'title_en' => 'Frequently Asked Questions',
            'title_ar' => 'الأسئلة الشائعة',
            'subtitle_en' => 'Everything you need to know about your fitness journey 🤍',
            'subtitle_ar' => 'كل ما تحتاج معرفته عن رحلتك الرياضية 🤍',
            'is_active' => true,
        ]);

        // Arabic Questions
        $arabicQuestions = [
            [
                'category' => 'البداية',
                'question' => 'من أين أبدأ؟',
                'answer' => 'البداية ليست قوتك، إنما قرارك.',
                'icon' => '🚀',
                'order' => 0,
            ],
            [
                'category' => 'التحفيز',
                'question' => 'أخاف أنني لن أكمل...',
                'answer' => 'أغلب المتدربات بدأن بنفس الشعور.',
                'icon' => '💪',
                'order' => 1,
            ],
            [
                'category' => 'الخصوصية والأمان',
                'question' => 'ماذا عن خصوصيتي؟',
                'answer' => 'خصوصيتك خط أحمر.',
                'icon' => '🔒',
                'order' => 2,
            ],
            [
                'category' => 'إدارة الوقت',
                'question' => 'لدي وقت محدود',
                'answer' => '30 دقيقة كافية عندما تكون صحيحة.',
                'icon' => '⏱️',
                'order' => 3,
            ],
            [
                'category' => 'النتائج',
                'question' => 'متى سأرى النتائج؟',
                'answer' => 'الفرق يبدأ قبل أن يظهر.',
                'icon' => '📈',
                'order' => 4,
            ],
            [
                'category' => 'شكل التدريب',
                'question' => 'هل التدريب أونلاين؟',
                'answer' => 'نعم! من بيتك وفي وقتك.',
                'icon' => '🌐',
                'order' => 5,
            ],
            [
                'category' => 'المعدات',
                'question' => 'هل أحتاج معدات؟',
                'answer' => 'لا، جسمك وحافزك كافيان.',
                'icon' => '🏋️',
                'order' => 6,
            ],
            [
                'category' => 'التغذية',
                'question' => 'ماذا عن النظام الغذائي؟',
                'answer' => 'مرن بدون حرمان.',
                'icon' => '🥗',
                'order' => 7,
            ],
        ];

        foreach ($arabicQuestions as $q) {
            FaqQuestionAr::create($q);
        }

        // English Questions
        $englishQuestions = [
            [
                'category' => 'Getting Started',
                'question' => 'Where do I start?',
                'answer' => 'The beginning is not your strength, it\'s your decision.',
                'icon' => '🚀',
                'order' => 0,
            ],
            [
                'category' => 'Motivation',
                'question' => 'I\'m afraid I won\'t continue...',
                'answer' => 'Most trainees started with the same feeling.',
                'icon' => '💪',
                'order' => 1,
            ],
            [
                'category' => 'Privacy & Security',
                'question' => 'What about my privacy?',
                'answer' => 'Your privacy is a red line.',
                'icon' => '🔒',
                'order' => 2,
            ],
            [
                'category' => 'Time Management',
                'question' => 'I have limited time',
                'answer' => '30 minutes is enough when done right.',
                'icon' => '⏱️',
                'order' => 3,
            ],
            [
                'category' => 'Results',
                'question' => 'When will I see results?',
                'answer' => 'The difference starts before it shows.',
                'icon' => '📈',
                'order' => 4,
            ],
            [
                'category' => 'Training Format',
                'question' => 'Is it online training?',
                'answer' => 'Yes! From your home and at your time.',
                'icon' => '🌐',
                'order' => 5,
            ],
            [
                'category' => 'Equipment',
                'question' => 'Do I need equipment?',
                'answer' => 'No, your body and motivation are enough.',
                'icon' => '🏋️',
                'order' => 6,
            ],
            [
                'category' => 'Nutrition',
                'question' => 'What about diet?',
                'answer' => 'Flexible with no deprivation.',
                'icon' => '🥗',
                'order' => 7,
            ],
        ];

        foreach ($englishQuestions as $q) {
            FaqQuestionEn::create($q);
        }

        // Sample User Questions
        $userQuestions = [
            [
                'name' => 'سارة أحمد',
                'email' => 'sara@example.com',
                'question' => 'هل يمكنني التدريب أثناء الحمل؟',
                'is_read' => false,
            ],
            [
                'name' => 'ليلى محمود',
                'email' => 'layla@example.com',
                'question' => 'ما هي تكلفة البرنامج الشهري؟',
                'is_read' => false,
            ],
            [
                'name' => 'نور الدين',
                'email' => 'noor@example.com',
                'question' => 'هل توجد خصومات للطلاب؟',
                'is_read' => false,
            ],
        ];

        foreach ($userQuestions as $q) {
            UserQuestion::create($q);
        }

        echo "✅ FAQ seeded successfully!\n";
        echo "   - Section created (English & Arabic)\n";
        echo "   - 8 Arabic questions created\n";
        echo "   - 8 English questions created\n";
        echo "   - 3 user questions created\n";
    }
}