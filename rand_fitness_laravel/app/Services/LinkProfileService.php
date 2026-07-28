<?php

namespace App\Services;

use App\Models\LinkProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class LinkProfileService
{
    private const AVATAR_DISK   = 'public';
    private const AVATAR_FOLDER = 'link_avatars';

    public function get(): LinkProfile
    {
        return LinkProfile::firstOrCreate([], [
            'name' => '', 'bio' => '',
        ]);
    }

    public function update(array $data): LinkProfile
    {
        $profile = $this->get();
        
        $cleanedData = [];
        foreach ($data as $key => $value) {
            $cleanedData[$key] = ($value === null) ? '' : $value;
        }
        
        $profile->update($cleanedData);
        return $profile->fresh();
    }

    public function uploadAvatar(UploadedFile $file): LinkProfile
    {
        $profile = $this->get();

        $this->deleteAvatarFile($profile->avatar);

        $path = $file->store(self::AVATAR_FOLDER, self::AVATAR_DISK);

        $profile->update([
            'avatar' => Storage::disk(self::AVATAR_DISK)->url($path),
        ]);

        return $profile->fresh();
    }

    public function deleteAvatar(): LinkProfile
    {
        $profile = $this->get();

        $this->deleteAvatarFile($profile->avatar);

        $profile->update(['avatar' => null]);

        return $profile->fresh();
    }

    private function deleteAvatarFile(?string $url): void
    {
        if (!$url) return;

        $relativePath = ltrim(
            str_replace(Storage::disk(self::AVATAR_DISK)->url(''), '', $url),
            '/'
        );

        if (Storage::disk(self::AVATAR_DISK)->exists($relativePath)) {
            Storage::disk(self::AVATAR_DISK)->delete($relativePath);
        }
    }
}