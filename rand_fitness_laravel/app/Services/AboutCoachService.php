<?php

namespace App\Services;

use App\Models\AboutCoach;
use App\Models\CoachFeature;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AboutCoachService
{
    const MAX_IMAGE_SIZE        = 5 * 1024 * 1024; // 5MB
    const ALLOWED_IMAGE_TYPES   = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const CACHE_KEY             = 'about_coach';
    const CACHE_TTL             = 3600; // 1 hour

    // -------------------------------------------------------------------------
    // READ
    // -------------------------------------------------------------------------

    /**
     * Get about coach for admin (no cache — needs fresh data).
     */
    public function getAboutCoach(): ?AboutCoach
    {
        return AboutCoach::with(['features' => fn($q) => $q->orderBy('order')])->first();
    }

    /**
     * Get about coach for public API (cached per locale).
     */
    public function getAboutCoachForApi(string $locale = 'ar'): ?array
    {
        return Cache::remember(self::CACHE_KEY . ":{$locale}", self::CACHE_TTL, function () use ($locale) {
            $about = AboutCoach::active()
                ->with(['activeFeatures'])
                ->first();

            if (!$about) {
                return null;
            }

            return [
                'badge'            => $about->getBadge($locale),
                'title'            => $about->getTitle($locale),
                'main_description' => $about->getMainDescription($locale),
                'highlight_text'   => $about->getHighlightText($locale),
                'image_url'        => $about->image_url,
                'features'         => $about->activeFeatures->map(fn($f) => [
                    'icon'        => $f->icon,
                    'title'       => $f->getTitle($locale),
                    'description' => $f->getDescription($locale),
                ]),
            ];
        });
    }

    // -------------------------------------------------------------------------
    // WRITE
    // -------------------------------------------------------------------------

    /**
     * Create or update about coach with optional features.
     */
    public function updateAboutCoach(array $data, ?int $userId = null): AboutCoach
    {
        DB::beginTransaction();

        try {
            $about = AboutCoach::first();

            $payload = [
                'badge_en'            => $data['badge_en']            ?? ($about->badge_en            ?? null),
                'badge_ar'            => $data['badge_ar']            ?? ($about->badge_ar            ?? null),
                'title_en'            => $data['title_en']            ?? ($about->title_en            ?? null),
                'title_ar'            => $data['title_ar']            ?? ($about->title_ar            ?? null),
                'main_description_en' => $data['main_description_en'] ?? ($about->main_description_en ?? null),
                'main_description_ar' => $data['main_description_ar'] ?? ($about->main_description_ar ?? null),
                'highlight_text_en'   => $data['highlight_text_en']   ?? ($about->highlight_text_en   ?? null),
                'highlight_text_ar'   => $data['highlight_text_ar']   ?? ($about->highlight_text_ar   ?? null),
                'is_active'           => true,
                'updated_by'          => $userId,
            ];

            if ($about) {
                $about->update($payload);
            } else {
                $about = AboutCoach::create($payload);
            }

            if (!empty($data['features'])) {
                $this->syncFeatures($about->id, $data['features']);
            }

            DB::commit();

            $this->clearCache();

            return $about->fresh(['features']);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // -------------------------------------------------------------------------
    // IMAGE
    // -------------------------------------------------------------------------

    /**
     * Upload and store coach image.
     */
    public function uploadImage(UploadedFile $file, ?int $userId = null): AboutCoach
    {
        $this->validateImage($file);

        $about = AboutCoach::first();

        if (!$about) {
            throw new \Exception('About coach not found. Please create it first.');
        }

        // Remove old image
        if ($about->image_path) {
            $this->deleteImageFiles($about->image_path);
        }

        $filename = $this->generateFilename($file, 'coach');
        $path     = $file->storeAs('images/coach', $filename, 'public');

        $this->copyToPublic($path, 'images/coach', $filename);

        $about->update([
            'image_path' => $path,
            'image_name' => $filename,
            'updated_by' => $userId,
        ]);

        $this->clearCache();

        return $about->fresh();
    }

    /**
     * Delete coach image.
     */
    public function deleteImageFromCoach(?int $userId = null): bool
    {
        $about = AboutCoach::first();

        if (!$about?->image_path) {
            return false;
        }

        $this->deleteImageFiles($about->image_path);

        $about->update([
            'image_path' => null,
            'image_name' => null,
            'updated_by' => $userId,
        ]);

        $this->clearCache();

        return true;
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    /**
     * Sync features: delete removed ones, upsert the rest.
     */
    private function syncFeatures(int $aboutCoachId, array $features): void
    {
        $keepIds = collect($features)->pluck('id')->filter()->values()->all();

        CoachFeature::where('about_coach_id', $aboutCoachId)
            ->whereNotIn('id', $keepIds)
            ->delete();

        foreach ($features as $index => $data) {
            CoachFeature::updateOrCreate(
                ['id' => $data['id'] ?? null],
                [
                    'about_coach_id' => $aboutCoachId,
                    'icon'           => $data['icon']           ?? '✨',
                    'title_en'       => $data['title_en'],
                    'title_ar'       => $data['title_ar'],
                    'description_en' => $data['description_en'],
                    'description_ar' => $data['description_ar'],
                    'order'          => $index,
                    'is_active'      => $data['is_active'] ?? true,
                ]
            );
        }
    }

    /**
     * Delete image from both storage disk and public folder.
     */
    private function deleteImageFiles(string $path): void
    {
        Storage::disk('public')->exists($path) && Storage::disk('public')->delete($path);

        $publicPath = public_path('images/coach/' . basename($path));
        file_exists($publicPath) && @unlink($publicPath);
    }

    /**
     * Copy a stored file to the public directory (Windows/WAMP compatibility).
     */
    private function copyToPublic(string $storagePath, string $subDir, string $filename): void
    {
        $publicDir = public_path($subDir);

        if (!is_dir($publicDir)) {
            mkdir($publicDir, 0755, true);
        }

        $src  = storage_path("app/public/{$storagePath}");
        $dest = "{$publicDir}/{$filename}";

        if (file_exists($src)) {
            copy($src, $dest);
        }
    }

    /**
     * Generate a timestamped unique filename.
     */
    private function generateFilename(UploadedFile $file, string $prefix): string
    {
        return "{$prefix}_" . now()->format('YmdHis') . '_' . Str::random(8)
            . '.' . $file->getClientOriginalExtension();
    }

    /**
     * Validate uploaded image.
     */
    private function validateImage(UploadedFile $file): void
    {
        if (!in_array($file->getMimeType(), self::ALLOWED_IMAGE_TYPES, true)) {
            throw new \Exception('نوع الملف غير مدعوم. الرجاء رفع صورة (JPG, PNG, WEBP)');
        }

        if ($file->getSize() > self::MAX_IMAGE_SIZE) {
            throw new \Exception('حجم الصورة يجب أن لا يتجاوز 5MB');
        }

        if (!@getimagesize($file->getPathname())) {
            throw new \Exception('الملف ليس صورة صالحة');
        }
    }

    /**
     * Clear about coach cache for all locales.
     */
    private function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . ':ar');
        Cache::forget(self::CACHE_KEY . ':en');
    }
}