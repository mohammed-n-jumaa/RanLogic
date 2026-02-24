<?php

namespace App\Services;

use App\Models\Certification;
use Illuminate\Support\Facades\DB;

class CertificationService
{
    /**
     * Get all certifications for admin
     */
    public function getAllCertifications()
    {
        return Certification::ordered()->get();
    }

    /**
     * Get active certifications for public
     */
    public function getActiveCertifications(string $locale = 'ar')
    {
        return Certification::active()
            ->ordered()
            ->get()
            ->map(fn($cert) => $cert->toApiArray($locale));
    }

    /**
     * Create certification
     */
    public function createCertification(array $data, ?int $userId = null): Certification
    {
        DB::beginTransaction();

        try {
            // Get next order number
            $maxOrder = Certification::max('order') ?? 0;

            $certification = Certification::create([
                'icon' => $data['icon'] ?? '🎖️',
                'title_en' => $data['title_en'],
                'title_ar' => $data['title_ar'],
                'organization_en' => $data['organization_en'],
                'organization_ar' => $data['organization_ar'],
                'is_verified' => $data['is_verified'] ?? false,
                'order' => $data['order'] ?? ($maxOrder + 1),
                'is_active' => $data['is_active'] ?? true,
                'updated_by' => $userId,
            ]);

            DB::commit();

            return $certification;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update certification
     */
    public function updateCertification(int $id, array $data, ?int $userId = null): Certification
    {
        DB::beginTransaction();

        try {
            $certification = Certification::findOrFail($id);

            $certification->update([
                'icon' => $data['icon'] ?? $certification->icon,
                'title_en' => $data['title_en'] ?? $certification->title_en,
                'title_ar' => $data['title_ar'] ?? $certification->title_ar,
                'organization_en' => $data['organization_en'] ?? $certification->organization_en,
                'organization_ar' => $data['organization_ar'] ?? $certification->organization_ar,
                'is_verified' => $data['is_verified'] ?? $certification->is_verified,
                'order' => $data['order'] ?? $certification->order,
                'is_active' => $data['is_active'] ?? $certification->is_active,
                'updated_by' => $userId,
            ]);

            DB::commit();

            return $certification->fresh();

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete certification
     */
    public function deleteCertification(int $id): bool
    {
        DB::beginTransaction();

        try {
            $certification = Certification::findOrFail($id);
            $certification->delete();

            DB::commit();

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Reorder certifications
     */
    public function reorderCertifications(array $order, ?int $userId = null): bool
    {
        DB::beginTransaction();

        try {
            foreach ($order as $index => $certId) {
                Certification::where('id', $certId)->update([
                    'order' => $index,
                    'updated_by' => $userId,
                ]);
            }

            DB::commit();

            return true;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Bulk update certifications
     */
    public function bulkUpdate(array $certifications, ?int $userId = null): array
    {
        DB::beginTransaction();

        try {
            $updated = [];

            foreach ($certifications as $index => $certData) {
                if (isset($certData['id'])) {
                    // Update existing
                    $cert = $this->updateCertification(
                        $certData['id'],
                        array_merge($certData, ['order' => $index]),
                        $userId
                    );
                } else {
                    // Create new
                    $cert = $this->createCertification(
                        array_merge($certData, ['order' => $index]),
                        $userId
                    );
                }

                $updated[] = $cert;
            }

            // Delete certifications not in the list
            $updatedIds = collect($updated)->pluck('id')->toArray();
            Certification::whereNotIn('id', $updatedIds)->delete();

            DB::commit();

            return $updated;

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}