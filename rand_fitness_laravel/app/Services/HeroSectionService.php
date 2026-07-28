<?php

namespace App\Services;

use App\Models\HeroSection;
use App\Models\HeroStat;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HeroSectionService
{
    const MAX_VIDEO_SIZE    = 200 * 1024 * 1024;
    const CACHE_KEY         = 'hero_section';
    const CACHE_TTL         = 3600; // 1 hour

    const ALLOWED_VIDEO_TYPES = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
    ];

    // -------------------------------------------------------------------------
    // READ
    // -------------------------------------------------------------------------

    /**
     * Get active hero section with stats (uses cache).
     */
    public function getActiveHeroSection(): ?HeroSection
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return HeroSection::active()
                ->with(['activeStats' => fn($q) => $q->orderBy('order')])
                ->first();
        });
    }

    /**
     * Get hero section for public API (locale-aware, cached per locale).
     */
    public function getHeroSectionForApi(string $locale = 'ar'): array
    {
        $heroSection = $this->getActiveHeroSection();

        if (!$heroSection) {
            return ['success' => false, 'message' => 'Hero section not found'];
        }

        return [
            'success' => true,
            'data' => [
                'video_url'  => $heroSection->video_url,
                'badge'      => $heroSection->getBadge($locale),
                'main_title' => $heroSection->getMainTitle($locale),
                'sub_title'  => $heroSection->getSubTitle($locale),
                'description'=> $heroSection->getDescription($locale),
                'stats'      => $heroSection->activeStats->map(fn($stat) => [
                    'value' => $stat->value,
                    'label' => $stat->getLabel($locale),
                ]),
            ],
        ];
    }

    // -------------------------------------------------------------------------
    // WRITE
    // -------------------------------------------------------------------------

    /**
     * Update hero section content and stats.
     */
    public function updateHeroSection(array $data, ?int $userId = null): HeroSection
    {
        DB::beginTransaction();

        try {
            $heroSection = HeroSection::active()->first()
                ?? tap(new HeroSection(), fn($h) => $h->is_active = true);

            $heroSection->fill([
                'badge_en'      => $data['badge_en']      ?? $heroSection->badge_en,
                'badge_ar'      => $data['badge_ar']      ?? $heroSection->badge_ar,
                'main_title_en' => $data['main_title_en'] ?? $heroSection->main_title_en,
                'main_title_ar' => $data['main_title_ar'] ?? $heroSection->main_title_ar,
                'sub_title_en'  => $data['sub_title_en']  ?? $heroSection->sub_title_en,
                'sub_title_ar'  => $data['sub_title_ar']  ?? $heroSection->sub_title_ar,
                'description_en'=> $data['description_en']?? $heroSection->description_en,
                'description_ar'=> $data['description_ar']?? $heroSection->description_ar,
                'updated_by'    => $userId,
            ])->save();

            if (!empty($data['stats'])) {
                $this->syncStats($heroSection->id, $data['stats']);
            }

            DB::commit();

            $this->clearCache();

            return $heroSection->fresh(['stats']);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // -------------------------------------------------------------------------
    // VIDEO
    // -------------------------------------------------------------------------

    /**
     * Upload and store hero video.
     */
    public function uploadVideo(UploadedFile $file, ?int $userId = null): HeroSection
    {
        $this->validateVideo($file);

        DB::beginTransaction();

        $path     = null;
        $filename = null;

        try {
            $heroSection = HeroSection::active()->first()
                ?? tap(new HeroSection(), fn($h) => $h->is_active = true);

            // Remove old video
            if ($heroSection->video_path) {
                $this->deleteVideoFiles($heroSection->video_path);
            }

            $filename = $this->generateFilename($file, 'hero_video');
            $path     = $file->storeAs('videos', $filename, 'public');

            $this->copyToPublic($path, 'videos', $filename);

            $heroSection->fill([
                'video_path'  => $path,
                'video_name'  => $file->getClientOriginalName(),
                'video_type'  => $file->getMimeType(),
                'video_size'  => $file->getSize(),
                'updated_by'  => $userId,
            ])->save();

            DB::commit();

            $this->clearCache();

            return $heroSection;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->rollbackFiles($path, 'public', $filename ? public_path("videos/{$filename}") : null);
            throw $e;
        }
    }

    /**
     * Delete hero video files from storage and public.
     */
    public function deleteVideo(string $videoPath): void
    {
        $this->deleteVideoFiles($videoPath);
        $this->clearCache();
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    /**
     * Sync stats: delete removed ones, upsert the rest.
     */
    private function syncStats(int $heroSectionId, array $stats): void
    {
        $keepIds = collect($stats)->pluck('id')->filter()->values()->all();

        // Delete stats no longer in the list
        HeroStat::where('hero_section_id', $heroSectionId)
            ->whereNotIn('id', $keepIds)
            ->delete();

        // Upsert remaining stats
        foreach ($stats as $index => $data) {
            HeroStat::updateOrCreate(
                ['id' => $data['id'] ?? null],
                [
                    'hero_section_id' => $heroSectionId,
                    'value'           => $data['value']    ?? '',
                    'label_en'        => $data['label_en'] ?? '',
                    'label_ar'        => $data['label_ar'] ?? '',
                    'order'           => $index,
                    'is_active'       => true,
                ]
            );
        }
    }

    /**
     * Delete video from both storage disk and public folder.
     */
    private function deleteVideoFiles(string $path): void
    {
        Storage::disk('public')->exists($path) && Storage::disk('public')->delete($path);

        $publicPath = public_path('videos/' . basename($path));
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
     * Roll back uploaded files on failure.
     */
    private function rollbackFiles(?string $storagePath, string $disk, ?string $publicPath): void
    {
        if ($storagePath && Storage::disk($disk)->exists($storagePath)) {
            Storage::disk($disk)->delete($storagePath);
        }

        if ($publicPath && file_exists($publicPath)) {
            @unlink($publicPath);
        }
    }

    /**
     * Validate the uploaded video file.
     */
    private function validateVideo(UploadedFile $file): void
    {
        if (!$file->isValid()) {
            throw new \Exception('الفيديو المرفوع غير صالح.');
        }

        if ($file->getSize() > self::MAX_VIDEO_SIZE) {
            throw new \Exception('حجم الفيديو يتجاوز الحد المسموح (200MB).');
        }

        if (!in_array($file->getMimeType(), self::ALLOWED_VIDEO_TYPES, true)) {
            throw new \Exception('نوع الفيديو غير مدعوم. الصيغ المدعومة: MP4, WEBM, MOV, AVI');
        }
    }

    /**
     * Clear hero section cache.
     */
    private function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }
}