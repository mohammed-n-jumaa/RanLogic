<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UploadBankReceiptRequest;
use App\Models\Subscription;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SubscriptionController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
        $this->middleware('auth:sanctum');
    }

    /**
     * Get subscription plans
     */
    public function getPlans(Request $request): JsonResponse
    {
        try {
            $locale = $request->get('locale', 'ar');
            $isArabic = $locale === 'ar';

            $plans = [
                [
                    'id' => 'basic',
                    'name' => $isArabic ? 'الخطة الأساسية' : 'Basic Plan',
                    'subtitle' => $isArabic ? 'مثالي للبداية المستقلة' : 'Perfect for Independent Start',
                    'pricing' => [
                        '1month' => ['price' => 39, 'originalPrice' => 39, 'discount' => 0],
                        '3months' => ['price' => 111, 'originalPrice' => 117, 'discount' => 5],
                        '6months' => ['price' => 210, 'originalPrice' => 234, 'discount' => 10]
                    ],
                    'popular' => false,
                    'features' => $isArabic ? [
                        'مثالي للبداية المستقلة',
                        'خريطة طريق واضحة لمن يحتاج هيكلة',
                        'برنامج تدريب مخصص (نادي أو منزل)',
                        'برنامج تغذية محسوب (ماكرو/سعرات)',
                        'تحديثات شهرية للخطة'
                    ] : [
                        'Ideal choice for independent beginning',
                        'Clear roadmap for those who need structure',
                        'Customized workout plan (Gym or Home)',
                        'Calculated nutrition plan (Macros/Calories)',
                        'Monthly plan updates'
                    ],
                    'color' => 'blue',
                    'icon' => '💪'
                ],
                [
                    'id' => 'nutrition',
                    'name' => $isArabic ? 'خطة التغذية' : 'Nutrition Plan',
                    'subtitle' => $isArabic ? 'حميتك تحت السيطرة' : 'Your Diet Under Control',
                    'pricing' => [
                        '1month' => ['price' => 49, 'originalPrice' => 49, 'discount' => 0],
                        '3months' => ['price' => 139, 'originalPrice' => 147, 'discount' => 5],
                        '6months' => ['price' => 264, 'originalPrice' => 294, 'discount' => 10]
                    ],
                    'popular' => false,
                    'features' => $isArabic ? [
                        'حميتك تحت السيطرة',
                        'حسابات دقيقة للسعرات والماكرو',
                        'قائمة تبديل أطعمة لمنع الملل',
                        'تحديثات شهرية للتغذية'
                    ] : [
                        'Your diet under control',
                        'Accurate calorie and macro calculations',
                        'Food exchange list to prevent boredom',
                        'Monthly nutrition updates'
                    ],
                    'color' => 'green',
                    'icon' => '🥗'
                ],
                [
                    'id' => 'elite',
                    'name' => $isArabic ? 'الخطة المتميزة' : 'Elite Plan',
                    'subtitle' => $isArabic ? 'التزام ومتابعة' : 'Commitment & Follow-up',
                    'pricing' => [
                        '1month' => ['price' => 79, 'originalPrice' => 79, 'discount' => 0],
                        '3months' => ['price' => 225, 'originalPrice' => 237, 'discount' => 5],
                        '6months' => ['price' => 426, 'originalPrice' => 474, 'discount' => 10]
                    ],
                    'popular' => true,
                    'badge' => $isArabic ? 'الأكثر شعبية' : 'Most Popular',
                    'features' => $isArabic ? [
                        'كل ما في الخطة الأساسية',
                        'نتائج مضمونة مع الالتزام والمتابعة',
                        'تعديلات دورية للتقدم الأمثل',
                        'متابعة أسبوعية للتقدم',
                        'دردشة لدعم استفساراتك',
                        'إرشادات المكملات'
                    ] : [
                        'Everything in Basic Plan',
                        'Guaranteed results with commitment and follow-up',
                        'Regular adjustments for optimal progress',
                        'Weekly progress check-ins',
                        'Chat support for your questions',
                        'Supplements guidance'
                    ],
                    'color' => 'pink',
                    'icon' => '🔥'
                ],
                [
                    'id' => 'vip',
                    'name' => $isArabic ? 'الخطة VIP' : 'VIP Plan',
                    'subtitle' => $isArabic ? 'تجربة تدريب شخصي كاملة' : 'Complete Personal Training Experience',
                    'pricing' => [
                        '1month' => ['price' => 149, 'originalPrice' => 149, 'discount' => 0],
                        '3months' => ['price' => 424, 'originalPrice' => 447, 'discount' => 5],
                        '6months' => ['price' => 804, 'originalPrice' => 894, 'discount' => 10]
                    ],
                    'popular' => false,
                    'features' => $isArabic ? [
                        'كل ما في الخطة المتميزة',
                        'دعم مباشر يومي',
                        'أولوية في التواصل',
                        'جلسة استشارية شهرية فردية'
                    ] : [
                        'Everything in Elite Plan',
                        'Direct daily support',
                        'Priority communication',
                        'One-on-one monthly consulting session'
                    ],
                    'color' => 'gold',
                    'icon' => '👑'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $plans,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching subscription plans: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الخطط',
            ], 500);
        }
    }

    /**
     * Create PayPal payment
     */
    public function createPayPalPayment(StoreSubscriptionRequest $request): JsonResponse
{
    try {
        $validated = $request->validated();
        $user = $request->user();

        return DB::transaction(function () use ($validated, $user) {

            $pricing = $this->resolvePlanPricing(
                $validated['plan_type'],
                $validated['duration']
            );

            $amount = $pricing['amount'];
            $originalAmount = $pricing['original_amount'];
            $discountPercentage = $pricing['discount_percentage'];

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_type' => $validated['plan_type'],
                'duration' => $validated['duration'],
                'amount' => $amount,
                'original_amount' => $originalAmount,
                'discount_percentage' => $discountPercentage,
                'payment_method' => 'paypal',
                'status' => 'pending',
                'currency' => 'USD',
            ]);

            $paypalOrder = $this->paymentService->createPayPalOrder([
                'amount' => number_format((float) $amount, 2, '.', ''),
                'currency' => 'USD',
                'description' => $validated['plan_type'] . ' - ' . $validated['duration'],
                'subscription_id' => $subscription->id,
            ]);

            if (empty($paypalOrder['id'])) {
                throw new \Exception('PayPal order id missing in response');
            }

            $subscription->update([
                'paypal_order_id' => $paypalOrder['id'],
            ]);

            $approvalUrl = $this->paymentService->getApprovalUrl($paypalOrder);

            if (!$approvalUrl) {
                throw new \Exception('PayPal approval url not found in response');
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'approval_url' => $approvalUrl,
                    'order_id' => $paypalOrder['id'],
                    'subscription_id' => $subscription->id,
                ],
            ]);
        });
    } catch (\Throwable $e) {
        Log::error('PayPal payment creation error', [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}


     private function resolvePlanPricing(string $planType, string $duration): array
       {
    $plans = [
        'basic' => [
            '1month' => ['amount' => 39, 'original_amount' => 39, 'discount_percentage' => 0],
            '3months' => ['amount' => 111, 'original_amount' => 117, 'discount_percentage' => 5],
            '6months' => ['amount' => 210, 'original_amount' => 234, 'discount_percentage' => 10],
        ],
        'nutrition' => [
            '1month' => ['amount' => 49, 'original_amount' => 49, 'discount_percentage' => 0],
            '3months' => ['amount' => 139, 'original_amount' => 147, 'discount_percentage' => 5],
            '6months' => ['amount' => 264, 'original_amount' => 294, 'discount_percentage' => 10],
        ],
        'elite' => [
            '1month' => ['amount' => 79, 'original_amount' => 79, 'discount_percentage' => 0],
            '3months' => ['amount' => 225, 'original_amount' => 237, 'discount_percentage' => 5],
            '6months' => ['amount' => 426, 'original_amount' => 474, 'discount_percentage' => 10],
        ],
        'vip' => [
            '1month' => ['amount' => 149, 'original_amount' => 149, 'discount_percentage' => 0],
            '3months' => ['amount' => 424, 'original_amount' => 447, 'discount_percentage' => 5],
            '6months' => ['amount' => 804, 'original_amount' => 894, 'discount_percentage' => 10],
        ],
    ];

    if (!isset($plans[$planType])) {
        throw new \Exception('Invalid plan type.');
    }

    if (!isset($plans[$planType][$duration])) {
        throw new \Exception('Invalid duration for selected plan.');
    }

    return $plans[$planType][$duration];
         }

    /**
     * ✅ Capture PayPal payment (FIXED)
     * - يعتمد على token القادم من PayPal (OrderID)
     * - يحدث subscription + user بشكل صحيح
     */
    public function capturePayPalPayment(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'subscription_id' => 'required|integer|exists:subscriptions,id',
        ]);

        $user = $request->user();
        $orderIdFromPayPal = (string) $request->token;

        try {
            return DB::transaction(function () use ($user, $orderIdFromPayPal, $request) {

                $subscription = Subscription::where('id', $request->subscription_id)
                    ->where('user_id', $user->id)
                    ->lockForUpdate()
                    ->firstOrFail();

                if ($subscription->status === 'approved') {
                    return response()->json([
                        'success' => true,
                        'message' => 'تم تفعيل الاشتراك مسبقاً',
                        'data' => [
                            'subscription' => [
                                'id' => $subscription->id,
                                'status' => $subscription->status,
                                'starts_at' => $subscription->starts_at?->format('Y-m-d H:i:s'),
                                'ends_at' => $subscription->ends_at?->format('Y-m-d H:i:s'),
                            ],
                        ],
                    ]);
                }

                // حفظ order id عند الحاجة
                if (empty($subscription->paypal_order_id) || $subscription->paypal_order_id !== $orderIdFromPayPal) {
                    $subscription->update(['paypal_order_id' => $orderIdFromPayPal]);
                }

                // ✅ capture من PayPal
                $captureResult = $this->paymentService->capturePayPalOrder($orderIdFromPayPal);

                // مهم: PayPal capture يرجع status = COMPLETED عند نجاح الدفع
                $paypalStatus = $captureResult['status'] ?? null;
                if ($paypalStatus !== 'COMPLETED') {
                    throw new \Exception('PayPal status not completed: ' . ($paypalStatus ?? 'NULL'));
                }

                $startsAt = now();
                $endsAt = match ($subscription->duration) {
                    '3months' => $startsAt->copy()->addMonths(3),
                    '6months' => $startsAt->copy()->addMonths(6),
                    default => $startsAt->copy()->addMonth(),
                };

                $payerId = $captureResult['payer']['payer_id'] ?? null;

                $subscription->update([
                    'status' => 'approved',
                    'paypal_payer_id' => $payerId,
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ]);

                $user->update([
                    'has_active_subscription' => true,
                    'subscription_start_date' => $startsAt->toDateString(),
                    'subscription_end_date' => $endsAt->toDateString(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم تفعيل الاشتراك بنجاح',
                    'data' => [
                        'subscription' => [
                            'id' => $subscription->id,
                            'plan_type' => $subscription->plan_type,
                            'plan_name' => $subscription->plan_name,
                            'duration' => $subscription->duration,
                            'duration_name' => $subscription->duration_name,
                            'amount' => $subscription->amount,
                            'starts_at' => $subscription->starts_at->format('Y-m-d H:i:s'),
                            'ends_at' => $subscription->ends_at->format('Y-m-d H:i:s'),
                            'status' => $subscription->status,
                        ],
                    ],
                ]);
            });
        } catch (\Throwable $e) {
            Log::error('Capture error (controller)', [
                'message' => $e->getMessage(),
                'token' => $orderIdFromPayPal,
                'user_id' => $user->id,
                'subscription_id' => (int) $request->subscription_id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'فشل تأكيد الدفع من PayPal',
                'paypal_error' => $e->getMessage(),
            ], 422);
        }
    }



    /**
     * Create bank transfer subscription
     */
    public function createBankTransferSubscription(StoreSubscriptionRequest $request): JsonResponse
{
    try {
        $validated = $request->validated();
        $user = $request->user();

        $pricing = $this->resolvePlanPricing(
            $validated['plan_type'],
            $validated['duration']
        );

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_type' => $validated['plan_type'],
            'duration' => $validated['duration'],
            'amount' => $pricing['amount'],
            'original_amount' => $pricing['original_amount'],
            'discount_percentage' => $pricing['discount_percentage'],
            'payment_method' => 'bank_transfer',
            'status' => 'pending',
            'currency' => 'USD',
            'notes' => $validated['notes'] ?? null,
        ]);

        Log::info('Bank transfer subscription created', [
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء طلب الاشتراك بنجاح',
            'data' => [
                'subscription_id' => $subscription->id,
                'plan_type' => $subscription->plan_type,
                'plan_name' => $subscription->plan_name,
                'duration' => $subscription->duration,
                'amount' => $subscription->amount,
                'status' => $subscription->status,
            ],
        ]);
    } catch (\Exception $e) {
        Log::error('Error creating bank transfer subscription: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ أثناء إنشاء طلب الاشتراك',
        ], 500);
    }
}

    /**
     * Upload bank transfer receipt
     */
    public function uploadBankReceipt(UploadBankReceiptRequest $request, Subscription $subscription): JsonResponse
    {
        try {
            $user = $request->user();

            if ($subscription->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'ليس لديك صلاحية لهذا الاشتراك',
                ], 403);
            }

            if ($subscription->status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'لا يمكن تحميل إيصال لهذا الاشتراك',
                ], 400);
            }

            DB::beginTransaction();

            $path = $request->file('receipt')->store('receipts', 'public');

            $subscription->update([
                'bank_transfer_number' => $request->bank_transfer_number,
                'bank_receipt_path' => $path,
                'status' => 'pending',
            ]);

            DB::commit();

            Log::info('Bank receipt uploaded', [
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'transfer_number' => $request->bank_transfer_number,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الإيصال بنجاح',
                'data' => [
                    'receipt_url' => Storage::url($path),
                    'subscription' => [
                        'id' => $subscription->id,
                        'status' => $subscription->status,
                        'bank_transfer_number' => $subscription->bank_transfer_number,
                    ],
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error uploading bank receipt: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع الإيصال',
            ], 500);
        }
    }

    /**
     * Get user subscriptions
     */
    public function getUserSubscriptions(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $subscriptions = $user->subscriptions()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($subscription) {
                    return [
                        'id' => $subscription->id,
                        'plan_type' => $subscription->plan_type,
                        'plan_name' => $subscription->plan_name,
                        'duration' => $subscription->duration,
                        'duration_name' => $subscription->duration_name,
                        'amount' => $subscription->amount,
                        'original_amount' => $subscription->original_amount,
                        'discount_percentage' => $subscription->discount_percentage,
                        'payment_method' => $subscription->payment_method,
                        'payment_method_name' => $subscription->payment_method_name,
                        'status' => $subscription->status,
                        'status_badge' => $subscription->status_badge,
                        'bank_transfer_number' => $subscription->bank_transfer_number,
                        'bank_receipt_url' => $subscription->bank_receipt_path ? Storage::url($subscription->bank_receipt_path) : null,
                        'created_at' => $subscription->created_at->format('Y-m-d H:i:s'),
                        'starts_at' => $subscription->starts_at?->format('Y-m-d H:i:s'),
                        'ends_at' => $subscription->ends_at?->format('Y-m-d H:i:s'),
                        'notes' => $subscription->notes,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $subscriptions,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching user subscriptions: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الاشتراكات',
            ], 500);
        }
    }

    /**
     * Get active subscription
     */
    public function getActiveSubscription(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $subscription = $user->subscriptions()
                ->where('status', 'approved')
                ->where('ends_at', '>', now())
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$subscription) {
                return response()->json([
                    'success' => true,
                    'data' => null,
                    'message' => 'لا يوجد اشتراك نشط',
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $subscription->id,
                    'plan_type' => $subscription->plan_type,
                    'plan_name' => $subscription->plan_name,
                    'duration' => $subscription->duration,
                    'duration_name' => $subscription->duration_name,
                    'amount' => $subscription->amount,
                    'payment_method' => $subscription->payment_method,
                    'payment_method_name' => $subscription->payment_method_name,
                    'starts_at' => $subscription->starts_at->format('Y-m-d H:i:s'),
                    'ends_at' => $subscription->ends_at->format('Y-m-d H:i:s'),
                    'days_remaining' => $subscription->ends_at->diffInDays(now()),
                    'is_active' => true,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching active subscription: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الاشتراك النشط',
            ], 500);
        }
    }
}
