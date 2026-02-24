<?php

namespace App\Services;

use App\Models\Footer;
use Illuminate\Support\Facades\DB;

class FooterService
{
    public function getActiveFooter()
    {
        return Footer::where('is_active', true)->first();
    }

    public function getFooterForAdmin()
    {
        return Footer::first();
    }

    public function createOrUpdate(array $data)
    {
        DB::beginTransaction();

        try {
            // Get or create footer
            $footer = Footer::first();
            
            if (!$footer) {
                $footer = Footer::create([
                    'is_active' => true,
                    'social_links' => $data['social_links'] ?? [],
                ]);
            } else {
                // تحديث السوشيال ميديا فقط
                $footer->update([
                    'social_links' => $data['social_links'] ?? $footer->social_links,
                ]);
            }

            DB::commit();
            return $footer;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}