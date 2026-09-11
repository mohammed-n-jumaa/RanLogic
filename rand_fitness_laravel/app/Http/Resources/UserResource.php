<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Unified user response shape used across Auth/Profile endpoints.
 *
 * Usage:
 *   new UserResource($user)                         // full profile (used by me(), profile update)
 *   (new UserResource($user))->minimal()             // compact shape (used by login/register)
 *   (new UserResource($user))->onlyAvatar()          // avatar-only shape (used by photo upload)
 */
class UserResource extends JsonResource
{
    protected string $variant = 'full';

    public function minimal(): static
    {
        $this->variant = 'minimal';
        return $this;
    }

    public function onlyAvatar(): static
    {
        $this->variant = 'avatar';
        return $this;
    }

    public function toArray(Request $request): array
    {
        return match ($this->variant) {
            'minimal' => $this->minimalShape(),
            'avatar'  => $this->avatarShape(),
            default   => $this->fullShape(),
        };
    }

    /**
     * Used by login() and register() — compact shape, no body-composition fields.
     */
    protected function minimalShape(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'gender' => $this->gender,
            'avatar_url' => $this->avatar_url,
            'language' => $this->language ?? 'ar',
            ...$this->subscriptionFields(),
        ];
    }

    /**
     * Used by me() and profile update — full profile including body metrics.
     */
    protected function fullShape(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'gender' => $this->gender,
            'age' => $this->age,
            'height' => $this->height,
            'weight' => $this->weight,
            'waist' => $this->waist,
            'hips' => $this->hips,
            'goal' => $this->goal,
            'workout_place' => $this->workout_place,
            'health_notes' => $this->health_notes,
            'program' => $this->program,
            'avatar_url' => $this->avatar_url,
            'language' => $this->language ?? 'ar',
            'is_active' => $this->is_active,
            ...$this->subscriptionFields(withStatus: true),
            'email_verified_at' => $this->email_verified_at,
        ];
    }

    /**
     * Used by photo upload confirmation — minimal, avatar-focused.
     */
    protected function avatarShape(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar_url' => $this->avatar_url,
            ...$this->subscriptionFields(),
        ];
    }

    /**
     * Shared subscription fields — reads from the eager-loaded activeSubscription relation.
     */
    protected function subscriptionFields(bool $withStatus = false): array
    {
        $sub = $this->activeSubscription;

        $fields = [
            'has_active_subscription' => $this->has_active_subscription,
            'subscription_start_date' => $sub?->starts_at,
            'subscription_end_date' => $sub?->ends_at,
            'subscription_plan_type' => $sub?->plan_type,
        ];

        if ($withStatus) {
            $fields['subscription_status'] = $sub?->status;
        }

        return $fields;
    }
}