<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\Challenge;
use App\Models\User;
use App\Models\WaterLog;
use App\Models\WeightLog;
use App\Models\ProgressPhoto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TraineeProgressController extends Controller
{
    public function show(int $userId): JsonResponse
    {
        $user = User::findOrFail($userId);

        $weights = WeightLog::where('user_id', $userId)
            ->orderBy('logged_at')->limit(12)
            ->get(['weight', 'logged_at'])->toArray();

        $startOfWeek = now()->startOfWeek(Carbon::SUNDAY);
        $completedDates = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->where('workout_exercises.completed', true)
            ->whereBetween('workout_exercises.completed_at', [$startOfWeek, $startOfWeek->copy()->addDays(6)->endOfDay()])
            ->selectRaw('DATE(workout_exercises.completed_at) as d')
            ->distinct()->pluck('d')->toArray();

        $days = [];
        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);
            $ds = $date->toDateString();
            $days[] = [
                'date' => $ds,
                'status' => $date->isToday() ? 'today' : ($date->isFuture() ? 'future' : (in_array($ds, $completedDates) ? 'done' : 'missed')),
            ];
        }

        $streakCount = 0;
        $check = now()->subDay();
        while (DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->where('workout_exercises.completed', true)
            ->whereDate('workout_exercises.completed_at', $check->toDateString())->exists()) {
            $streakCount++;
            $check->subDay();
        }

        $waterLogs = WaterLog::where('user_id', $userId)
            ->where('logged_at', '>=', now()->subDays(7))
            ->orderBy('logged_at')
            ->get(['cups', 'goal', 'logged_at'])->toArray();

        $challenges = Challenge::where('is_active', true)->get()->map(function ($c) use ($userId) {
            $pivot = DB::table('challenge_user')->where('user_id', $userId)->where('challenge_id', $c->id)->first();
            return [
                'id' => $c->id, 'name_ar' => $c->name_ar, 'name_en' => $c->name_en,
                'icon' => $c->icon, 'color' => $c->color, 'duration_days' => $c->duration_days,
                'completed_days' => $pivot->completed_days ?? 0, 'is_joined' => $pivot !== null,
            ];
        });

        $badges = Badge::select('badges.*', 'badge_user.earned_at')
            ->leftJoin('badge_user', fn($j) => $j->on('badges.id', '=', 'badge_user.badge_id')->where('badge_user.user_id', $userId))
            ->get()->map(fn($b) => [
                'id' => $b->id, 'key' => $b->key, 'name_ar' => $b->name_ar, 'icon' => $b->icon,
                'earned' => $b->earned_at !== null, 'earned_at' => $b->earned_at,
            ]);

        $photos = ProgressPhoto::where('user_id', $userId)->orderBy('taken_at')
            ->get()->map(fn($p) => [
                'id' => $p->id, 'photo_url' => $p->photo_url, 'weight_at_photo' => $p->weight_at_photo,
                'taken_at' => $p->taken_at, 'marketing_consent' => (bool) $p->marketing_consent,
            ]);

        $weekStart = now()->startOfWeek(Carbon::SUNDAY);
        $weekEnd = now()->endOfWeek(Carbon::SATURDAY);
        $total = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->whereBetween('workout_exercises.created_at', [$weekStart, $weekEnd])->count();
        $done = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)->where('workout_exercises.completed', true)
            ->whereBetween('workout_exercises.completed_at', [$weekStart, $weekEnd])->count();
        $avgWater = WaterLog::where('user_id', $userId)->whereBetween('logged_at', [$weekStart, $weekEnd])->avg('cups') ?? 0;
        $lastTwo = WeightLog::where('user_id', $userId)->orderByDesc('logged_at')->limit(2)->pluck('weight')->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'weight_chart' => $weights,
                'streak' => ['days' => $days, 'count' => $streakCount],
                'water_logs' => $waterLogs,
                'challenges' => $challenges,
                'badges' => $badges,
                'photos' => $photos,
                'marketing_consent' => (bool) $user->marketing_consent,
                'report' => [
                    'exercise_rate' => $total > 0 ? round(($done / $total) * 100) : 0,
                    'avg_water' => round($avgWater, 1),
                    'weight_change' => count($lastTwo) === 2 ? round($lastTwo[0] - $lastTwo[1], 1) : null,
                    'badges_earned' => $badges->where('earned', true)->count(),
                    'badges_total' => $badges->count(),
                ],
            ],
        ]);
    }

    public function awardBadge(Request $request, int $userId): JsonResponse
    {
        $data = $request->validate(['badge_id' => 'required|exists:badges,id']);
        DB::table('badge_user')->updateOrInsert(
            ['user_id' => $userId, 'badge_id' => $data['badge_id']],
            ['earned_at' => now()]
        );
        return response()->json(['success' => true]);
    }

    public function revokeBadge(int $userId, int $badgeId): JsonResponse
    {
        DB::table('badge_user')->where('user_id', $userId)->where('badge_id', $badgeId)->delete();
        return response()->json(['success' => true]);
    }

    public function createChallenge(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name_ar' => 'required|string|max:191',
            'name_en' => 'required|string|max:191',
            'duration_days' => 'required|integer|min:1|max:365',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
        ]);
        $challenge = Challenge::create(array_merge($data, ['is_active' => true]));
        return response()->json(['success' => true, 'data' => $challenge]);
    }

    public function deleteChallenge(int $id): JsonResponse
    {
        Challenge::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
    
    public function updateChallenge(Request $request, int $id): JsonResponse
{
    $data = $request->validate([
        'name_ar'       => 'sometimes|string|max:191',
        'name_en'       => 'sometimes|string|max:191',
        'duration_days' => 'sometimes|integer|min:1|max:365',
        'color'         => 'sometimes|string|max:20',
        'is_active'     => 'sometimes|boolean',
    ]);

    $challenge = Challenge::findOrFail($id);
    $challenge->update($data);

    return response()->json(['success' => true, 'data' => $challenge]);
}
}