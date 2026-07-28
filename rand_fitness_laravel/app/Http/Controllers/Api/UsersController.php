<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    /**
     * GET /api/admin/users/all
     */
    public function index(Request $request)
    {
        $query = User::where('role', 'user')
            ->with('subscriptions');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name',  'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($gender = $request->get('gender')) {
            $query->where('gender', $gender);
        }

        if ($goal = $request->get('goal')) {
            $query->where('goal', $goal);
        }

        $perPage = (int) $request->get('per_page', 20);
        $users   = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $data = collect($users->items())->map(function (User $user) {

            // الاشتراك النشط الحالي
            $activeSub = $user->subscriptions
                ->where('status', 'approved')
                ->filter(fn($s) => $s->ends_at && \Carbon\Carbon::parse($s->ends_at)->isFuture())
                ->sortByDesc('ends_at')
                ->first();

            // آخر اشتراك بغض النظر عن الحالة
            $lastSub = $user->subscriptions->sortByDesc('created_at')->first();

            $formatSub = fn($s) => $s ? [
                'id'                  => $s->id,
                'plan_type'           => $s->plan_type,
                'duration'            => $s->duration,
                'amount'              => $s->amount,
                'original_amount'     => $s->original_amount,
                'discount_percentage' => $s->discount_percentage,
                'payment_method'      => $s->payment_method,
                'status'              => $s->status,
                'currency'            => $s->currency,
                'notes'               => $s->notes,
                'bank_transfer_number'=> $s->bank_transfer_number,
                'starts_at'           => $s->starts_at,
                'ends_at'             => $s->ends_at,
                'created_at'          => $s->created_at,
            ] : null;

            return [
                'id'                  => $user->id,
                'name'                => $user->name,
                'email'               => $user->email,
                'phone'               => $user->phone,
                'gender'              => $user->gender,
                'age'                 => $user->age,
                'goal'                => $user->goal,
                'workout_place'       => $user->workout_place,
                'program'             => $user->program,
                'height'              => $user->height,
                'weight'              => $user->weight,
                'waist'               => $user->waist,
                'hips'                => $user->hips,
                'health_notes'        => $user->health_notes,
                'avatar_url'          => $user->avatar_url,
                'is_active'           => $user->is_active,
                'created_at'          => $user->created_at,
                'subscriptions_count' => $user->subscriptions->count(),
                'active_subscription' => $formatSub($activeSub),
                'last_subscription'   => $formatSub($lastSub),
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
            'meta'    => [
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
        ]);
    }
}