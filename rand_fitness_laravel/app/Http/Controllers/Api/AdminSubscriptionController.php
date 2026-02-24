<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminSubscriptionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all PayPal subscriptions
     */
    public function getPayPalSubscriptions(Request $request): JsonResponse
    {
        try {
            $query = Subscription::with('user')
                ->where('payment_method', 'paypal')
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                if ($request->status === 'expired') {
                    $query->where('status', 'approved')
                          ->where('ends_at', '<=', now());
                } else {
                    $query->where('status', $request->status);
                }
            }

            if ($request->has('plan_type') && $request->plan_type !== 'all') {
                $query->where('plan_type', $request->plan_type);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('email', 'like', "%{$search}%");
                    })->orWhere('paypal_order_id', 'like', "%{$search}%");
                });
            }

            $subscriptions = $query->get()->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'user' => $subscription->user ? [
                        'id' => $subscription->user->id,
                        'name' => $subscription->user->name,
                        'email' => $subscription->user->email,
                        'avatar_url' => $subscription->user->avatar_url ?? null,
                    ] : null,
                    'plan_type' => $subscription->plan_type,
                    'plan_name' => $subscription->plan_name ?? $subscription->plan_type,
                    'duration' => $subscription->duration,
                    'duration_name' => $subscription->duration_name ?? $subscription->duration,
                    'amount' => (float) $subscription->amount,
                    'original_amount' => (float) ($subscription->original_amount ?? $subscription->amount),
                    'discount_percentage' => (int) ($subscription->discount_percentage ?? 0),
                    'payment_method' => $subscription->payment_method,
                    'payment_method_name' => $subscription->payment_method_name ?? 'PayPal',
                    'status' => $subscription->status,
                    'paypal_order_id' => $subscription->paypal_order_id ?? null,
                    'paypal_payer_id' => $subscription->paypal_payer_id ?? null,
                    'starts_at' => $subscription->starts_at ? $subscription->starts_at->format('Y-m-d H:i:s') : null,
                    'ends_at' => $subscription->ends_at ? $subscription->ends_at->format('Y-m-d H:i:s') : null,
                    'notes' => $subscription->notes ?? null,
                    'created_at' => $subscription->created_at->format('Y-m-d H:i:s'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $subscriptions,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching PayPal subscriptions', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all bank transfer subscriptions
     */
    public function getBankTransferSubscriptions(Request $request): JsonResponse
    {
        try {
            $query = Subscription::with('user')
                ->where('payment_method', 'bank_transfer')
                ->orderBy('created_at', 'desc');

            // Apply filters
            if ($request->has('status') && $request->status !== 'all') {
                if ($request->status === 'expired') {
                    $query->where('status', 'approved')
                          ->where('ends_at', '<=', now());
                } else {
                    $query->where('status', $request->status);
                }
            }

            if ($request->has('plan_type') && $request->plan_type !== 'all') {
                $query->where('plan_type', $request->plan_type);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('email', 'like', "%{$search}%");
                    })->orWhere('bank_transfer_number', 'like', "%{$search}%");
                });
            }

            $subscriptions = $query->get()->map(function ($subscription) {
                // الحصول على URL صحيح للصورة
                $receiptUrl = null;
                if ($subscription->bank_receipt_path) {
                    // استخدام asset() للحصول على URL كامل
                    $receiptUrl = asset('storage/' . $subscription->bank_receipt_path);
                }

                return [
                    'id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'user' => $subscription->user ? [
                        'id' => $subscription->user->id,
                        'name' => $subscription->user->name,
                        'email' => $subscription->user->email,
                        'avatar_url' => $subscription->user->avatar_url ?? null,
                    ] : null,
                    'plan_type' => $subscription->plan_type,
                    'plan_name' => $subscription->plan_name ?? $subscription->plan_type,
                    'duration' => $subscription->duration,
                    'duration_name' => $subscription->duration_name ?? $subscription->duration,
                    'amount' => (float) $subscription->amount,
                    'original_amount' => (float) ($subscription->original_amount ?? $subscription->amount),
                    'discount_percentage' => (int) ($subscription->discount_percentage ?? 0),
                    'payment_method' => $subscription->payment_method,
                    'payment_method_name' => $subscription->payment_method_name ?? 'Bank Transfer',
                    'status' => $subscription->status,
                    'bank_transfer_number' => $subscription->bank_transfer_number ?? null,
                    'bank_receipt_url' => $receiptUrl, // تم التعديل هنا
                    'starts_at' => $subscription->starts_at ? $subscription->starts_at->format('Y-m-d H:i:s') : null,
                    'ends_at' => $subscription->ends_at ? $subscription->ends_at->format('Y-m-d H:i:s') : null,
                    'notes' => $subscription->notes ?? null,
                    'created_at' => $subscription->created_at->format('Y-m-d H:i:s'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $subscriptions,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching bank transfer subscriptions', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create PayPal subscription manually
     */
    public function createPayPalSubscription(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_type' => 'required|in:basic,nutrition,elite,vip',
            'duration' => 'required|in:1month,3months,6months',
            'amount' => 'required|numeric|min:1',
            'original_amount' => 'nullable|numeric|min:1',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                $subscription = Subscription::create([
                    'user_id' => $validated['user_id'],
                    'plan_type' => $validated['plan_type'],
                    'duration' => $validated['duration'],
                    'amount' => $validated['amount'],
                    'original_amount' => $validated['original_amount'] ?? $validated['amount'],
                    'discount_percentage' => $validated['discount_percentage'] ?? 0,
                    'payment_method' => 'paypal',
                    'status' => 'approved',
                    'currency' => 'USD',
                    'starts_at' => $validated['starts_at'],
                    'ends_at' => $validated['ends_at'],
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Update user subscription status
                $user = User::find($validated['user_id']);
                $user->update([
                    'has_active_subscription' => true,
                ]);

                Log::info('Manual PayPal subscription created', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $user->id,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم إضافة الاشتراك بنجاح',
                    'data' => $subscription,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error creating PayPal subscription', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إضافة الاشتراك: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update subscription
     */
    public function updateSubscription(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'plan_type' => 'sometimes|in:basic,nutrition,elite,vip',
            'duration' => 'sometimes|in:1month,3months,6months',
            'amount' => 'sometimes|numeric|min:1',
            'original_amount' => 'nullable|numeric|min:1',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'starts_at' => 'sometimes|date',
            'ends_at' => 'sometimes|date',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            $subscription = Subscription::findOrFail($id);

            return DB::transaction(function () use ($subscription, $validated) {
                $subscription->update($validated);

                // Update user if status is approved
                if ($subscription->status === 'approved') {
                    $subscription->user->update([
                        'has_active_subscription' => true,
                    ]);
                }

                Log::info('Subscription updated', [
                    'subscription_id' => $subscription->id,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم تحديث الاشتراك بنجاح',
                    'data' => $subscription,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error updating subscription', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الاشتراك: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete subscription
     */
    public function deleteSubscription($id): JsonResponse
    {
        try {
            return DB::transaction(function () use ($id) {
                $subscription = Subscription::findOrFail($id);
                $user = $subscription->user;

                // Check if this is the active subscription
                $activeSubscription = $user->subscriptions()
                    ->where('status', 'approved')
                    ->where('ends_at', '>', now())
                    ->where('id', '!=', $id)
                    ->exists();

                // If no other active subscription, update user status
                if (!$activeSubscription) {
                    $user->update([
                        'has_active_subscription' => false,
                    ]);
                }

                $subscription->delete();

                Log::info('Subscription deleted', [
                    'subscription_id' => $id,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم حذف الاشتراك بنجاح',
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error deleting subscription', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الاشتراك: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve bank transfer subscription
     */
    public function approveBankTransfer(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            return DB::transaction(function () use ($id, $validated) {
                $subscription = Subscription::findOrFail($id);

                if ($subscription->payment_method !== 'bank_transfer') {
                    return response()->json([
                        'success' => false,
                        'message' => 'هذا الاشتراك ليس عبر تحويل بنكي',
                    ], 400);
                }

                if ($subscription->status !== 'pending') {
                    return response()->json([
                        'success' => false,
                        'message' => 'هذا الاشتراك تمت معالجته بالفعل',
                    ], 400);
                }

                $subscription->update([
                    'status' => 'approved',
                    'starts_at' => $validated['starts_at'],
                    'ends_at' => $validated['ends_at'],
                    'notes' => $validated['notes'] ?? $subscription->notes,
                ]);

                // Update user subscription status
                $subscription->user->update([
                    'has_active_subscription' => true,
                ]);

                Log::info('Bank transfer subscription approved', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم تفعيل الاشتراك بنجاح',
                    'data' => $subscription,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Error approving bank transfer', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تفعيل الاشتراك: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject bank transfer subscription
     */
    public function rejectBankTransfer(Request $request, $id): JsonResponse
    {
        $validated = $request->validate([
            'notes' => 'required|string|max:500',
        ]);

        try {
            $subscription = Subscription::findOrFail($id);

            if ($subscription->payment_method !== 'bank_transfer') {
                return response()->json([
                    'success' => false,
                    'message' => 'هذا الاشتراك ليس عبر تحويل بنكي',
                ], 400);
            }

            if ($subscription->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'هذا الاشتراك تمت معالجته بالفعل',
                ], 400);
            }

            $subscription->update([
                'status' => 'rejected',
                'notes' => $validated['notes'],
            ]);

            Log::info('Bank transfer subscription rejected', [
                'subscription_id' => $subscription->id,
                'reason' => $validated['notes'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفض الاشتراك',
                'data' => $subscription,
            ]);
        } catch (\Exception $e) {
            Log::error('Error rejecting bank transfer', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفض الاشتراك: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get subscription statistics
     */
    public function getSubscriptionStats(): JsonResponse
    {
        try {
            $now = now();

            $paypalStats = [
                'total' => Subscription::where('payment_method', 'paypal')->count(),
                'active' => Subscription::where('payment_method', 'paypal')
                    ->where('status', 'approved')
                    ->where('ends_at', '>', $now)
                    ->count(),
                'expired' => Subscription::where('payment_method', 'paypal')
                    ->where('status', 'approved')
                    ->where('ends_at', '<=', $now)
                    ->count(),
            ];

            $bankTransferStats = [
                'total' => Subscription::where('payment_method', 'bank_transfer')->count(),
                'pending' => Subscription::where('payment_method', 'bank_transfer')
                    ->where('status', 'pending')
                    ->count(),
                'approved' => Subscription::where('payment_method', 'bank_transfer')
                    ->where('status', 'approved')
                    ->where('ends_at', '>', $now)
                    ->count(),
                'rejected' => Subscription::where('payment_method', 'bank_transfer')
                    ->where('status', 'rejected')
                    ->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'paypal' => $paypalStats,
                    'bank_transfer' => $bankTransferStats,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching subscription stats', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الإحصائيات: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $query = User::query();

            // Apply role filter
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            // Apply search filter
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $users = $query->select('id', 'name', 'email', 'avatar')
                ->limit(20)
                ->get()
                ->map(function ($user) {
                    $avatarUrl = null;
                    if ($user->avatar) {
                        $avatarUrl = asset('storage/' . $user->avatar);
                    }

                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'avatar_url' => $avatarUrl,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $users,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching users', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب المستخدمين',
            ], 500);
        }
    }

    /**
     * Get subscription plans
     */
    public function getPlans(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'en');
            
            $plans = [
                [
                    'id' => 'basic',
                    'name' => $locale === 'ar' ? 'الأساسية' : 'Basic',
                    'type' => 'basic',
                ],
                [
                    'id' => 'nutrition',
                    'name' => $locale === 'ar' ? 'التغذية' : 'Nutrition',
                    'type' => 'nutrition',
                ],
                [
                    'id' => 'elite',
                    'name' => $locale === 'ar' ? 'النخبة' : 'Elite',
                    'type' => 'elite',
                ],
                [
                    'id' => 'vip',
                    'name' => $locale === 'ar' ? 'في آي بي' : 'VIP',
                    'type' => 'vip',
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $plans,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching plans', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الخطط',
            ], 500);
        }
    }
}