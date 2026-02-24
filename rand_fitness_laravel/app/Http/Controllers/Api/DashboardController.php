<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subscription;
use App\Models\WorkoutPlan;
use App\Models\WorkoutExercise;
use App\Models\NutritionPlan;
use App\Models\NutritionItem;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard metrics from real database
     */
    public function getMetrics(Request $request)
    {
        try {
            // Total active subscriptions
            $totalSubscriptions = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '>=', Carbon::now())
                ->count();

            // New registrations this week
            $newRegistrations = User::where('role', 'user')
                ->whereBetween('created_at', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ])
                ->count();

            // Total revenue from approved subscriptions this month
            $totalRevenue = Subscription::where('status', 'approved')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('amount');

            // Average subscription duration in months
            $avgSubscriptionDuration = Subscription::where('status', 'approved')
                ->whereNotNull('ends_at')
                ->whereNotNull('starts_at')
                ->selectRaw('AVG(DATEDIFF(ends_at, starts_at) / 30) as avg_months')
                ->first()->avg_months ?? 0;

            // Completion rate from workout exercises
            $totalExercises = WorkoutExercise::count();
            $completedExercises = WorkoutExercise::where('completed', true)->count();
            $completionRate = $totalExercises > 0 
                ? round(($completedExercises / $totalExercises) * 100) 
                : 0;

            // Previous period changes
            $lastWeekSubscriptions = Subscription::where('status', 'approved')
                ->whereBetween('created_at', [
                    Carbon::now()->subWeek()->startOfWeek(),
                    Carbon::now()->subWeek()->endOfWeek()
                ])
                ->count();

            $lastWeekRegistrations = User::where('role', 'user')
                ->whereBetween('created_at', [
                    Carbon::now()->subWeek()->startOfWeek(),
                    Carbon::now()->subWeek()->endOfWeek()
                ])
                ->count();

            $lastMonthRevenue = Subscription::where('status', 'approved')
                ->whereMonth('created_at', Carbon::now()->subMonth()->month)
                ->whereYear('created_at', Carbon::now()->subMonth()->year)
                ->sum('amount');

            $subscriptionsChange = $lastWeekSubscriptions > 0 
                ? round((($totalSubscriptions - $lastWeekSubscriptions) / $lastWeekSubscriptions) * 100) 
                : ($totalSubscriptions > 0 ? 100 : 0);

            $registrationsChange = $lastWeekRegistrations > 0 
                ? round((($newRegistrations - $lastWeekRegistrations) / $lastWeekRegistrations) * 100) 
                : ($newRegistrations > 0 ? 100 : 0);

            $revenueChange = $lastMonthRevenue > 0 
                ? round((($totalRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100) 
                : ($totalRevenue > 0 ? 100 : 0);

            return response()->json([
                'success' => true,
                'data' => [
                    'totalSubscriptions' => $totalSubscriptions,
                    'newRegistrations' => $newRegistrations,
                    'totalRevenue' => (float) $totalRevenue,
                    'avgSubscriptionDuration' => round($avgSubscriptionDuration, 1),
                    'completionRate' => $completionRate,
                    'previousPeriodChange' => [
                        'subscriptions' => $subscriptionsChange,
                        'revenue' => $revenueChange,
                        'registrations' => $registrationsChange
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard metrics error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch metrics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get growth data (subscriptions over time)
     */
    public function getGrowthData(Request $request)
    {
        try {
            $period = $request->get('period', 'this_month');
            
            // تحديد الفترة الزمنية
            $endDate = Carbon::now();
            switch ($period) {
                case 'this_week':
                    $startDate = Carbon::now()->startOfWeek();
                    $format = 'l'; // اسم اليوم
                    break;
                case 'last_3_months':
                    $startDate = Carbon::now()->subMonths(3);
                    $format = 'F'; // اسم الشهر
                    break;
                case 'this_year':
                    $startDate = Carbon::now()->startOfYear();
                    $format = 'F';
                    break;
                default: // this_month
                    $startDate = Carbon::now()->startOfMonth();
                    $format = 'j F'; // اليوم والشهر
                    break;
            }

            // جلب بيانات الاشتراكات حسب الفترة
            $subscriptions = Subscription::where('status', 'approved')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // تحويل البيانات للصيغة المطلوبة
            $data = [];
            $currentDate = $startDate->copy();
            
            while ($currentDate <= $endDate) {
                $dateStr = $currentDate->toDateString();
                $count = $subscriptions->where('date', $dateStr)->sum('count');
                
                // تنسيق التسمية حسب الفترة
                $label = $currentDate->translatedFormat($format);
                
                $data[] = [
                    'date' => $label,
                    'subscriptions' => $count
                ];
                
                if ($period === 'this_week') {
                    $currentDate->addDay();
                } else {
                    $currentDate->addMonth();
                }
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard growth data error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch growth data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get revenue data
     */
    public function getRevenueData(Request $request)
    {
        try {
            $period = $request->get('period', 'this_week');
            
            // تحديد الفترة الزمنية
            $endDate = Carbon::now();
            switch ($period) {
                case 'this_week':
                    $startDate = Carbon::now()->startOfWeek();
                    $format = 'l';
                    break;
                case 'last_3_months':
                    $startDate = Carbon::now()->subMonths(3);
                    $format = 'F';
                    break;
                case 'this_year':
                    $startDate = Carbon::now()->startOfYear();
                    $format = 'F';
                    break;
                default: // this_month
                    $startDate = Carbon::now()->startOfMonth();
                    $format = 'j F';
                    break;
            }

            // جلب بيانات الدخل
            $revenues = Subscription::where('status', 'approved')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, SUM(amount) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // تحويل البيانات للصيغة المطلوبة
            $data = [];
            $currentDate = $startDate->copy();
            
            while ($currentDate <= $endDate) {
                $dateStr = $currentDate->toDateString();
                $total = $revenues->where('date', $dateStr)->sum('total');
                
                $label = $currentDate->translatedFormat($format);
                
                $data[] = [
                    'day' => $label,
                    'revenue' => (float) $total
                ];
                
                if ($period === 'this_week') {
                    $currentDate->addDay();
                } else {
                    $currentDate->addMonth();
                }
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard revenue data error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch revenue data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment status distribution
     */
    public function getPaymentStatusData()
    {
        try {
            $statuses = [
                ['name' => 'مدفوع', 'value' => 0, 'color' => '#4caf50'],
                ['name' => 'قيد الانتظار', 'value' => 0, 'color' => '#ff9800'],
                ['name' => 'منتهي', 'value' => 0, 'color' => '#f44336'],
                ['name' => 'ملغي', 'value' => 0, 'color' => '#9e9e9e'],
            ];

            // جلب إحصائيات حالات الاشتراكات
            $paidCount = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '>=', Carbon::now())
                ->count();

            $pendingCount = Subscription::where('status', 'pending')->count();
            
            $expiredCount = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '<', Carbon::now())
                ->count();

            $cancelledCount = Subscription::where('status', 'cancelled')->count();

            $statuses[0]['value'] = $paidCount;
            $statuses[1]['value'] = $pendingCount;
            $statuses[2]['value'] = $expiredCount;
            $statuses[3]['value'] = $cancelledCount;

            return response()->json([
                'success' => true,
                'data' => $statuses
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard payment status error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch payment status data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get program type distribution from user goals
     */
    public function getProgramTypeData()
    {
        try {
            $programs = [
                ['name' => 'تنشيف', 'value' => 0, 'color' => '#e91e63'],
                ['name' => 'نحت', 'value' => 0, 'color' => '#9c27b0'],
                ['name' => 'زيادة عضل', 'value' => 0, 'color' => '#2196f3'],
                ['name' => 'لياقة عامة', 'value' => 0, 'color' => '#4caf50'],
            ];

            // جلب توزيع أهداف المستخدمين
            $goals = [
                'weight-loss' => 'تنشيف',
                'toning' => 'نحت',
                'muscle-gain' => 'زيادة عضل',
                'fitness' => 'لياقة عامة',
            ];

            foreach ($goals as $goalKey => $goalName) {
                $count = User::where('goal', $goalKey)->count();
                
                $index = array_search($goalName, array_column($programs, 'name'));
                if ($index !== false) {
                    $programs[$index]['value'] = $count;
                }
            }

            return response()->json([
                'success' => true,
                'data' => $programs
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard program type error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch program type data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get program completion rates
     */
    public function getCompletionData()
    {
        try {
            $completionData = [];

            // حساب نسبة الإنجاز لكل برنامج (هدف)
            $goals = [
                'weight-loss' => 'تنشيف',
                'toning' => 'نحت',
                'muscle-gain' => 'زيادة عضل',
            ];

            foreach ($goals as $goalKey => $goalName) {
                // الحصول على مستخدمي هذا الهدف
                $userIds = User::where('goal', $goalKey)->pluck('id');
                
                // حساب نسبة إنجاز التمارين لهؤلاء المستخدمين
                $totalExercises = WorkoutExercise::whereIn('user_id', $userIds)->count();
                $completedExercises = WorkoutExercise::whereIn('user_id', $userIds)
                    ->where('completed', true)
                    ->count();
                
                $completionRate = $totalExercises > 0 
                    ? round(($completedExercises / $totalExercises) * 100) 
                    : 0;

                $completionData[] = [
                    'program' => $goalName,
                    'completion' => $completionRate
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $completionData
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard completion data error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch completion data',
                'message' => $e->getMessage(),
                'data' => []
            ], 500);
        }
    }

    /**
     * Get engagement data (workout vs nutrition)
     */
    public function getEngagementData()
    {
        try {
            $engagementData = [];
            
            // الحصول على آخر 3 أشهر
            for ($i = 2; $i >= 0; $i--) {
                $monthDate = Carbon::now()->subMonths($i);
                $monthName = $monthDate->translatedFormat('F');
                
                // حساب نسبة إنجاز التمارين لهذا الشهر
                $workoutTotal = WorkoutExercise::whereYear('exercise_date', $monthDate->year)
                    ->whereMonth('exercise_date', $monthDate->month)
                    ->count();
                    
                $workoutCompleted = WorkoutExercise::whereYear('exercise_date', $monthDate->year)
                    ->whereMonth('exercise_date', $monthDate->month)
                    ->where('completed', true)
                    ->count();
                    
                $workoutRate = $workoutTotal > 0 
                    ? round(($workoutCompleted / $workoutTotal) * 100) 
                    : 0;

                // حساب نسبة إنجاز التغذية لهذا الشهر
                $nutritionTotal = NutritionItem::whereHas('nutritionMeal.nutritionPlan', function($query) use ($monthDate) {
                        $query->whereYear('month_start_date', $monthDate->year)
                            ->whereMonth('month_start_date', $monthDate->month);
                    })
                    ->count();
                    
                $nutritionCompleted = NutritionItem::whereHas('nutritionMeal.nutritionPlan', function($query) use ($monthDate) {
                        $query->whereYear('month_start_date', $monthDate->year)
                            ->whereMonth('month_start_date', $monthDate->month);
                    })
                    ->where('completed', true)
                    ->count();
                    
                $nutritionRate = $nutritionTotal > 0 
                    ? round(($nutritionCompleted / $nutritionTotal) * 100) 
                    : 0;

                $engagementData[] = [
                    'month' => $monthName,
                    'workout' => $workoutRate,
                    'nutrition' => $nutritionRate
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $engagementData
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard engagement data error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch engagement data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get funnel data (subscription lifecycle)
     */
    public function getFunnelData()
    {
        try {
            // عدد التسجيلات الكلي
            $totalRegistrations = User::where('role', 'user')->count();

            // عدد الاشتراكات النشطة
            $activeSubscriptions = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '>=', Carbon::now())
                ->count();

            // عدد التجديدات (اشتراكات سابقة تم تجديدها)
            $renewals = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '>=', Carbon::now())
                ->whereHas('user', function($query) {
                    $query->whereHas('subscriptions', function($q) {
                        $q->where('status', 'approved')
                            ->whereDate('ends_at', '<', Carbon::now());
                    });
                })
                ->count();

            // عدد المنتهية
            $expired = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '<', Carbon::now())
                ->count();

            $funnelData = [
                ['stage' => 'التسجيلات', 'value' => $totalRegistrations, 'fill' => '#e91e63'],
                ['stage' => 'اشتراكات نشطة', 'value' => $activeSubscriptions, 'fill' => '#9c27b0'],
                ['stage' => 'التجديدات', 'value' => $renewals, 'fill' => '#2196f3'],
                ['stage' => 'منتهية', 'value' => $expired, 'fill' => '#4caf50'],
            ];

            return response()->json([
                'success' => true,
                'data' => $funnelData
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard funnel data error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch funnel data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get alerts and notifications
     */
    public function getAlerts()
    {
        try {
            // اشتراكات تنتهي خلال 3 أيام
            $expiring3Days = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '>=', Carbon::now())
                ->whereDate('ends_at', '<=', Carbon::now()->addDays(3))
                ->count();

            // اشتراكات تنتهي خلال 7 أيام
            $expiring7Days = Subscription::where('status', 'approved')
                ->whereDate('ends_at', '>=', Carbon::now())
                ->whereDate('ends_at', '<=', Carbon::now()->addDays(7))
                ->whereDate('ends_at', '>', Carbon::now()->addDays(3))
                ->count();

            // مدفوعات متأخرة (اشتراكات pending لأكثر من 3 أيام)
            $pendingPayments = Subscription::where('status', 'pending')
                ->where('created_at', '<=', Carbon::now()->subDays(3))
                ->count();

            // تجديدات هذا الشهر
            $renewalsThisMonth = Subscription::where('status', 'approved')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->whereHas('user', function($query) {
                    $query->whereHas('subscriptions', function($q) {
                        $q->where('status', 'approved')
                            ->whereDate('ends_at', '<', Carbon::now());
                    });
                })
                ->count();

            $alerts = [
                [
                    'id' => 1,
                    'type' => 'warning',
                    'title' => 'اشتراكات تنتهي خلال 3 أيام',
                    'count' => $expiring3Days,
                    'icon' => 'Clock',
                    'color' => '#ff9800'
                ],
                [
                    'id' => 2,
                    'type' => 'info',
                    'title' => 'اشتراكات تنتهي خلال 7 أيام',
                    'count' => $expiring7Days,
                    'icon' => 'Calendar',
                    'color' => '#2196f3'
                ],
                [
                    'id' => 3,
                    'type' => 'danger',
                    'title' => 'مدفوعات متأخرة',
                    'count' => $pendingPayments,
                    'icon' => 'AlertCircle',
                    'color' => '#f44336'
                ],
                [
                    'id' => 4,
                    'type' => 'success',
                    'title' => 'تجديدات هذا الشهر',
                    'count' => $renewalsThisMonth,
                    'icon' => 'Users',
                    'color' => '#4caf50'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $alerts
            ]);
        } catch (\Exception $e) {
            \Log::error('Dashboard alerts error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to fetch alerts',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}