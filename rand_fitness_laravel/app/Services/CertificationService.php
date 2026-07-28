<?php

namespace App\Services;

use App\Models\Certification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CertificationService
{
    const CACHE_KEY = 'certifications';
    const CACHE_TTL = 3600; // 1 hour

    // -------------------------------------------------------------------------
    // READ
    // -------------------------------------------------------------------------

    /**
     * Get all certifications for admin (no cache — admin needs fresh data).
     */
    public function getAllCertifications(): Collection
    {
        return Certification::ordered()->get();
    }

    /**
     * Get active certifications for public (cached).
     */
    public function getActiveCertifications(string $locale = 'ar'): Collection
    {
        return Cache::remember(self::CACHE_KEY . ":{$locale}", self::CACHE_TTL, function () use ($locale) {
            return Certification::active()
                ->ordered()
                ->get()
                ->map(fn($cert) => $cert->toApiArray($locale));
        });
    }

    // -------------------------------------------------------------------------
    // WRITE
    // -------------------------------------------------------------------------

    /**
     * Create a new certification.
     */
    public function createCertification(array $data, ?int $userId = null): Certification
    {
        $cert = Certification::create([
            'icon'            => $data['icon']            ?? '🎖️',
            'title_en'        => $data['title_en'],
            'title_ar'        => $data['title_ar'],
            'organization_en' => $data['organization_en'],
            'organization_ar' => $data['organization_ar'],
            'is_verified'     => $data['is_verified']     ?? false,
            'is_active'       => $data['is_active']       ?? true,
            'order'           => $data['order']           ?? $this->nextOrder(),
            'updated_by'      => $userId,
        ]);

        $this->clearCache();

        return $cert;
    }

    /**
     * Update an existing certification.
     */
    public function updateCertification(int $id, array $data, ?int $userId = null): Certification
    {
        $cert = Certification::findOrFail($id);

        $cert->update([
            'icon'            => $data['icon']            ?? $cert->icon,
            'title_en'        => $data['title_en']        ?? $cert->title_en,
            'title_ar'        => $data['title_ar']        ?? $cert->title_ar,
            'organization_en' => $data['organization_en'] ?? $cert->organization_en,
            'organization_ar' => $data['organization_ar'] ?? $cert->organization_ar,
            'is_verified'     => $data['is_verified']     ?? $cert->is_verified,
            'is_active'       => $data['is_active']       ?? $cert->is_active,
            'order'           => $data['order']           ?? $cert->order,
            'updated_by'      => $userId,
        ]);

        $this->clearCache();

        return $cert->fresh();
    }

    /**
     * Delete a certification.
     */
    public function deleteCertification(int $id): void
    {
        Certification::findOrFail($id)->delete();

        $this->clearCache();
    }

    /**
     * Reorder certifications using a single bulk query.
     */
    public function reorderCertifications(array $orderedIds, ?int $userId = null): void
    {
        // Build CASE WHEN ... END for a single UPDATE query
        $cases  = '';
        $bindings = [];

        foreach ($orderedIds as $index => $certId) {
            $cases      .= " WHEN id = ? THEN ?";
            $bindings[]  = $certId;
            $bindings[]  = $index;
        }

        $ids = implode(',', array_fill(0, count($orderedIds), '?'));

        DB::statement(
            "UPDATE certifications SET `order` = CASE {$cases} END WHERE id IN ({$ids})",
            array_merge($bindings, $orderedIds)
        );

        $this->clearCache();
    }

    /**
     * Bulk upsert certifications and delete those not in the list.
     */
    public function bulkUpdate(array $certifications, ?int $userId = null): Collection
    {
        DB::beginTransaction();

        try {
            $upserted = collect();

            foreach ($certifications as $index => $data) {
                $cert = Certification::updateOrCreate(
                    ['id' => $data['id'] ?? null],
                    [
                        'icon'            => $data['icon']            ?? '🎖️',
                        'title_en'        => $data['title_en'],
                        'title_ar'        => $data['title_ar'],
                        'organization_en' => $data['organization_en'],
                        'organization_ar' => $data['organization_ar'],
                        'is_verified'     => $data['is_verified']     ?? false,
                        'is_active'       => $data['is_active']       ?? true,
                        'order'           => $index,
                        'updated_by'      => $userId,
                    ]
                );

                $upserted->push($cert);
            }

            // Remove certifications no longer in the list
            $keepIds = $upserted->pluck('id')->all();
            Certification::whereNotIn('id', $keepIds)->delete();

            DB::commit();

            $this->clearCache();

            return $upserted;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    // -------------------------------------------------------------------------
    // PRIVATE HELPERS
    // -------------------------------------------------------------------------

    private function nextOrder(): int
    {
        return (Certification::max('order') ?? 0) + 1;
    }

    private function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . ':ar');
        Cache::forget(self::CACHE_KEY . ':en');
    }
}