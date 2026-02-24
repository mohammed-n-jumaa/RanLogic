<?php

namespace Database\Seeders;

use App\Models\Certification;
use Illuminate\Database\Seeder;

class CertificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $certifications = [
            [
                'icon' => '🏆',
                'title_en' => 'Certified by',
                'title_ar' => 'موثق من قبل',
                'organization_en' => 'ISSA - International Sports Sciences Association',
                'organization_ar' => 'ISSA - الجمعية الدولية لعلوم الرياضة',
                'is_verified' => true,
                'order' => 0,
            ],
            [
                'icon' => '💪',
                'title_en' => 'Certified by',
                'title_ar' => 'موثق من قبل',
                'organization_en' => 'ACE - American Council on Exercise',
                'organization_ar' => 'ACE - المجلس الأمريكي للتمارين الرياضية',
                'is_verified' => true,
                'order' => 1,
            ],
            [
                'icon' => '⚡',
                'title_en' => 'Certified by',
                'title_ar' => 'موثق من قبل',
                'organization_en' => 'NSCA - National Strength & Conditioning Association',
                'organization_ar' => 'NSCA - الجمعية الوطنية للقوة والتكييف',
                'is_verified' => true,
                'order' => 2,
            ],
            [
                'icon' => '🎖️',
                'title_en' => 'Certified Personal Trainer',
                'title_ar' => 'مدربة شخصية معتمدة',
                'organization_en' => 'NASM - National Academy of Sports Medicine',
                'organization_ar' => 'NASM - الأكاديمية الوطنية للطب الرياضي',
                'is_verified' => true,
                'order' => 3,
            ],
            [
                'icon' => '🥇',
                'title_en' => 'Nutrition Specialist',
                'title_ar' => 'أخصائية تغذية',
                'organization_en' => 'ISSN - International Society of Sports Nutrition',
                'organization_ar' => 'ISSN - الجمعية الدولية للتغذية الرياضية',
                'is_verified' => true,
                'order' => 4,
            ],
        ];

        foreach ($certifications as $certification) {
            Certification::create($certification);
        }

        echo "✅ Certifications seeded successfully!\n";
        echo "   - Count: " . count($certifications) . " certifications\n";
        echo "   - Languages: English & Arabic\n";
        echo "   - All verified\n";
    }
}