<?php

namespace App\Services;

use App\Models\HeroSection;
use App\Models\HeroStat;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HeroSectionService
{
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    const ALLOWED_VIDEO_TYPES = [
        'video/mp4',
        'video/webm',
        'video/quicktime', // MOV
        'video/x-msvideo',  // AVI
    ];

    /**
     * Get active hero section
     */
    public function getActiveHeroSection(): ?HeroSection
    {
        return HeroSection::active()
            ->with('activeStats')
            ->first();
    }

    /**
     * Update hero section
     */
    public function updateHeroSection(array $data, ?int $userId = null): HeroSection
    {
        DB::beginTransaction();

        try {
            // Get or create hero section (only one active at a time)
            $heroSection = HeroSection::active()->first();
            
            if (!$heroSection) {
                $heroSection = new HeroSection();
                $heroSection->is_active = true;
            }

            // Update text content
            $heroSection->fill([
                'badge_en' => $data['badge_en'] ?? null,
                'badge_ar' => $data['badge_ar'] ?? null,
                'main_title_en' => $data['main_title_en'] ?? null,
                'main_title_ar' => $data['main_title_ar'] ?? null,
                'sub_title_en' => $data['sub_title_en'] ?? null,
                'sub_title_ar' => $data['sub_title_ar'] ?? null,
                'description_en' => $data['description_en'] ?? null,
                'description_ar' => $data['description_ar'] ?? null,
                'updated_by' => $userId,
            ]);

            $heroSection->save();

            // Update stats if provided
            if (isset($data['stats']) && is_array($data['stats'])) {
                $this->updateStats($heroSection->id, $data['stats']);
            }

            DB::commit();

            return $heroSection->fresh(['stats']);

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Upload hero video
     */
    public function uploadVideo(UploadedFile $file, ?int $userId = null): HeroSection
    {
        $this->validateVideo($file);

        DB::beginTransaction();

        try {
            // Get or create hero section
            $heroSection = HeroSection::active()->first();
            
            if (!$heroSection) {
                $heroSection = new HeroSection();
                $heroSection->is_active = true;
            }

            // Delete old video if exists
            if ($heroSection->video_path) {
                $this->deleteVideo($heroSection->video_path);
            }

            // Generate unique filename
            $filename = $this->generateUniqueFilename($file);
            
            // Store video in storage
            $path = $file->storeAs('videos', $filename, 'public');

            // للـ Windows/WAMP - حفظ نسخة في public
            $publicVideoDir = public_path('videos');
            if (!is_dir($publicVideoDir)) {
                mkdir($publicVideoDir, 0755, true);
            }
            
            // نسخ الملف
            $storagePath = storage_path('app/public/' . $path);
            $publicPath = public_path('videos/' . $filename);
            
            if (file_exists($storagePath)) {
                copy($storagePath, $publicPath);
            }

            // Update hero section
            $heroSection->video_path = $path;
            $heroSection->video_name = $file->getClientOriginalName();
            $heroSection->video_type = $file->getMimeType();
            $heroSection->video_size = $file->getSize();
            $heroSection->updated_by = $userId;
            $heroSection->save();

            DB::commit();

            return $heroSection;

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Delete uploaded file if exists
            if (isset($path) && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
            
            // Delete from public
            if (isset($filename)) {
                $publicPath = public_path('videos/' . $filename);
                if (file_exists($publicPath)) {
                    unlink($publicPath);
                }
            }

            throw $e;
        }
    }

    /**
     * Delete video
     */
    public function deleteVideo(string $videoPath): bool
    {
        try {
            // Delete from storage
            if (Storage::disk('public')->exists($videoPath)) {
                Storage::disk('public')->delete($videoPath);
            }
            
            // Delete from public
            $publicPath = public_path('videos/' . basename($videoPath));
            if (file_exists($publicPath)) {
                unlink($publicPath);
            }

            return true;

        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Update stats
     */
    private function updateStats(int $heroSectionId, array $stats): void
    {
        // Get existing stat IDs
        $existingStatIds = collect($stats)
            ->filter(fn($stat) => isset($stat['id']))
            ->pluck('id')
            ->toArray();

        // Delete stats not in the update
        HeroStat::where('hero_section_id', $heroSectionId)
            ->whereNotIn('id', $existingStatIds)
            ->delete();

        // Update or create stats
        foreach ($stats as $index => $statData) {
            $stat = isset($statData['id']) 
                ? HeroStat::find($statData['id'])
                : new HeroStat();

            $stat->hero_section_id = $heroSectionId;
            $stat->value = $statData['value'] ?? '';
            $stat->label_en = $statData['label_en'] ?? '';
            $stat->label_ar = $statData['label_ar'] ?? '';
            $stat->order = $index;
            $stat->is_active = true;
            $stat->save();
        }
    }

    /**
     * Validate video file
     */
    private function validateVideo(UploadedFile $file): void
    {
        if ($file->getSize() > self::MAX_VIDEO_SIZE) {
            throw new \Exception('حجم الفيديو يتجاوز الحد المسموح (50MB).');
        }

        if (!in_array($file->getMimeType(), self::ALLOWED_VIDEO_TYPES)) {
            throw new \Exception('نوع الفيديو غير مدعوم. الصيغ المدعومة: MP4, WEBM, MOV');
        }

        if (!$file->isValid()) {
            throw new \Exception('الفيديو المرفوع غير صالح.');
        }
    }

    /**
     * Generate unique filename
     */
    private function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');
        $random = Str::random(8);
        
        return "hero_video_{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Get hero section for API (public)
     */
    public function getHeroSectionForApi(string $locale = 'ar'): array
    {
        $heroSection = $this->getActiveHeroSection();

        if (!$heroSection) {
            return [
                'success' => false,
                'message' => 'Hero section not found',
            ];
        }

        return [
            'success' => true,
            'data' => [
                'video_url' => $heroSection->video_url,
                'badge' => $heroSection->getBadge($locale),
                'main_title' => $heroSection->getMainTitle($locale),
                'sub_title' => $heroSection->getSubTitle($locale),
                'description' => $heroSection->getDescription($locale),
                'stats' => $heroSection->activeStats->map(function ($stat) use ($locale) {
                    return [
                        'value' => $stat->value,
                        'label' => $stat->getLabel($locale),
                    ];
                }),
            ],
        ];
    }
}