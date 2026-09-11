<?php

namespace App\Services;

use App\Models\Logo;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LogoService
{
    protected ImageOptimizationService $imageOptimizer;

    public function __construct(ImageOptimizationService $imageOptimizer)
    {
        $this->imageOptimizer = $imageOptimizer;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const ALLOWED_MIMES = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/svg+xml',
        'image/webp'
    ];

    /**
     * Upload and store a new logo.
     * حفظ في storage + نسخة في public (حل لـ Windows/WAMP)
     */
    public function uploadLogo(UploadedFile $file, ?string $uploadedBy = null): Logo
    {
        $this->validateFile($file);

        DB::beginTransaction();

        try {
            // Deactivate all previous logos
            Logo::where('is_active', true)->update(['is_active' => false]);

            // Generate unique filename
            $filename = $this->generateUniqueFilename($file);

            // Sanitize SVG content to strip embedded scripts before storing
            if ($file->getMimeType() === 'image/svg+xml') {
                $this->sanitizeSvgFile($file);
            }
            
            // Store in storage/app/public/logos
            $path = $file->storeAs('logos', $filename, 'public');

            // Resize/compress the stored image (skips SVG automatically)
            $this->imageOptimizer->optimize($file, $path, 'public', maxWidth: 800, maxHeight: 800);

            // حفظ نسخة في public/logos (حل للـ Windows/WAMP)
            $publicLogoDir = public_path('logos');
            if (!is_dir($publicLogoDir)) {
                mkdir($publicLogoDir, 0755, true);
            }
            
            // نسخ الملف إلى public
            $storagePath = storage_path('app/public/' . $path);
            $publicPath = public_path('logos/' . $filename);
            
            if (file_exists($storagePath)) {
                copy($storagePath, $publicPath);
            }

            // Get image dimensions
            $dimensions = $this->getImageDimensions($file);

            // Create logo record
            $logo = Logo::create([
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'width' => $dimensions['width'] ?? null,
                'height' => $dimensions['height'] ?? null,
                'is_active' => true,
                'uploaded_by' => $uploadedBy,
            ]);

            DB::commit();

            return $logo;

        } catch (\Exception $e) {
            DB::rollBack();
            
            // Delete uploaded file if exists
            if (isset($path) && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
            
            // Delete from public if copied
            if (isset($filename)) {
                $publicPath = public_path('logos/' . $filename);
                if (file_exists($publicPath)) {
                    unlink($publicPath);
                }
            }

            throw $e;
        }
    }

    /**
     * Get the currently active logo.
     */
    public function getActiveLogo(): ?Logo
    {
        return Logo::active()->latest()->first();
    }

    /**
     * Delete a logo.
     */
    public function deleteLogo(int $logoId): bool
    {
        $logo = Logo::findOrFail($logoId);

        DB::beginTransaction();

        try {
            // Delete from storage
            if (Storage::disk('public')->exists($logo->file_path)) {
                Storage::disk('public')->delete($logo->file_path);
            }
            
            // Delete from public
            $publicPath = public_path('logos/' . basename($logo->file_path));
            if (file_exists($publicPath)) {
                unlink($publicPath);
            }

            // Delete record
            $logo->delete();

            DB::commit();

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Validate uploaded file.
     */
    private function validateFile(UploadedFile $file): void
    {
        if ($file->getSize() > self::MAX_FILE_SIZE) {
            throw new \Exception('حجم الملف يتجاوز الحد المسموح (5MB).');
        }

        if (!in_array($file->getMimeType(), self::ALLOWED_MIMES)) {
            throw new \Exception('نوع الملف غير مدعوم.');
        }

        if (!$file->isValid()) {
            throw new \Exception('الملف المرفوع غير صالح.');
        }
    }

    /**
     * Generate unique filename for the logo.
     */
    private function generateUniqueFilename(UploadedFile $file): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');
        $random = Str::random(8);
        
        return "logo_{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Get image dimensions.
     */
    private function getImageDimensions(UploadedFile $file): ?array
    {
        if ($file->getMimeType() === 'image/svg+xml') {
            return null;
        }

        try {
            $imageSize = getimagesize($file->getRealPath());
            
            return [
                'width' => $imageSize[0] ?? null,
                'height' => $imageSize[1] ?? null,
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get all logos with pagination.
     */
    public function getAllLogos(int $perPage = 10)
    {
        return Logo::latest()->paginate($perPage);
    }

    /**
     * Activate a specific logo.
     */
    public function activateLogo(int $logoId): Logo
    {
        DB::beginTransaction();

        try {
            Logo::where('is_active', true)->update(['is_active' => false]);

            $logo = Logo::findOrFail($logoId);
            $logo->update(['is_active' => true]);

            DB::commit();

            return $logo;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Strip <script> tags, event handler attributes (onclick, onload...),
     * and javascript: URIs from an uploaded SVG file in-place.
     * Prevents stored XSS via malicious SVG uploads.
     */
    private function sanitizeSvgFile(UploadedFile $file): void
    {
        $content = file_get_contents($file->getRealPath());

        if ($content === false) {
            return;
        }

        // Remove <script>...</script> blocks
        $content = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $content);

        // Remove on* event handler attributes (onclick, onload, onerror, ...)
        $content = preg_replace('/\son\w+\s*=\s*("[^"]*"|\'[^\']*\')/i', '', $content);

        // Remove javascript: URIs
        $content = preg_replace('/(xlink:href|href)\s*=\s*(["\'])\s*javascript:[^"\']*\2/i', '', $content);

        // Remove <foreignObject> which can embed arbitrary HTML/JS
        $content = preg_replace('/<foreignObject\b[^>]*>.*?<\/foreignObject>/is', '', $content);

        file_put_contents($file->getRealPath(), $content);
    }
}