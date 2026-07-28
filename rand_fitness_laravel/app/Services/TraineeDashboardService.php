<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\BodyMeasurement;
use App\Models\Challenge;
use App\Models\ProgressPhoto;
use App\Models\WaterLog;
use App\Models\WeightLog;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TraineeDashboardService
{
    public function getDashboardData(int $userId): array
    {
        $user = \App\Models\User::find($userId);
        $activeSubscription = \App\Models\Subscription::where('user_id', $userId)
            ->where('status', 'approved')
            ->where('ends_at', '>=', now())
            ->latest()
            ->first();

        return [
            'user_info' => [
                'name'           => $user->name,
                'height'         => $user->height,
                'weight'         => $user->weight,
                'waist'          => $user->waist,
                'hips'           => $user->hips,
                'age'            => $user->age,
                'gender'         => $user->gender,
                'goal'           => $user->goal,
                'workout_place'  => $user->workout_place,
                'health_notes'   => $user->health_notes,
                'program'        => $user->program,
            ],
            'subscription' => [
                'active'     => $user->has_active_subscription,
                'program'    => $user->program,
                'start_date' => $activeSubscription?->starts_at,
                'end_date'   => $activeSubscription?->ends_at,
            ],
            'weight_chart'     => $this->getWeightChart($userId),
            'progress_photos'  => $this->getProgressPhotos($userId),
            'streak'           => $this->getStreak($userId),
            'water'            => $this->getTodayWater($userId),
            'measurements'     => $this->getLatestMeasurements($userId),
            'challenges'       => $this->getActiveChallenges($userId),
            'heatmap'          => $this->getHeatmap($userId),
            'workout_calendar' => $this->getWorkoutCalendar($userId),
            'badges'           => $this->getBadges($userId),
            'weekly_report'    => $this->getWeeklyReport($userId),
        ];
    }

    private function getWeightChart(int $userId): array
    {
        return WeightLog::where('user_id', $userId)
            ->orderBy('logged_at')
            ->limit(12)
            ->get(['weight', 'logged_at'])
            ->toArray();
    }

    private function getProgressPhotos(int $userId): array
    {
        return ProgressPhoto::where('user_id', $userId)
            ->orderBy('taken_at')
            ->limit(6)
            ->get()
            ->toArray();
    }

    private function getStreak(int $userId): array
    {
        $startOfWeek = now()->startOfWeek(Carbon::SUNDAY);
        $days = [];

        $completedDates = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->where('workout_exercises.completed', true)
            ->whereBetween('workout_exercises.completed_at', [
                $startOfWeek,
                $startOfWeek->copy()->addDays(6)->endOfDay(),
            ])
            ->selectRaw('DATE(workout_exercises.completed_at) as d')
            ->distinct()
            ->pluck('d')
            ->toArray();

        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);
            $dateStr = $date->toDateString();

            if ($date->isToday()) {
                $status = 'today';
            } elseif ($date->isFuture()) {
                $status = 'future';
            } elseif (in_array($dateStr, $completedDates)) {
                $status = 'done';
            } else {
                $status = 'missed';
            }

            $days[] = ['date' => $dateStr, 'status' => $status];
        }

        // حساب streak متتالي
        $streakCount = 0;
        $checkDate = now()->subDay();

        while (true) {
            $exists = DB::table('workout_exercises')
                ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
                ->where('workout_plans.user_id', $userId)
                ->where('workout_exercises.completed', true)
                ->whereDate('workout_exercises.completed_at', $checkDate->toDateString())
                ->exists();

            if (!$exists) break;

            $streakCount++;
            $checkDate->subDay();
        }

        return ['days' => $days, 'count' => $streakCount];
    }

    private function getTodayWater(int $userId): array
    {
        $log = WaterLog::firstOrCreate(
            ['user_id' => $userId, 'logged_at' => today()],
            ['cups' => 0, 'goal' => 8]
        );

        return ['cups' => $log->cups, 'goal' => $log->goal];
    }

    private function getLatestMeasurements(int $userId): array
    {
        $user = \App\Models\User::select('weight', 'height', 'waist', 'hips', 'gender', 'marketing_consent')
            ->find($userId);

        return [
            'weight'            => $user->weight,
            'height'            => $user->height,
            'waist'             => $user->waist,
            'hips'              => $user->hips,
            'gender'            => $user->gender,
            'marketing_consent' => (bool) $user->marketing_consent,
        ];
    }

    private function getActiveChallenges(int $userId): array
    {
        return Challenge::where('is_active', true)
            ->get()
            ->map(function ($c) use ($userId) {
                $pivot = DB::table('challenge_user')
                    ->where('user_id', $userId)
                    ->where('challenge_id', $c->id)
                    ->first();

                return [
                    'id'             => $c->id,
                    'name_ar'        => $c->name_ar,
                    'name_en'        => $c->name_en,
                    'icon'           => $c->icon,
                    'color'          => $c->color,
                    'duration_days'  => $c->duration_days,
                    'completed_days' => $pivot->completed_days ?? 0,
                    'is_joined'      => $pivot !== null,
                ];
            })
            ->toArray();
    }

    private function getHeatmap(int $userId): array
    {
        $from = now()->subMonths(3)->startOfMonth();

        return DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->where('workout_exercises.completed', true)
            ->where('workout_exercises.completed_at', '>=', $from)
            ->selectRaw('DATE(workout_exercises.completed_at) as date, COUNT(*) as count')
            ->groupByRaw('DATE(workout_exercises.completed_at)')
            ->pluck('count', 'date')
            ->toArray();
    }

    private function getWorkoutCalendar(int $userId): array
    {
        $start = now()->startOfMonth();
        $end = now()->endOfMonth();

        $workoutDates = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->where('workout_exercises.completed', true)
            ->whereBetween('workout_exercises.completed_at', [$start, $end])
            ->selectRaw('DISTINCT DATE(workout_exercises.completed_at) as date')
            ->pluck('date')
            ->toArray();

        return [
            'year'          => now()->year,
            'month'         => now()->month,
            'workout_dates' => $workoutDates,
        ];
    }

    private function getBadges(int $userId): array
    {
        return Badge::select('badges.*', 'badge_user.earned_at')
            ->leftJoin('badge_user', function ($j) use ($userId) {
                $j->on('badges.id', '=', 'badge_user.badge_id')
                    ->where('badge_user.user_id', $userId);
            })
            ->get()
            ->map(fn($b) => [
                'key'       => $b->key,
                'name_ar'   => $b->name_ar,
                'name_en'   => $b->name_en,
                'icon'      => $b->icon,
                'earned'    => $b->earned_at !== null,
                'earned_at' => $b->earned_at,
            ])
            ->toArray();
    }

    private function getWeeklyReport(int $userId): array
    {
        $weekStart = now()->startOfWeek(Carbon::SUNDAY);
        $weekEnd = now()->endOfWeek(Carbon::SATURDAY);

        $totalExercises = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->whereBetween('workout_exercises.created_at', [$weekStart, $weekEnd])
            ->count();

        $completedExercises = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->where('workout_exercises.completed', true)
            ->whereBetween('workout_exercises.completed_at', [$weekStart, $weekEnd])
            ->count();

        $avgWater = WaterLog::where('user_id', $userId)
            ->whereBetween('logged_at', [$weekStart, $weekEnd])
            ->avg('cups') ?? 0;

        $workoutDays = DB::table('workout_exercises')
            ->join('workout_plans', 'workout_plans.id', '=', 'workout_exercises.workout_plan_id')
            ->where('workout_plans.user_id', $userId)
            ->where('workout_exercises.completed', true)
            ->whereBetween('workout_exercises.completed_at', [$weekStart, $weekEnd])
            ->selectRaw('COUNT(DISTINCT DATE(workout_exercises.completed_at)) as days')
            ->value('days');

        $lastTwo = WeightLog::where('user_id', $userId)
            ->orderByDesc('logged_at')
            ->limit(2)
            ->pluck('weight')
            ->toArray();

        $weightChange = count($lastTwo) === 2
            ? round($lastTwo[0] - $lastTwo[1], 1)
            : null;

        return [
            'exercise_rate' => $totalExercises > 0
                ? round(($completedExercises / $totalExercises) * 100)
                : 0,
            'workout_days'  => $workoutDays ?? 0,
            'avg_water'     => round($avgWater, 1),
            'weight_change' => $weightChange,
        ];
    }
}
