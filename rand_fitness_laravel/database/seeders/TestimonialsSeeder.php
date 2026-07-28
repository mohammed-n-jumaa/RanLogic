<?php

namespace Database\Seeders;

use App\Models\TestimonialsSection;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create section
        $section = TestimonialsSection::create([
            'badge_en' => 'Client Testimonials',
            'badge_ar' => 'آراء المتدربات',
            
            'title_en' => 'Inspiring Success Stories',
            'title_ar' => 'قصص نجاح ملهمة',
            
            'description_en' => 'Listen to our clients\' experiences and how their lives changed for the better',
            'description_ar' => 'استمعي لتجارب متدرباتنا وكيف غيّرت حياتهن للأفضل',
            
            'is_active' => true,
        ]);

        // Create testimonials
        $testimonials = [
            [
                'name_en' => 'Sarah Ahmed',
                'name_ar' => 'سارة أحمد',
                'title_en' => 'Architect',
                'title_ar' => 'مهندسة معمارية',
                'text_en' => 'Amazing experience! Lost 12kg in 3 months with Rand\'s personalized program. The support and continuous follow-up were wonderful.',
                'text_ar' => 'تجربة رائعة! نزلت 12 كيلو في 3 شهور مع برنامج رند المخصص. الدعم والمتابعة المستمرة كانت رائعة.',
                'rating' => 5,
                'order' => 0,
            ],
            [
                'name_en' => 'Layla Mahmoud',
                'name_ar' => 'ليلى محمود',
                'title_en' => 'Doctor',
                'title_ar' => 'طبيبة',
                'text_en' => 'Best coach I\'ve ever worked with! The cutting program was very effective and results showed quickly. Thank you Rand!',
                'text_ar' => 'أفضل مدربة تعاملت معها! برنامج التنشيف كان فعال جداً والنتائج ظهرت بسرعة. شكراً رند.',
                'rating' => 5,
                'order' => 1,
            ],
            [
                'name_en' => 'Noor Aldin',
                'name_ar' => 'نور الدين',
                'title_en' => 'Graphic Designer',
                'title_ar' => 'مصممة جرافيك',
                'text_en' => 'Online training was very convenient for me. Rand is professional and understands your needs perfectly.',
                'text_ar' => 'التدريب الأونلاين كان مريح جداً بالنسبة لي. رند محترمة وتفهم احتياجاتك تماماً.',
                'rating' => 5,
                'order' => 2,
            ],
            [
                'name_en' => 'Mona Hassan',
                'name_ar' => 'منى حسن',
                'title_en' => 'Teacher',
                'title_ar' => 'معلمة',
                'text_en' => 'I gained muscle and lost fat at the same time! The nutrition plan was easy to follow and the exercises were suitable for my level.',
                'text_ar' => 'زدت عضل ونزلت دهون في نفس الوقت! النظام الغذائي كان سهل التطبيق والتمارين مناسبة لمستواي.',
                'rating' => 5,
                'order' => 3,
            ],
            [
                'name_en' => 'Fatima Ali',
                'name_ar' => 'فاطمة علي',
                'title_en' => 'Marketing Manager',
                'title_ar' => 'مديرة تسويق',
                'text_en' => 'Rand is not just a coach, she\'s a friend who supports you every step of the way. I lost 15kg and feel amazing!',
                'text_ar' => 'رند مو بس مدربة، هي صديقة تدعمك في كل خطوة. نزلت 15 كيلو وحاسة بنفسي روعة!',
                'rating' => 5,
                'order' => 4,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create([
                'name_en' => $testimonial['name_en'],
                'name_ar' => $testimonial['name_ar'],
                'title_en' => $testimonial['title_en'],
                'title_ar' => $testimonial['title_ar'],
                'text_en' => $testimonial['text_en'],
                'text_ar' => $testimonial['text_ar'],
                'rating' => $testimonial['rating'],
                'order' => $testimonial['order'],
                'is_active' => true,
            ]);
        }

        echo "✅ Testimonials seeded successfully!\n";
        echo "   - Section created (English & Arabic)\n";
        echo "   - 5 testimonials created with ratings\n";
        echo "   - Ready for image uploads\n";
    }
}