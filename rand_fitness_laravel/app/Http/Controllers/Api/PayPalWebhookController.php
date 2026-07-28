<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PayPalWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('PayPal Webhook HIT');

        $payload = $request->all();
        $eventType = $payload['event_type'] ?? null;
        $orderId = $payload['resource']['supplementary_data']['related_ids']['order_id'] ?? null;

        Log::info('PayPal Webhook Received', [
            'event_type' => $eventType,
            'order_id' => $orderId,
            'payload' => $payload,
        ]);

        try {
            switch ($eventType) {
                case 'PAYMENT.CAPTURE.COMPLETED':
                    if (!$orderId) {
                        Log::warning('PayPal Webhook: order_id missing', [
                            'event_type' => $eventType,
                        ]);

                        return response()->json([
                            'status' => 'ignored',
                            'message' => 'order_id missing',
                        ], 200);
                    }

                    $subscription = Subscription::where('paypal_order_id', $orderId)->first();

                    if (!$subscription) {
                        Log::warning('PayPal Webhook: subscription not found', [
                            'event_type' => $eventType,
                            'order_id' => $orderId,
                        ]);

                        return response()->json([
                            'status' => 'not_found',
                        ], 200);
                    }

                    Log::info('PayPal Webhook: subscription matched', [
                        'subscription_id' => $subscription->id,
                        'user_id' => $subscription->user_id,
                        'current_status' => $subscription->status,
                        'order_id' => $orderId,
                    ]);

                    if ($subscription->status === 'approved') {
                        Log::info('PayPal Webhook: subscription already approved', [
                            'subscription_id' => $subscription->id,
                            'order_id' => $orderId,
                        ]);

                        return response()->json([
                            'status' => 'ok',
                            'message' => 'already approved',
                        ], 200);
                    }

                    $startsAt = now();
                    $endsAt = match ($subscription->duration) {
                        '3months' => $startsAt->copy()->addMonths(3),
                        '6months' => $startsAt->copy()->addMonths(6),
                        default => $startsAt->copy()->addMonth(),
                    };

                    $subscription->update([
                        'status' => 'approved',
                        'starts_at' => $startsAt,
                        'ends_at' => $endsAt,
                    ]);

                    if ($subscription->user) {
                        $subscription->user->update([
                            'has_active_subscription' => true,
                            'subscription_start_date' => $startsAt->toDateString(),
                            'subscription_end_date' => $endsAt->toDateString(),
                        ]);
                    }

                    Log::info('PayPal Webhook: subscription approved successfully', [
                        'subscription_id' => $subscription->id,
                        'user_id' => $subscription->user_id,
                        'order_id' => $orderId,
                        'starts_at' => $startsAt->format('Y-m-d H:i:s'),
                        'ends_at' => $endsAt->format('Y-m-d H:i:s'),
                    ]);

                    break;

                case 'PAYMENT.CAPTURE.DENIED':
                    Log::warning('PayPal Webhook: payment denied', [
                        'event_type' => $eventType,
                        'order_id' => $orderId,
                        'payload' => $payload,
                    ]);
                    break;

                case 'PAYMENT.CAPTURE.REFUNDED':
                    Log::warning('PayPal Webhook: payment refunded', [
                        'event_type' => $eventType,
                        'order_id' => $orderId,
                        'payload' => $payload,
                    ]);
                    break;

                default:
                    Log::info('PayPal Webhook: unhandled event type', [
                        'event_type' => $eventType,
                        'order_id' => $orderId,
                    ]);
                    break;
            }

            return response()->json([
                'status' => 'ok',
            ], 200);

        } catch (\Throwable $e) {
            Log::error('PayPal Webhook processing error', [
                'error' => $e->getMessage(),
                'event_type' => $eventType,
                'order_id' => $orderId,
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Webhook processing failed',
            ], 500);
        }
    }
}