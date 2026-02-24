<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected string $clientId;
    protected string $secret;
    protected bool $sandbox;
    protected string $currency;
    protected string $baseUrl;

    public function __construct()
    {
        $this->clientId = (string) config('services.paypal.client_id');
        $this->secret   = (string) config('services.paypal.secret');
        $this->sandbox  = (bool)   config('services.paypal.sandbox', true);
        $this->currency = (string) config('services.paypal.currency', 'USD');

        $this->baseUrl = $this->sandbox
            ? 'https://api-m.sandbox.paypal.com'
            : 'https://api-m.paypal.com';

        Log::info('PayPal Config Loaded', [
            'sandbox' => $this->sandbox,
            'baseUrl' => $this->baseUrl,
            'has_client_id' => !empty($this->clientId),
            'has_secret' => !empty($this->secret),
        ]);
    }

    /**
     * Get PayPal access token
     */
    public function getAccessToken(): string
    {
        if (!$this->clientId || !$this->secret) {
            throw new \Exception('PayPal credentials are missing (client_id/secret).');
        }

        $url = $this->baseUrl . '/v1/oauth2/token';

        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->secret)
            ->timeout(60)
            ->post($url, [
                'grant_type' => 'client_credentials',
            ]);

        if (!$response->successful()) {
            Log::error('PayPal token error', [
                'status' => $response->status(),
                'body' => $response->body(),
                'baseUrl' => $this->baseUrl,
                'sandbox' => $this->sandbox,
            ]);

            throw new \Exception('PayPal token request failed: ' . $response->body());
        }

        $data = $response->json();

        if (empty($data['access_token'])) {
            throw new \Exception('PayPal access_token missing in response.');
        }

        return (string) $data['access_token'];
    }

    /**
     * Create PayPal order
     */
    public function createPayPalOrder(array $payload): array
    {
        $token = $this->getAccessToken();

        $amount = number_format((float)($payload['amount'] ?? 0), 2, '.', '');
        if ((float)$amount <= 0) {
            throw new \Exception('Invalid amount for PayPal order.');
        }

        $url = $this->baseUrl . '/v2/checkout/orders';

        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        $subscriptionId = $payload['subscription_id'] ?? '0';

        $returnUrl = "{$frontendUrl}/payment/success?subscription_id={$subscriptionId}";
        $cancelUrl = "{$frontendUrl}/payment/cancel?subscription_id={$subscriptionId}";

        $body = [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'reference_id' => 'sub_' . $subscriptionId,
                    'description'  => (string)($payload['description'] ?? 'Fitness Subscription'),
                    'amount' => [
                        'currency_code' => $payload['currency'] ?? $this->currency,
                        'value' => $amount,
                    ],
                ],
            ],
            'application_context' => [
                'return_url' => $returnUrl,
                'cancel_url' => $cancelUrl,
                'brand_name' => config('app.name', 'Fitness'),
                'user_action' => 'PAY_NOW',
            ],
        ];

        $response = Http::withToken($token)
            ->acceptJson()
            ->timeout(60)
            ->post($url, $body);

        if (!$response->successful()) {
            Log::error('PayPal create order failed', [
                'status' => $response->status(),
                'json' => $response->json(),
                'raw' => $response->body(),
                'baseUrl' => $this->baseUrl,
                'sandbox' => $this->sandbox,
                'request' => $body,
            ]);

            throw new \Exception('PayPal create order failed: ' . json_encode($response->json(), JSON_UNESCAPED_UNICODE));
        }

        $data = $response->json();

        if (empty($data['id'])) {
            Log::error('PayPal order id missing', ['response' => $data]);
            throw new \Exception('PayPal order response missing id.');
        }

        return $data;
    }

    /**
     * ✅ Capture PayPal order (FIXED 100%: إرسال {} وليس [] )
     */
    public function capturePayPalOrder(string $orderId): array
    {
        if (!$orderId) {
            throw new \Exception('Order ID is required for capture.');
        }

        $token = $this->getAccessToken();
        $url = $this->baseUrl . "/v2/checkout/orders/{$orderId}/capture";

        /**
         * ✅ سبب خطأ MALFORMED_REQUEST_JSON عندك:
         * PayPal يستقبل Body = [] (Array) ويعتبره JSON غير صحيح لهذا الـ endpoint.
         *
         * ✅ الحل المؤكد:
         * نرسل body حرفيًا "{}" كـ JSON Object فارغ.
         */
        $response = Http::withToken($token)
            ->acceptJson()
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->timeout(60)
            ->send('POST', $url, [
                'body' => '{}', // ✅ مهم جداً: {} وليس [] ولا null
            ]);

        if (!$response->successful()) {
            $json = $response->json();

            Log::error('PayPal capture failed', [
                'status' => $response->status(),
                'json' => $json,
                'raw' => $response->body(),
                'order_id' => $orderId,
                'baseUrl' => $this->baseUrl,
                'sandbox' => $this->sandbox,
            ]);

            throw new \Exception('PayPal capture failed: ' . json_encode($json, JSON_UNESCAPED_UNICODE));
        }

        return $response->json();
    }

    /**
     * Get approval URL
     */
    public function getApprovalUrl(array $paypalOrder): ?string
    {
        foreach (($paypalOrder['links'] ?? []) as $link) {
            if (($link['rel'] ?? null) === 'approve') {
                return $link['href'] ?? null;
            }
        }
        return null;
    }
}
