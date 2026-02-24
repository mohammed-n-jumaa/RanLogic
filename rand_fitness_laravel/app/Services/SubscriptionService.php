<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class SubscriptionService
{
    protected $paypalService;

    public function __construct()
    {
        $this->paypalService = new PayPalService();
    }

    /**
     * إنشاء اشتراك PayPal
     */
    public function createPayPalSubscription(array $data, User $user)
    {
        try {
            Log::info('Creating PayPal subscription', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'plan_type' => $data['plan_type'] ?? null,
                'amount' => $data['amount'] ?? null,
            ]);

            // إنشاء طلب PayPal
            $paypalData = [
                'amount' => $data['amount'] ?? 29.99,
                'currency' => $data['currency'] ?? 'USD',
                'description' => $data['description'] ?? 'Monthly Fitness Subscription',
                'reference_id' => 'sub_' . $user->id . '_' . time(),
                'return_url' => url('/subscription/success'),
                'cancel_url' => url('/subscription/cancel'),
            ];

            $paypalResult = $this->paypalService->createOrder($paypalData);

            if (!$paypalResult['success']) {
                Log::error('PayPal order creation failed', [
                    'error' => $paypalResult['error'] ?? 'Unknown error',
                    'user_id' => $user->id,
                ]);

                return [
                    'success' => false,
                    'error' => $paypalResult['error'] ?? 'Failed to create PayPal order',
                ];
            }

            // حفظ معلومات الاشتراك في قاعدة البيانات
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'paypal_order_id' => $paypalResult['order_id'] ?? null,
                'plan_type' => $data['plan_type'] ?? 'monthly',
                'amount' => $data['amount'] ?? 29.99,
                'currency' => $data['currency'] ?? 'USD',
                'status' => 'pending',
                'metadata' => json_encode($paypalResult),
            ]);

            Log::info('Subscription created in database', [
                'subscription_id' => $subscription->id,
                'paypal_order_id' => $paypalResult['order_id'] ?? null,
                'status' => 'pending',
            ]);

            return [
                'success' => true,
                'subscription_id' => $subscription->id,
                'order_id' => $paypalResult['order_id'] ?? null,
                'approval_url' => $this->getApprovalUrl($paypalResult['links'] ?? []),
                'data' => $paypalResult,
            ];

        } catch (\Exception $e) {
            Log::error('Subscription creation error in service', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $user->id ?? 'unknown',
            ]);

            return [
                'success' => false,
                'error' => 'Subscription creation failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * استخراج رابط الموافقة من روابط PayPal
     */
    private function getApprovalUrl(array $links)
    {
        foreach ($links as $link) {
            // ✅ تعديل مهم: links عادة Array وليس Object
            if (($link['rel'] ?? null) === 'approve') {
                return $link['href'] ?? null;
            }
        }

        return null;
    }

    /**
     * معالجة نجاح الدفع
     */
    public function handlePaymentSuccess($orderId)
    {
        try {
            // تأكيد الطلب من PayPal
            $captureResult = $this->paypalService->captureOrder($orderId);

            if (!$captureResult['success']) {
                Log::error('PayPal capture failed', [
                    'order_id' => $orderId,
                    'error' => $captureResult['error'],
                ]);

                return [
                    'success' => false,
                    'error' => 'Payment capture failed',
                ];
            }

            // تحديث حالة الاشتراك في قاعدة البيانات
            $subscription = Subscription::where('paypal_order_id', $orderId)->first();

            if ($subscription) {
                $subscription->update([
                    'status' => 'active',
                    'paypal_capture_id' => $captureResult['capture_id'] ?? null,
                    'started_at' => now(),
                    'expires_at' => now()->addMonth(),
                ]);

                // تحديث حالة المستخدم
                $user = $subscription->user;
                $user->update([
                    'has_active_subscription' => true,
                    'subscription_expires_at' => now()->addMonth(),
                ]);

                Log::info('Subscription activated successfully', [
                    'subscription_id' => $subscription->id,
                    'user_id' => $user->id,
                    'capture_id' => $captureResult['capture_id'] ?? null,
                ]);
            }

            return [
                'success' => true,
                'subscription' => $subscription,
                'capture_data' => $captureResult,
            ];

        } catch (\Exception $e) {
            Log::error('Payment success handling error', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => 'Payment processing failed: ' . $e->getMessage(),
            ];
        }
    }
}
