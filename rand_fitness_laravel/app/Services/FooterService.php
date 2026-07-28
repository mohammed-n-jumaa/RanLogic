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
            $footer = Footer::first();

            $fields = [
                'description_en',
                'description_ar',
                'copyright_en',
                'copyright_ar',
                'quick_links_title_en',
                'quick_links_title_ar',
                'email',
                'phone',
                'address_en',
                'address_ar',
                'social_links',
            ];

            if (!$footer) {
                $payload = ['is_active' => true];
                foreach ($fields as $f) {
                    if (array_key_exists($f, $data)) {
                        $payload[$f] = $data[$f];
                    }
                }
                $footer = Footer::create($payload);
            } else {
                $payload = [];
                foreach ($fields as $f) {
                    if (array_key_exists($f, $data)) {
                        $payload[$f] = $data[$f];
                    }
                }
                if (!empty($payload)) {
                    $footer->update($payload);
                }
            }

            DB::commit();
            return $footer->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}