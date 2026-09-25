<?php

namespace App\Services;

use App\Models\HeroCtaButton;
use App\Models\HeroDesignContent;
use App\Models\HeroSection;
use App\Models\HeroSlide;
use App\Models\HeroStat;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HeroSectionService
{
    const MAX_VIDEO_SIZE = 200 * 1024 * 1024;
    const CACHE_KEY      = 'hero_section';
    const CACHE_TTL      = 3600;

    const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    // ─── Read ────────────────────────────────────────────────────────────

    public function getActiveHeroSection(): ?HeroSection
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return HeroSection::active()
                ->with([
                    'activeStats', 'designContents', 'ctaButtons',
                    'slides' => fn($q) => $q->where('is_active', true)->orderBy('order'),
                ])
                ->first();
        });
    }

    /**
     * Public API — returns the ACTIVE design's data only.
     */
  public function getHeroSectionForApi(string $locale = 'ar'): array
{
    $hero = $this->getActiveHeroSection();
    if (!$hero) return ['success' => false, 'message' => 'Hero section not found'];

    $designKey = $hero->design_type ?? 'classic';

    // Content — always fallback to classic if design content is empty
    if ($designKey !== 'classic') {
        $dc = $hero->designContents->where('design_key', $designKey)->first();
        $badge       = (!empty($dc?->getBadge($locale)))       ? $dc->getBadge($locale)       : $hero->getBadge($locale);
        $mainTitle   = (!empty($dc?->getMainTitle($locale)))    ? $dc->getMainTitle($locale)    : $hero->getMainTitle($locale);
        $subTitle    = (!empty($dc?->getSubTitle($locale)))     ? $dc->getSubTitle($locale)     : $hero->getSubTitle($locale);
        $description = (!empty($dc?->getDescription($locale)))  ? $dc->getDescription($locale)  : $hero->getDescription($locale);
    } else {
        $badge       = $hero->getBadge($locale);
        $mainTitle   = $hero->getMainTitle($locale);
        $subTitle    = $hero->getSubTitle($locale);
        $description = $hero->getDescription($locale);
    }

    // Stats — fallback to classic
    $designStats = $hero->activeStats->where('design_key', $designKey)->sortBy('order')->values();
    if ($designStats->isEmpty()) {
        $designStats = $hero->activeStats->where('design_key', 'classic')->sortBy('order')->values();
    }
    $stats = $designStats->map(fn($s) => ['value' => $s->value, 'label' => $s->getLabel($locale)]);

    // CTA — fallback to classic
    $designCta = $hero->ctaButtons->where('design_key', $designKey)->where('is_active', true)->sortBy('order')->values();
    if ($designCta->isEmpty()) {
        $designCta = $hero->ctaButtons->where('design_key', 'classic')->where('is_active', true)->sortBy('order')->values();
    }
    $cta = $designCta->map(fn($b) => [
        'label'        => $b->getLabel($locale),
        'style'        => $b->style,
        'target_type'  => $b->target_type,
        'target_value' => $b->target_value,
    ]);

    // Slides
    $slides = $hero->slides
        ->where('design_key', $designKey)
        ->where('is_active', true)
        ->sortBy('order')
        ->values()
        ->map(fn($sl) => [
            'image_url'   => $sl->image_url,
            'main_title'  => $sl->getMainTitle($locale),
            'sub_title'   => $sl->getSubTitle($locale),
            'description' => $sl->getDescription($locale),
        ]);

    return [
        'success' => true,
        'data' => [
            'design_type' => $designKey,
            'video_url'   => $designKey === 'classic' ? $hero->video_url : null,
            'badge'       => $badge,
            'main_title'  => $mainTitle,
            'sub_title'   => $subTitle,
            'description' => $description,
            'stats'       => $stats,
            'cta_buttons' => $cta,
            'slides'      => $slides,
        ],
    ];
}

    /**
     * Admin: full data for ALL designs.
     */
    public function getAdminData(): ?array
    {
        $hero = HeroSection::active()
            ->with(['stats', 'designContents', 'slides', 'ctaButtons'])
            ->first();

        if (!$hero) return null;

        $buildDesign = function (string $key) use ($hero) {
            if ($key === 'classic') {
                $content = [
                    'badge_en' => $hero->badge_en, 'badge_ar' => $hero->badge_ar,
                    'main_title_en' => $hero->main_title_en, 'main_title_ar' => $hero->main_title_ar,
                    'sub_title_en' => $hero->sub_title_en, 'sub_title_ar' => $hero->sub_title_ar,
                    'description_en' => $hero->description_en, 'description_ar' => $hero->description_ar,
                ];
            } else {
                $dc = $hero->designContents->where('design_key', $key)->first();
                $content = [
                    'badge_en' => $dc?->badge_en, 'badge_ar' => $dc?->badge_ar,
                    'main_title_en' => $dc?->main_title_en, 'main_title_ar' => $dc?->main_title_ar,
                    'sub_title_en' => $dc?->sub_title_en, 'sub_title_ar' => $dc?->sub_title_ar,
                    'description_en' => $dc?->description_en, 'description_ar' => $dc?->description_ar,
                ];
            }

            return [
                'content' => $content,
                'stats' => $hero->stats->where('design_key', $key)->sortBy('order')->values()->map(fn($s) => [
                    'id' => $s->id, 'value' => $s->value,
                    'label_en' => $s->label_en, 'label_ar' => $s->label_ar, 'order' => $s->order,
                ]),
                'cta_buttons' => $hero->ctaButtons->where('design_key', $key)->sortBy('order')->values()->map(fn($b) => [
                    'id' => $b->id, 'label_en' => $b->label_en, 'label_ar' => $b->label_ar,
                    'style' => $b->style, 'target_type' => $b->target_type,
                    'target_value' => $b->target_value, 'order' => $b->order,
                ]),
                'slides' => $key !== 'classic'
                    ? $hero->slides->where('design_key', $key)->sortBy('order')->values()->map(fn($sl) => [
                        'id' => $sl->id, 'image_url' => $sl->image_url, 'image_name' => $sl->image_name,
                        'main_title_en' => $sl->main_title_en, 'main_title_ar' => $sl->main_title_ar,
                        'sub_title_en' => $sl->sub_title_en, 'sub_title_ar' => $sl->sub_title_ar,
                        'description_en' => $sl->description_en, 'description_ar' => $sl->description_ar,
                        'order' => $sl->order,
                    ])
                    : null,
            ];
        };

        return [
            'id'           => $hero->id,
            'design_type'  => $hero->design_type ?? 'classic',
            'video_url'    => $hero->video_url,
            'video_name'   => $hero->video_name,
            'video_size'   => $hero->video_size_formatted,
            'designs' => [
                'classic'   => $buildDesign('classic'),
                'cinematic' => $buildDesign('cinematic'),
                'split'     => $buildDesign('split'),
            ],
        ];
    }

    // ─── Write ───────────────────────────────────────────────────────────

    /**
     * Update a single design tab's data.
     */
    public function updateDesign(array $data, string $designKey, ?int $userId = null): HeroSection
    {
        DB::beginTransaction();
        try {
            $hero = HeroSection::active()->first()
                ?? tap(new HeroSection(), fn($h) => $h->is_active = true);

            // Active design switch
            if (isset($data['design_type'])) {
                $hero->design_type = $data['design_type'];
            }
            $hero->updated_by = $userId;

            // Content
            $c = $data['content'] ?? [];
            if ($designKey === 'classic') {
                $hero->fill([
                    'badge_en' => $c['badge_en'] ?? $hero->badge_en,
                    'badge_ar' => $c['badge_ar'] ?? $hero->badge_ar,
                    'main_title_en' => $c['main_title_en'] ?? $hero->main_title_en,
                    'main_title_ar' => $c['main_title_ar'] ?? $hero->main_title_ar,
                    'sub_title_en' => $c['sub_title_en'] ?? $hero->sub_title_en,
                    'sub_title_ar' => $c['sub_title_ar'] ?? $hero->sub_title_ar,
                    'description_en' => $c['description_en'] ?? $hero->description_en,
                    'description_ar' => $c['description_ar'] ?? $hero->description_ar,
                ]);
            }
            $hero->save();

            if ($designKey !== 'classic' && !empty($c)) {
                HeroDesignContent::updateOrCreate(
                    ['hero_section_id' => $hero->id, 'design_key' => $designKey],
                    $c
                );
            }

            // Stats
            if (array_key_exists('stats', $data)) {
                $this->syncStats($hero->id, $designKey, $data['stats'] ?? []);
            }

            // CTA
            if (array_key_exists('cta_buttons', $data)) {
                $this->syncCtaButtons($hero->id, $designKey, $data['cta_buttons'] ?? []);
            }

            DB::commit();
            $this->clearCache();
            return $hero;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // ─── Slides ──────────────────────────────────────────────────────────

    public function uploadSlideImage(UploadedFile $file, string $designKey, array $textData, ?int $userId = null): HeroSlide
    {
        $hero = HeroSection::active()->firstOrFail();

        $filename = 'slide_' . now()->format('YmdHis') . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('hero-slides', $filename, 'public');

        $pubDir = public_path('hero-slides');
        if (!is_dir($pubDir)) mkdir($pubDir, 0755, true);
        $src = storage_path("app/public/{$path}");
        if (file_exists($src)) copy($src, "{$pubDir}/{$filename}");

        $maxOrder = HeroSlide::where('hero_section_id', $hero->id)
            ->where('design_key', $designKey)->max('order') ?? -1;

        $slide = HeroSlide::create([
            'hero_section_id' => $hero->id,
            'design_key'      => $designKey,
            'image_path'      => $path,
            'image_name'      => $file->getClientOriginalName(),
            'main_title_en'   => $textData['main_title_en'] ?? '',
            'main_title_ar'   => $textData['main_title_ar'] ?? '',
            'sub_title_en'    => $textData['sub_title_en'] ?? '',
            'sub_title_ar'    => $textData['sub_title_ar'] ?? '',
            'description_en'  => $textData['description_en'] ?? '',
            'description_ar'  => $textData['description_ar'] ?? '',
            'order'           => $maxOrder + 1,
            'is_active'       => true,
        ]);

        $this->clearCache();
        return $slide;
    }

    public function updateSlide(int $slideId, array $data): HeroSlide
    {
        $slide = HeroSlide::findOrFail($slideId);
        $slide->update($data);
        $this->clearCache();
        return $slide;
    }

    public function deleteSlide(int $slideId): void
    {
        $slide = HeroSlide::findOrFail($slideId);
        $slide->delete();
        $this->clearCache();
    }

    // ─── Video (classic) ─────────────────────────────────────────────────

    public function uploadVideo(UploadedFile $file, ?int $userId = null): HeroSection
    {
        $this->validateVideo($file);
        DB::beginTransaction();
        $path = null; $filename = null;
        try {
            $hero = HeroSection::active()->first()
                ?? tap(new HeroSection(), fn($h) => $h->is_active = true);

            if ($hero->video_path) $this->deleteVideoFiles($hero->video_path);

            $filename = 'hero_video_' . now()->format('YmdHis') . '_' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('videos', $filename, 'public');

            $pubDir = public_path('videos');
            if (!is_dir($pubDir)) mkdir($pubDir, 0755, true);
            $src = storage_path("app/public/{$path}");
            if (file_exists($src)) copy($src, "{$pubDir}/{$filename}");

            $hero->fill([
                'video_path' => $path, 'video_name' => $file->getClientOriginalName(),
                'video_type' => $file->getMimeType(), 'video_size' => $file->getSize(),
                'updated_by' => $userId,
            ])->save();

            DB::commit();
            $this->clearCache();
            return $hero;
        } catch (\Exception $e) {
            DB::rollBack();
            if ($path && Storage::disk('public')->exists($path)) Storage::disk('public')->delete($path);
            if ($filename) { $p = public_path("videos/{$filename}"); if (file_exists($p)) @unlink($p); }
            throw $e;
        }
    }

    public function deleteVideo(string $videoPath): void
    {
        $this->deleteVideoFiles($videoPath);
        $this->clearCache();
    }

    // ─── Sync helpers ────────────────────────────────────────────────────

private function syncStats(int $heroId, string $designKey, array $stats): void
{
    // Delete ALL stats for this design first
    HeroStat::where('hero_section_id', $heroId)
        ->where('design_key', $designKey)
        ->delete();

    // Re-create fresh
    foreach ($stats as $i => $d) {
        HeroStat::create([
            'hero_section_id' => $heroId,
            'design_key'      => $designKey,
            'value'           => $d['value'] ?? '',
            'label_en'        => $d['label_en'] ?? '',
            'label_ar'        => $d['label_ar'] ?? '',
            'order'           => $i,
            'is_active'       => true,
        ]);
    }
}

private function syncCtaButtons(int $heroId, string $designKey, array $buttons): void
{
    HeroCtaButton::where('hero_section_id', $heroId)
        ->where('design_key', $designKey)
        ->delete();

    foreach ($buttons as $i => $d) {
        HeroCtaButton::create([
            'hero_section_id' => $heroId,
            'design_key'      => $designKey,
            'label_en'        => $d['label_en'] ?? '',
            'label_ar'        => $d['label_ar'] ?? '',
            'style'           => $d['style'] ?? 'primary',
            'target_type'     => $d['target_type'] ?? 'page',
            'target_value'    => $d['target_value'] ?? '/auth',
            'order'           => $i,
            'is_active'       => true,
        ]);
    }
}

    private function deleteVideoFiles(string $path): void
    {
        Storage::disk('public')->exists($path) && Storage::disk('public')->delete($path);
        $pub = public_path('videos/' . basename($path));
        file_exists($pub) && @unlink($pub);
    }

    private function validateVideo(UploadedFile $file): void
    {
        if (!$file->isValid()) throw new \Exception('الفيديو غير صالح.');
        if ($file->getSize() > self::MAX_VIDEO_SIZE) throw new \Exception('حجم الفيديو يتجاوز 200MB.');
        if (!in_array($file->getMimeType(), self::ALLOWED_VIDEO_TYPES, true))
            throw new \Exception('نوع الفيديو غير مدعوم. MP4, WEBM, MOV, AVI');
    }

    private function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
        Cache::forget('public:hero-section:ar');
        Cache::forget('public:hero-section:en');
    }
}
