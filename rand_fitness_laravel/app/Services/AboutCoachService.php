<?php

namespace App\Services;

use App\Models\AboutCoach;
use App\Models\AboutCoachDesignContent;
use App\Models\CoachFeature;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AboutCoachService
{
    const MAX_IMAGE_SIZE      = 5 * 1024 * 1024;
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const CACHE_KEY           = 'about_coach';
    const CACHE_TTL           = 3600;

    protected ImageOptimizationService $imageOptimizer;

    public function __construct(ImageOptimizationService $imageOptimizer)
    {
        $this->imageOptimizer = $imageOptimizer;
    }

    public function getAboutCoach(): ?AboutCoach
    {
        return AboutCoach::with(['features', 'designContents'])->first();
    }

    public function getAboutCoachForApi(string $locale = 'ar'): ?array
    {
        return Cache::remember(self::CACHE_KEY . ":{$locale}", self::CACHE_TTL, function () use ($locale) {
            $about = AboutCoach::active()
                ->with(['activeFeatures', 'designContents'])
                ->first();

            if (!$about) {
                return null;
            }

            $designKey = $about->design_type ?? 'classic';

            if ($designKey !== 'classic') {
                $dc = $about->designContents->where('design_key', $designKey)->first();
                $badge     = (!empty($dc?->getBadge($locale)))          ? $dc->getBadge($locale)          : $about->getBadge($locale);
                $title     = (!empty($dc?->getTitle($locale)))           ? $dc->getTitle($locale)           : $about->getTitle($locale);
                $desc      = (!empty($dc?->getMainDescription($locale))) ? $dc->getMainDescription($locale) : $about->getMainDescription($locale);
                $highlight = (!empty($dc?->getHighlightText($locale)))   ? $dc->getHighlightText($locale)   : $about->getHighlightText($locale);
            } else {
                $badge     = $about->getBadge($locale);
                $title     = $about->getTitle($locale);
                $desc      = $about->getMainDescription($locale);
                $highlight = $about->getHighlightText($locale);
            }

            $designFeatures = $about->activeFeatures
                ->where('design_key', $designKey)
                ->sortBy('order')
                ->values();

            if ($designFeatures->isEmpty()) {
                $designFeatures = $about->activeFeatures
                    ->where('design_key', 'classic')
                    ->sortBy('order')
                    ->values();
            }

            return [
                'design_type'      => $designKey,
                'bg_style'         => $about->bg_style ?? 'dark',
                'badge'            => $badge,
                'title'            => $title,
                'main_description' => $desc,
                'highlight_text'   => $highlight,
                'image_url'        => $about->image_url,
                'features'         => $designFeatures->map(fn($f) => [
                    'icon'        => $f->icon,
                    'title'       => $f->getTitle($locale),
                    'description' => $f->getDescription($locale),
                ]),
            ];
        });
    }

    public function getAdminData(): ?array
    {
        $about = AboutCoach::with(['features', 'designContents'])->first();

        if (!$about) {
            return null;
        }

        $buildDesign = function (string $key) use ($about) {
            if ($key === 'classic') {
                $content = [
                    'badge_en'             => $about->badge_en,
                    'badge_ar'             => $about->badge_ar,
                    'title_en'             => $about->title_en,
                    'title_ar'             => $about->title_ar,
                    'main_description_en'  => $about->main_description_en,
                    'main_description_ar'  => $about->main_description_ar,
                    'highlight_text_en'    => $about->highlight_text_en,
                    'highlight_text_ar'    => $about->highlight_text_ar,
                ];
            } else {
                $dc = $about->designContents->where('design_key', $key)->first();
                $content = [
                    'badge_en'             => $dc?->badge_en,
                    'badge_ar'             => $dc?->badge_ar,
                    'title_en'             => $dc?->title_en,
                    'title_ar'             => $dc?->title_ar,
                    'main_description_en'  => $dc?->main_description_en,
                    'main_description_ar'  => $dc?->main_description_ar,
                    'highlight_text_en'    => $dc?->highlight_text_en,
                    'highlight_text_ar'    => $dc?->highlight_text_ar,
                ];
            }

            return [
                'content'  => $content,
                'features' => $about->features
                    ->where('design_key', $key)
                    ->sortBy('order')
                    ->values()
                    ->map(fn($f) => [
                        'id'             => $f->id,
                        'icon'           => $f->icon,
                        'title_en'       => $f->title_en,
                        'title_ar'       => $f->title_ar,
                        'description_en' => $f->description_en,
                        'description_ar' => $f->description_ar,
                        'order'          => $f->order,
                    ]),
            ];
        };

        return [
            'id'          => $about->id,
            'design_type' => $about->design_type ?? 'classic',
            'bg_style'    => $about->bg_style ?? 'dark',
            'image_url'   => $about->image_url,
            'designs'     => [
                'classic'   => $buildDesign('classic'),
                'editorial' => $buildDesign('editorial'),
                'bento'     => $buildDesign('bento'),
                'spotlight' => $buildDesign('spotlight'),
            ],
        ];
    }

    public function updateDesign(array $data, string $designKey, ?int $userId = null): AboutCoach
    {
        DB::beginTransaction();

        try {
            $about = AboutCoach::first()
                ?? tap(new AboutCoach(), fn($a) => $a->is_active = true);

            if (isset($data['design_type'])) {
                $about->design_type = $data['design_type'];
            }

            if (isset($data['bg_style'])) {
                $about->bg_style = $data['bg_style'];
            }
            
            $about->updated_by = $userId;

            $c = $data['content'] ?? [];

            if ($designKey === 'classic') {
                $about->fill([
                    'badge_en'             => $c['badge_en']             ?? $about->badge_en,
                    'badge_ar'             => $c['badge_ar']             ?? $about->badge_ar,
                    'title_en'             => $c['title_en']             ?? $about->title_en,
                    'title_ar'             => $c['title_ar']             ?? $about->title_ar,
                    'main_description_en'  => $c['main_description_en']  ?? $about->main_description_en,
                    'main_description_ar'  => $c['main_description_ar']  ?? $about->main_description_ar,
                    'highlight_text_en'    => $c['highlight_text_en']    ?? $about->highlight_text_en,
                    'highlight_text_ar'    => $c['highlight_text_ar']    ?? $about->highlight_text_ar,
                ]);
            }

            $about->save();

            if ($designKey !== 'classic' && !empty($c)) {
                AboutCoachDesignContent::updateOrCreate(
                    ['about_coach_id' => $about->id, 'design_key' => $designKey],
                    $c
                );
            }

            if (array_key_exists('features', $data)) {
                $this->syncFeatures($about->id, $designKey, $data['features'] ?? []);
            }

            DB::commit();
            $this->clearCache();

            return $about;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateAboutCoach(array $data, ?int $userId = null): AboutCoach
    {
        return $this->updateDesign(
            array_merge($data, ['content' => $data]),
            'classic',
            $userId
        );
    }

    public function uploadImage(UploadedFile $file, ?int $userId = null): AboutCoach
    {
        $this->validateImage($file);

        $about = AboutCoach::first();

        if (!$about) {
            throw new \Exception('About coach not found.');
        }

        if ($about->image_path) {
            $this->deleteImageFiles($about->image_path);
        }

        $filename = 'coach_' . now()->format('YmdHis') . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('images/coach', $filename, 'public');

        $this->imageOptimizer->optimize($file, $path, 'public', maxWidth: 1200, maxHeight: 1200);
        $this->copyToPublic($path, 'images/coach', $filename);

        $about->update([
            'image_path' => $path,
            'image_name' => $filename,
            'updated_by' => $userId,
        ]);

        $this->clearCache();

        return $about->fresh();
    }

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

    private function syncFeatures(int $aboutCoachId, string $designKey, array $features): void
    {
        CoachFeature::where('about_coach_id', $aboutCoachId)
            ->where('design_key', $designKey)
            ->delete();

        foreach ($features as $i => $d) {
            CoachFeature::create([
                'about_coach_id' => $aboutCoachId,
                'design_key'     => $designKey,
                'icon'           => $d['icon'] ?? '✨',
                'title_en'       => $d['title_en'] ?? '',
                'title_ar'       => $d['title_ar'] ?? '',
                'description_en' => $d['description_en'] ?? '',
                'description_ar' => $d['description_ar'] ?? '',
                'order'          => $i,
                'is_active'      => true,
            ]);
        }
    }

    private function deleteImageFiles(string $path): void
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        $publicPath = public_path('images/coach/' . basename($path));

        if (file_exists($publicPath)) {
            @unlink($publicPath);
        }
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

    private function validateImage(UploadedFile $file): void
    {
        if (!in_array($file->getMimeType(), self::ALLOWED_IMAGE_TYPES, true)) {
            throw new \Exception('نوع الملف غير مدعوم. JPG, PNG, WEBP');
        }

        if ($file->getSize() > self::MAX_IMAGE_SIZE) {
            throw new \Exception('حجم الصورة يجب أن لا يتجاوز 5MB');
        }
    }

    private function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . ':ar');
        Cache::forget(self::CACHE_KEY . ':en');
        Cache::forget('public:about-coach:ar');
        Cache::forget('public:about-coach:en');
    }
}
