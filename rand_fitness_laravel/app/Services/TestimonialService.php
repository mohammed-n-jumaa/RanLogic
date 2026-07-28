<?php

namespace App\Services;

use App\Models\Testimonial;
use App\Models\TestimonialsSection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TestimonialService
{
    const MAX_IMAGE_SIZE      = 5 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const CACHE_KEY           = 'testimonials';
    const CACHE_TTL           = 3600; // 1 hour

    // -------------------------------------------------------------------------
    // READ
    // -------------------------------------------------------------------------

    /**
     * Get section for admin (no cache).
     */
    public function getSection(): ?TestimonialsSection
    {
        return TestimonialsSection::first();
    }

    /**
     * Get all testimonials for admin (no cache).
     */
    public function getTestimonials(): Collection
    {
        return Testimonial::ordered()->get();
    }

    /**
     * Get testimonials for public API (cached per locale).
     */
    public function getTestimonialsForApi(string $locale = 'ar'): array
    {
        return Cache::remember(self::CACHE_KEY . ":{$locale}", self::CACHE_TTL, function () use ($locale) {
            $section      = TestimonialsSection::active()->first();
            $testimonials = Testimonial::active()->ordered()->get();

            return [
                'section' => $section ? [
                    'badge'       => $section->getBadge($locale),
                    'title'       => $section->getTitle($locale),
                    'description' => $section->getDescription($locale),
                ] : null,
                'testimonials' => $testimonials->map(fn($t) => [
                    'name'      => $t->getName($locale),
                    'title'     => $t->getTitle($locale),
                    'text'      => $t->getText($locale),
                    'rating'    => $t->rating,
                    'image_url' => $t->image_url,
                ]),
            ];
        });
    }

    // -------------------------------------------------------------------------
    // WRITE
    // -------------------------------------------------------------------------

    /**
     * Create or update testimonials section.
     */
    public function updateSection(array $data, ?int $userId = null): TestimonialsSection
    {
        $section = TestimonialsSection::first();

        $payload = [
            'badge_en'       => $data['badge_en']       ?? ($section->badge_en       ?? null),
            'badge_ar'       => $data['badge_ar']       ?? ($section->badge_ar       ?? null),
            'title_en'       => $data['title_en']       ?? ($section->title_en       ?? null),
            'title_ar'       => $data['title_ar']       ?? ($section->title_ar       ?? null),
            'description_en' => $data['description_en'] ?? ($section->description_en ?? null),
            'description_ar' => $data['description_ar'] ?? ($section->description_ar ?? null),
            'is_active'      => true,
            'updated_by'     => $userId,
        ];

        if ($section) {
            $section->update($payload);
        } else {
            $section = TestimonialsSection::create($payload);
        }

        $this->clearCache();

        return $section->fresh();
    }

    /**
     * Bulk upsert testimonials and delete those not in the list.
     */
    public function bulkUpdateTestimonials(array $testimonials, ?int $userId = null): Collection
    {
        DB::beginTransaction();

        try {
            $keepIds = collect($testimonials)->pluck('id')->filter()->values()->all();

            // Delete testimonials no longer in the list
            Testimonial::whereNotIn('id', $keepIds)->delete();

            foreach ($testimonials as $index => $data) {
                Testimonial::updateOrCreate(
                    ['id' => $data['id'] ?? null],
                    [
                        'name_en'    => $data['name_en'],
                        'name_ar'    => $data['name_ar'],
                        'title_en'   => $data['title_en'],
                        'title_ar'   => $data['title_ar'],
                        'text_en'    => $data['text_en'],
                        'text_ar'    => $data['text_ar'],
                        'rating'     => $data['rating']    ?? 5,
                        'is_active'  => $data['is_active'] ?? true,
                        'order'      => $index,
                        'updated_by' => $userId,
                    ]
                );
            }

            DB::commit();

            $this->clearCache();

            return Testimonial::ordered()->get();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // -------------------------------------------------------------------------
    // IMAGE
    // -------------------------------------------------------------------------

    /**
     * Upload and store testimonial image.
     */
    public function uploadImage(int $id, UploadedFile $file, ?int $userId = null): Testimonial
    {
        $this->validateImage($file);

        $testimonial = Testimonial::findOrFail($id);

        if ($testimonial->image_path) {
            $this->deleteImageFiles($testimonial->image_path);
        }

        $filename = $this->generateFilename($file, 'testimonial');
        $path     = $file->storeAs('images/testimonials', $filename, 'public');

        $this->copyToPublic($path, 'images/testimonials', $filename);

        $testimonial->update([
            'image_path' => $path,
            'image_name' => $filename,
            'updated_by' => $userId,
        ]);

        $this->clearCache();

        return $testimonial->fresh();
    }

    /**
     * Delete testimonial image files.
     */
    public function deleteImage(string $path): void
    {
        $this->deleteImageFiles($path);
        $this->clearCache();
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    private function deleteImageFiles(string $path): void
    {
        Storage::disk('public')->exists($path) && Storage::disk('public')->delete($path);

        $publicPath = public_path('images/testimonials/' . basename($path));
        file_exists($publicPath) && @unlink($publicPath);
    }

    private function copyToPublic(string $storagePath, string $subDir, string $filename): void
    {
        $publicDir = public_path($subDir);

        if (!is_dir($publicDir)) {
            mkdir($publicDir, 0755, true);
        }

        $src = storage_path("app/public/{$storagePath}");

        if (file_exists($src)) {
            copy($src, "{$publicDir}/{$filename}");
        }
    }

    private function generateFilename(UploadedFile $file, string $prefix): string
    {
        return "{$prefix}_" . now()->format('YmdHis') . '_' . Str::random(8)
            . '.' . $file->getClientOriginalExtension();
    }

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

    private function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . ':ar');
        Cache::forget(self::CACHE_KEY . ':en');
    }
}