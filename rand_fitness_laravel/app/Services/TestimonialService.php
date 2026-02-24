<?php

namespace App\Services;

use App\Models\Testimonial;
use App\Models\TestimonialsSection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TestimonialService
{
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    public function getSection()
    {
        return TestimonialsSection::first();
    }

    public function getTestimonials()
    {
        return Testimonial::ordered()->get();
    }

    public function getTestimonialsForApi(string $locale = 'ar')
    {
        $section = TestimonialsSection::active()->first();
        $testimonials = Testimonial::active()->ordered()->get();

        return [
            'section' => $section ? [
                'badge' => $section->getBadge($locale),
                'title' => $section->getTitle($locale),
                'description' => $section->getDescription($locale),
            ] : null,
            'testimonials' => $testimonials->map(function ($t) use ($locale) {
                return [
                    'name' => $t->getName($locale),
                    'title' => $t->getTitle($locale),
                    'text' => $t->getText($locale),
                    'rating' => $t->rating,
                    'image_url' => $t->image_url,
                ];
            }),
        ];
    }

    public function updateSection(array $data, ?int $userId = null)
    {
        DB::beginTransaction();
        try {
            $section = TestimonialsSection::first();

            if (!$section) {
                $section = TestimonialsSection::create([
                    'badge_en' => $data['badge_en'] ?? null,
                    'badge_ar' => $data['badge_ar'] ?? null,
                    'title_en' => $data['title_en'],
                    'title_ar' => $data['title_ar'],
                    'description_en' => $data['description_en'] ?? null,
                    'description_ar' => $data['description_ar'] ?? null,
                    'is_active' => true,
                    'updated_by' => $userId,
                ]);
            } else {
                $section->update([
                    'badge_en' => $data['badge_en'] ?? $section->badge_en,
                    'badge_ar' => $data['badge_ar'] ?? $section->badge_ar,
                    'title_en' => $data['title_en'] ?? $section->title_en,
                    'title_ar' => $data['title_ar'] ?? $section->title_ar,
                    'description_en' => $data['description_en'] ?? $section->description_en,
                    'description_ar' => $data['description_ar'] ?? $section->description_ar,
                    'updated_by' => $userId,
                ]);
            }

            DB::commit();
            return $section->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function bulkUpdateTestimonials(array $testimonials, ?int $userId = null)
    {
        DB::beginTransaction();
        try {
            $existingIds = collect($testimonials)
                ->filter(fn($t) => isset($t['id']))
                ->pluck('id')
                ->toArray();

            Testimonial::whereNotIn('id', $existingIds)->delete();

            foreach ($testimonials as $index => $data) {
                if (isset($data['id'])) {
                    Testimonial::where('id', $data['id'])->update([
                        'name_en' => $data['name_en'],
                        'name_ar' => $data['name_ar'],
                        'title_en' => $data['title_en'],
                        'title_ar' => $data['title_ar'],
                        'text_en' => $data['text_en'],
                        'text_ar' => $data['text_ar'],
                        'rating' => $data['rating'] ?? 5,
                        'order' => $index,
                        'is_active' => $data['is_active'] ?? true,
                        'updated_by' => $userId,
                    ]);
                } else {
                    Testimonial::create([
                        'name_en' => $data['name_en'],
                        'name_ar' => $data['name_ar'],
                        'title_en' => $data['title_en'],
                        'title_ar' => $data['title_ar'],
                        'text_en' => $data['text_en'],
                        'text_ar' => $data['text_ar'],
                        'rating' => $data['rating'] ?? 5,
                        'order' => $index,
                        'is_active' => $data['is_active'] ?? true,
                        'updated_by' => $userId,
                    ]);
                }
            }

            DB::commit();
            return Testimonial::ordered()->get();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function uploadImage(int $id, UploadedFile $file, ?int $userId = null): Testimonial
    {
        $this->validateImage($file);

        DB::beginTransaction();
        try {
            $testimonial = Testimonial::findOrFail($id);

            if ($testimonial->image_path) {
                $this->deleteImage($testimonial->image_path);
            }

            $filename = 'testimonial_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('images/testimonials', $filename, 'public');

            $publicDir = public_path('images/testimonials');
            if (!file_exists($publicDir)) {
                mkdir($publicDir, 0755, true);
            }
            copy(storage_path('app/public/' . $path), $publicDir . '/' . $filename);

            $testimonial->update([
                'image_path' => $path,
                'image_name' => $filename,
                'updated_by' => $userId,
            ]);

            DB::commit();
            return $testimonial->fresh();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteImage(string $path): void
    {
        Storage::disk('public')->delete($path);
        $publicPath = public_path('images/testimonials/' . basename($path));
        if (file_exists($publicPath)) {
            @unlink($publicPath);
        }
    }

    protected function validateImage(UploadedFile $file): void
    {
        if (!in_array($file->getMimeType(), self::ALLOWED_IMAGE_TYPES)) {
            throw new \Exception('نوع الملف غير مدعوم. الرجاء رفع صورة (JPG, PNG, WEBP)');
        }

        if ($file->getSize() > self::MAX_IMAGE_SIZE) {
            throw new \Exception('حجم الصورة يجب أن لا يتجاوز 5MB');
        }

        $imageInfo = @getimagesize($file->getPathname());
        if (!$imageInfo) {
            throw new \Exception('الملف ليس صورة صالحة');
        }
    }
}