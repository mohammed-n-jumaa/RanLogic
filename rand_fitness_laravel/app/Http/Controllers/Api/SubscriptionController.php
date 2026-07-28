<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSubscriptionRequest;
use App\Http\Requests\UploadBankReceiptRequest;
use App\Models\Plan;
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

    // ─── GET /subscriptions/plans ─────────────────────────────────────────────

    public function getPlans(Request $request): JsonResponse
    {
        try {
            $locale   = $request->get('locale', 'ar');
            $isArabic = $locale === 'ar';

            $geoService     = new \App\Services\GeoPricingService();
            $ip             = $request->ip();
            $countryCode    = $request->get('country') ?? $geoService->getCountryFromIp($ip);
            $currencyConfig = $geoService->getCurrencyConfig($countryCode);
            $rate           = $currencyConfig['rate'];

            $dbPlans = Plan::active()->ordered()->get();

            if ($dbPlans->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'لا توجد خطط متاحة حالياً',
                ], 404);
            }

            $plans = $dbPlans->map(function (Plan $plan) use ($isArabic, $geoService, $rate) {

                $pricingUsd = [
                    '1month'  => [
                        'price'         => (float) $plan->price_1m,
                        'originalPrice' => (float) $plan->original_price_1m,
                        'discount'      => (int)   $plan->discount_1m,
                    ],
                    '3months' => [
                        'price'         => (float) $plan->price_3m,
                        'originalPrice' => (float) $plan->original_price_3m,
                        'discount'      => (int)   $plan->discount_3m,
                    ],
                    '6months' => [
                        'price'         => (float) $plan->price_6m,
                        'originalPrice' => (float) $plan->original_price_6m,
                        'discount'      => (int)   $plan->discount_6m,
                    ],
                ];

                // Convert to local currency
                $pricing = $geoService->convertPlanPricing($pricingUsd, $rate);

                // Keep USD reference for PayPal (always charges in USD)
                foreach (['1month', '3months', '6months'] as $dur) {
                    $pricing[$dur]['usd_price']    = $pricingUsd[$dur]['price'];
                    $pricing[$dur]['usd_original'] = $pricingUsd[$dur]['originalPrice'];
                }

                $featuresAr = is_array($plan->features_ar)
                    ? $plan->features_ar
                    : json_decode($plan->features_ar ?? '[]', true) ?? [];

                $featuresEn = is_array($plan->features_en)
                    ? $plan->features_en
                    : json_decode($plan->features_en ?? '[]', true) ?? [];

                return [
                    'id'       => $plan->plan_key,
                    'name'     => $isArabic ? $plan->name_ar    : $plan->name_en,
                    'subtitle' => $isArabic ? $plan->subtitle_ar : $plan->subtitle_en,
                    'pricing'  => $pricing,
                    'popular'  => (bool) $plan->is_popular,
                    'badge'    => $isArabic ? ($plan->badge_ar ?: '') : ($plan->badge_en ?: ''),
                    'features' => $isArabic ? $featuresAr : $featuresEn,
                    'color'    => $plan->color,
                    'icon'     => $plan->icon,
                ];
            });

            return response()->json([
                'success'  => true,
                'data'     => $plans,
                'currency' => [
                    'code'    => $currencyConfig['currency'],
                    'symbol'  => $currencyConfig['symbol'],
                    'country' => $countryCode,
                    'rate'    => $rate,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching subscription plans: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب الخطط',
            ], 500);
        }
    }

    // ─── POST /subscriptions/paypal/create ───────────────────────────────────

    public function createPayPalPayment(StoreSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $user      = $request->user();

            return DB::transaction(function () use ($validated, $user) {

                $pricing = $this->resolvePlanPricing(
                    $validated['plan_type'],
                    $validated['duration']
                );

                $subscription = Subscription::create([
                    'user_id'             => $user->id,
                    'plan_type'           => $validated['plan_type'],
                    'duration'            => $validated['duration'],
                    'amount'              => $pricing['amount'],
                    'original_amount'     => $pricing['original_amount'],
                    'discount_percentage' => $pricing['discount_percentage'],
                    'payment_method'      => 'paypal',
                    'status'              => 'pending',
                    'currency'            => 'USD',
                ]);

                $paypalOrder = $this->paymentService->createPayPalOrder([
                    'amount'          => number_format((float) $pricing['amount'], 2, '.', ''),
                    'currency'        => 'USD',
                    'description'     => $validated['plan_type'] . ' - ' . $validated['duration'],
                    'subscription_id' => $subscription->id,
                ]);

                if (empty($paypalOrder['id'])) {
                    throw new \Exception('PayPal order id missing in response');
                }

                $subscription->update(['paypal_order_id' => $paypalOrder['id']]);

                $approvalUrl = $this->paymentService->getApprovalUrl($paypalOrder);

                if (!$approvalUrl) {
                    throw new \Exception('PayPal approval url not found in response');
                }

                return response()->json([
                    'success' => true,
                    'data'    => [
                        'approval_url'    => $approvalUrl,
                        'order_id'        => $paypalOrder['id'],
                        'subscription_id' => $subscription->id,
                    ],
                ]);
            });

        } catch (\Throwable $e) {
            Log::error('PayPal payment creation error', [
                'error' => $e->getMessage(),
                'file'  => $e->getFile(),
                'line'  => $e->getLine(),
            ]);

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    // ─── POST /subscriptions/paypal/capture ──────────────────────────────────

    public function capturePayPalPayment(Request $request): JsonResponse
    {
        $request->validate([
            'token'           => 'required|string',
            'subscription_id' => 'required|integer|exists:subscriptions,id',
        ]);

        $user              = $request->user();
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
                        'data'    => [
                            'subscription' => [
                                'id'        => $subscription->id,
                                'status'    => $subscription->status,
                                'starts_at' => $subscription->starts_at?->format('Y-m-d H:i:s'),
                                'ends_at'   => $subscription->ends_at?->format('Y-m-d H:i:s'),
                            ],
                        ],
                    ]);
                }

                if (empty($subscription->paypal_order_id) || $subscription->paypal_order_id !== $orderIdFromPayPal) {
                    $subscription->update(['paypal_order_id' => $orderIdFromPayPal]);
                }

                $captureResult = $this->paymentService->capturePayPalOrder($orderIdFromPayPal);

                $paypalStatus = $captureResult['status'] ?? null;
                if ($paypalStatus !== 'COMPLETED') {
                    throw new \Exception('PayPal status not completed: ' . ($paypalStatus ?? 'NULL'));
                }

                $startsAt = now();
                $endsAt   = match ($subscription->duration) {
                    '3months' => $startsAt->copy()->addMonths(3),
                    '6months' => $startsAt->copy()->addMonths(6),
                    default   => $startsAt->copy()->addMonth(),
                };

                $subscription->update([
                    'status'          => 'approved',
                    'paypal_payer_id' => $captureResult['payer']['payer_id'] ?? null,
                    'starts_at'       => $startsAt,
                    'ends_at'         => $endsAt,
                ]);

                $user->update([
                    'has_active_subscription'  => true,
                    'subscription_start_date'  => $startsAt->toDateString(),
                    'subscription_end_date'    => $endsAt->toDateString(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'تم تفعيل الاشتراك بنجاح',
                    'data'    => [
                        'subscription' => [
                            'id'            => $subscription->id,
                            'plan_type'     => $subscription->plan_type,
                            'plan_name'     => $subscription->plan_name,
                            'duration'      => $subscription->duration,
                            'duration_name' => $subscription->duration_name,
                            'amount'        => $subscription->amount,
                            'starts_at'     => $subscription->starts_at->format('Y-m-d H:i:s'),
                            'ends_at'       => $subscription->ends_at->format('Y-m-d H:i:s'),
                            'status'        => $subscription->status,
                        ],
                    ],
                ]);
            });

        } catch (\Throwable $e) {
            Log::error('Capture error (controller)', [
                'message'         => $e->getMessage(),
                'token'           => $orderIdFromPayPal,
                'user_id'         => $user->id,
                'subscription_id' => (int) $request->subscription_id,
            ]);

            return response()->json([
                'success'      => false,
                'message'      => 'فشل تأكيد الدفع من PayPal',
                'paypal_error' => $e->getMessage(),
            ], 422);
        }
    }

    // ─── POST /subscriptions/bank-transfer ───────────────────────────────────

    public function createBankTransferSubscription(StoreSubscriptionRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $user      = $request->user();

            $pricing = $this->resolvePlanPricing(
                $validated['plan_type'],
                $validated['duration']
            );

            $subscription = Subscription::create([
                'user_id'             => $user->id,
                'plan_type'           => $validated['plan_type'],
                'duration'            => $validated['duration'],
                'amount'              => $pricing['amount'],
                'original_amount'     => $pricing['original_amount'],
                'discount_percentage' => $pricing['discount_percentage'],
                'payment_method'      => 'bank_transfer',
                'status'              => 'pending',
                'currency'            => 'USD',
                'notes'               => $validated['notes'] ?? null,
            ]);

            Log::info('Bank transfer subscription created', [
                'user_id'         => $user->id,
                'subscription_id' => $subscription->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء طلب الاشتراك بنجاح',
                'data'    => [
                    'subscription_id' => $subscription->id,
                    'plan_type'       => $subscription->plan_type,
                    'plan_name'       => $subscription->plan_name,
                    'duration'        => $subscription->duration,
                    'amount'          => $subscription->amount,
                    'status'          => $subscription->status,
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

    // ─── POST /subscriptions/{subscription}/upload-receipt ───────────────────

    public function uploadBankReceipt(UploadBankReceiptRequest $request, Subscription $subscription): JsonResponse
    {
        try {
            $user = $request->user();

            if ($subscription->user_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'ليس لديك صلاحية لهذا الاشتراك'], 403);
            }

            if ($subscription->status !== 'pending') {
                return response()->json(['success' => false, 'message' => 'لا يمكن تحميل إيصال لهذا الاشتراك'], 400);
            }

            DB::beginTransaction();

            $path = $request->file('receipt')->store('receipts', 'public');

            $subscription->update([
                'bank_transfer_number' => $request->bank_transfer_number,
                'bank_receipt_path'    => $path,
                'status'               => 'pending',
            ]);

            DB::commit();

            Log::info('Bank receipt uploaded', [
                'user_id'         => $user->id,
                'subscription_id' => $subscription->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم رفع الإيصال بنجاح',
                'data'    => [
                    'receipt_url'  => Storage::url($path),
                    'subscription' => [
                        'id'                   => $subscription->id,
                        'status'               => $subscription->status,
                        'bank_transfer_number' => $subscription->bank_transfer_number,
                    ],
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error uploading bank receipt: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء رفع الإيصال'], 500);
        }
    }

    // ─── GET /subscriptions/my-subscriptions ─────────────────────────────────

    public function getUserSubscriptions(Request $request): JsonResponse
    {
        try {
            $user          = $request->user();
            $subscriptions = $user->subscriptions()
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(fn($s) => [
                    'id'                   => $s->id,
                    'plan_type'            => $s->plan_type,
                    'plan_name'            => $s->plan_name,
                    'duration'             => $s->duration,
                    'duration_name'        => $s->duration_name,
                    'amount'               => $s->amount,
                    'original_amount'      => $s->original_amount,
                    'discount_percentage'  => $s->discount_percentage,
                    'payment_method'       => $s->payment_method,
                    'payment_method_name'  => $s->payment_method_name,
                    'status'               => $s->status,
                    'status_badge'         => $s->status_badge,
                    'bank_transfer_number' => $s->bank_transfer_number,
                    'bank_receipt_url'     => $s->bank_receipt_path ? Storage::url($s->bank_receipt_path) : null,
                    'created_at'           => $s->created_at->format('Y-m-d H:i:s'),
                    'starts_at'            => $s->starts_at?->format('Y-m-d H:i:s'),
                    'ends_at'              => $s->ends_at?->format('Y-m-d H:i:s'),
                    'notes'                => $s->notes,
                ]);

            return response()->json(['success' => true, 'data' => $subscriptions]);

        } catch (\Exception $e) {
            Log::error('Error fetching user subscriptions: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء جلب الاشتراكات'], 500);
        }
    }

    // ─── GET /subscriptions/active ───────────────────────────────────────────

    public function getActiveSubscription(Request $request): JsonResponse
    {
        try {
            $user         = $request->user();
            $subscription = $user->subscriptions()
                ->where('status', 'approved')
                ->where('ends_at', '>', now())
                ->orderBy('created_at', 'desc')
                ->first();

            if (!$subscription) {
                return response()->json(['success' => true, 'data' => null, 'message' => 'لا يوجد اشتراك نشط']);
            }

            return response()->json([
                'success' => true,
                'data'    => [
                    'id'                  => $subscription->id,
                    'plan_type'           => $subscription->plan_type,
                    'plan_name'           => $subscription->plan_name,
                    'duration'            => $subscription->duration,
                    'duration_name'       => $subscription->duration_name,
                    'amount'              => $subscription->amount,
                    'payment_method'      => $subscription->payment_method,
                    'payment_method_name' => $subscription->payment_method_name,
                    'starts_at'           => $subscription->starts_at->format('Y-m-d H:i:s'),
                    'ends_at'             => $subscription->ends_at->format('Y-m-d H:i:s'),
                    'days_remaining'      => $subscription->ends_at->diffInDays(now()),
                    'is_active'           => true,
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching active subscription: ' . $e->getMessage());

            return response()->json(['success' => false, 'message' => 'حدث خطأ أثناء جلب الاشتراك النشط'], 500);
        }
    }

    // ─── Private ──────────────────────────────────────────────────────────────

   
    private function resolvePlanPricing(string $planType, string $duration): array
    {
        $validDurations = ['1month', '3months', '6months'];

        if (!in_array($duration, $validDurations, true)) {
            throw new \InvalidArgumentException('Invalid duration.');
        }

        $plan = Plan::where('plan_key', $planType)
                    ->where('is_active', true)
                    ->first();

        if (!$plan) {
            throw new \InvalidArgumentException("Plan '{$planType}' not found or inactive.");
        }

        return $plan->pricingFor($duration);
    }
}