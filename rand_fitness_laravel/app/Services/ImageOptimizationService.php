<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ImageOptimizationService
{
    protected ImageManager $manager;

    public function __construct()
    {
        $this->manager = new ImageManager(new Driver());
    }

    /**
     * Resize (if needed) and compress an uploaded image, then save it to the
     * given disk/path. Returns the same $path that was passed in.
     *
     * - Only downsizes images larger than $maxWidth/$maxHeight — never upscales.
     * - Skips SVG files entirely (vector format, nothing to compress).
     * - On any failure, logs the error and leaves the original file untouched
     *   so the upload never fails because of an optimization issue.
     *
     * @param UploadedFile $file       The uploaded file (already stored via ->store()/->storeAs())
     * @param string       $storedPath The path returned by store()/storeAs(), e.g. "avatars/xyz.jpg"
     * @param string       $disk       Filesystem disk name, e.g. "public"
     * @param int          $maxWidth   Max width in pixels (default 1600 — generous for web use)
     * @param int          $maxHeight  Max height in pixels (default 1600)
     * @param int          $quality    JPEG/WEBP quality 1-100 (default 85 — visually lossless for most photos)
     */
    public function optimize(
        UploadedFile $file,
        string $storedPath,
        string $disk = 'public',
        int $maxWidth = 1600,
        int $maxHeight = 1600,
        int $quality = 85
    ): void {
        // Vector images have nothing to resize/compress — skip entirely
        if ($file->getMimeType() === 'image/svg+xml') {
            return;
        }

        // Only handle raster image types we know how to re-encode
        $supportedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!in_array($file->getMimeType(), $supportedMimes, true)) {
            return;
        }

        try {
            $fullPath = \Storage::disk($disk)->path($storedPath);

            $image = $this->manager->read($fullPath);

            // Only downscale if the image is actually larger than the target box.
            // scaleDown() preserves aspect ratio and never upscales.
            $image->scaleDown($maxWidth, $maxHeight);

            $extension = strtolower(pathinfo($storedPath, PATHINFO_EXTENSION));

            $encoded = match ($extension) {
                'png'  => $image->toPng(),
                'webp' => $image->toWebp($quality),
                default => $image->toJpeg($quality),
            };

            $encoded->save($fullPath);

        } catch (\Throwable $e) {
            // Never let an optimization failure break the upload itself —
            // the original stored file remains valid and usable.
            Log::warning('Image optimization skipped: ' . $e->getMessage(), [
                'path' => $storedPath,
            ]);
        }
    }
}