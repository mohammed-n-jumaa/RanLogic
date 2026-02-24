<?php

namespace App\Services;

use App\Models\AboutCoach;
use App\Models\CoachFeature;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AboutCoachService
{
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    /**
     * Get about coach data
     */
    public function getAboutCoach()
    {
        return AboutCoach::with('features')->first();
    }

    /**
     * Get about coach for public API
     */
    public function getAboutCoachForApi(string $locale = 'ar')
    {
        $about = AboutCoach::active()->with('activeFeatures')->first();

        if (!$about) {
            return null;
        }

        return [
            'badge' => $about->getBadge($locale),
            'title' => $about->getTitle($locale),
            'main_description' => $about->getMainDescription($locale),
            'highlight_text' => $about->getHighlightText($locale),
            'image_url' => $about->image_url,
            'features' => $about->activeFeatures->map(function ($feature) use ($locale) {
                return [
                    'icon' => $feature->icon,
                    'title' => $feature->getTitle($locale),
                    'description' => $feature->getDescription($locale),
                ];
            }),
        ];
    }

    /**
     * Update about coach
     */
    public function updateAboutCoach(array $data, ?int $userId = null): AboutCoach
    {
        DB::beginTransaction();

        try {
            $about = AboutCoach::first();

            if (!$about) {
                // Create if doesn't exist
                $about = AboutCoach::create([
                    'badge_en' => $data['badge_en'] ?? null,
                    'badge_ar' => $data['badge_ar'] ?? null,
                    'title_en' => $data['title_en'],
                    'title_ar' => $data['title_ar'],
                    'main_description_en' => $data['main_description_en'],
                    'main_description_ar' => $data['main_description_ar'],
                    'highlight_text_en' => $data['highlight_text_en'] ?? null,
                    'highlight_text_ar' => $data['highlight_text_ar'] ?? null,
                    'is_active' => true,
                    'updated_by' => $userId,
                ]);
            } else {
                // Update existing
                $about->update([
                    'badge_en' => $data['badge_en'] ?? $about->badge_en,
                    'badge_ar' => $data['badge_ar'] ?? $about->badge_ar,
                    'title_en' => $data['title_en'] ?? $about->title_en,
                    'title_ar' => $data['title_ar'] ?? $about->title_ar,
                    'main_description_en' => $data['main_description_en'] ?? $about->main_description_en,
                    'main_description_ar' => $data['main_description_ar'] ?? $about->main_description_ar,
                    'highlight_text_en' => $data['highlight_text_en'] ?? $about->highlight_text_en,
                    'highlight_text_ar' => $data['highlight_text_ar'] ?? $about->highlight_text_ar,
                    'updated_by' => $userId,
                ]);
            }

            // Update features if provided
            if (isset($data['features'])) {
                $this->updateFeatures($about->id, $data['features']);
            }

            DB::commit();

            return $about->fresh('features');

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Upload coach image
     */
    public function uploadImage(UploadedFile $file, ?int $userId = null): AboutCoach
    {
        // Validate
        $this->validateImage($file);

        DB::beginTransaction();

        try {
            $about = AboutCoach::first();

            if (!$about) {
                throw new \Exception('About coach not found. Please create it first.');
            }

            // Delete old image
            if ($about->image_path) {
                $this->deleteImage($about->image_path);
            }

            // Generate unique filename
            $filename = 'coach_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            // Store in storage/app/public/images/coach
            $path = $file->storeAs('images/coach', $filename, 'public');

            // Copy to public/images/coach (Windows/WAMP compatibility)
            $publicDir = public_path('images/coach');
            if (!file_exists($publicDir)) {
                mkdir($publicDir, 0755, true);
            }
            copy(storage_path('app/public/' . $path), $publicDir . '/' . $filename);

            // Update database
            $about->update([
                'image_path' => $path,
                'image_name' => $filename,
                'updated_by' => $userId,
            ]);

            DB::commit();

            return $about->fresh();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete coach image
     */
    public function deleteImageFromCoach(?int $userId = null): bool
    {
        DB::beginTransaction();

        try {
            $about = AboutCoach::first();

            if (!$about || !$about->image_path) {
                return false;
            }

            // Delete files
            $this->deleteImage($about->image_path);

            // Update database
            $about->update([
                'image_path' => null,
                'image_name' => null,
                'updated_by' => $userId,
            ]);

            DB::commit();

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update features
     */
    protected function updateFeatures(int $aboutCoachId, array $features): void
    {
        // Get existing feature IDs
        $existingIds = collect($features)
            ->filter(fn($f) => isset($f['id']))
            ->pluck('id')
            ->toArray();

        // Delete features not in the list
        CoachFeature::where('about_coach_id', $aboutCoachId)
            ->whereNotIn('id', $existingIds)
            ->delete();

        // Update or create features
        foreach ($features as $index => $featureData) {
            if (isset($featureData['id'])) {
                // Update existing
                CoachFeature::where('id', $featureData['id'])
                    ->update([
                        'icon' => $featureData['icon'] ?? '✨',
                        'title_en' => $featureData['title_en'],
                        'title_ar' => $featureData['title_ar'],
                        'description_en' => $featureData['description_en'],
                        'description_ar' => $featureData['description_ar'],
                        'order' => $index,
                        'is_active' => $featureData['is_active'] ?? true,
                    ]);
            } else {
                // Create new
                CoachFeature::create([
                    'about_coach_id' => $aboutCoachId,
                    'icon' => $featureData['icon'] ?? '✨',
                    'title_en' => $featureData['title_en'],
                    'title_ar' => $featureData['title_ar'],
                    'description_en' => $featureData['description_en'],
                    'description_ar' => $featureData['description_ar'],
                    'order' => $index,
                    'is_active' => $featureData['is_active'] ?? true,
                ]);
            }
        }
    }

    /**
     * Validate image
     */
    protected function validateImage(UploadedFile $file): void
    {
        // Check file type
        if (!in_array($file->getMimeType(), self::ALLOWED_IMAGE_TYPES)) {
            throw new \Exception('نوع الملف غير مدعوم. الرجاء رفع صورة (JPG, PNG, WEBP)');
        }

        // Check file size
        if ($file->getSize() > self::MAX_IMAGE_SIZE) {
            throw new \Exception('حجم الصورة يجب أن لا يتجاوز 5MB');
        }

        // Check if valid image
        $imageInfo = @getimagesize($file->getPathname());
        if (!$imageInfo) {
            throw new \Exception('الملف ليس صورة صالحة');
        }
    }

    /**
     * Delete image files
     */
    protected function deleteImage(string $path): void
    {
        // Delete from storage
        Storage::disk('public')->delete($path);

        // Delete from public (Windows/WAMP)
        $publicPath = public_path('images/coach/' . basename($path));
        if (file_exists($publicPath)) {
            @unlink($publicPath);
        }
    }
}