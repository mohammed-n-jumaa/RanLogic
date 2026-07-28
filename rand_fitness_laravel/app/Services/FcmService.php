<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
class FcmService
{
    private string $projectId;
    private string $credentialsPath;
    private string $vapidPublicKey;
    private string $vapidPrivateKey;

    public function __construct()
    {
        $this->projectId = config('services.firebase.project_id');
        $this->credentialsPath = base_path(config('services.firebase.credentials'));
        $this->vapidPublicKey = config('services.firebase.vapid_public');
        $this->vapidPrivateKey = config('services.firebase.vapid_private_raw');
    }

    public function sendNotification(string $fcmToken, string $title, string $body, array $data = []): bool
    {
        // تحقق إذا كان Web Push Subscription أو FCM token
        $decoded = json_decode($fcmToken, true);

        if (isset($decoded['endpoint'])) {
            return $this->sendWebPush($decoded, $title, $body, $data);
        }

        return $this->sendFcm($fcmToken, $title, $body, $data);
    }

    private function sendWebPush(array $subscription, string $title, string $body, array $data = []): bool
{
    try {
        $auth = [
            'VAPID' => [
                'subject'    => 'mailto:' . config('mail.from.address', 'admin@ranlogic.com'),
                'publicKey'  => $this->vapidPublicKey,
                'privateKey' => $this->vapidPrivateKey,
            ],
        ];

        $webPush = new \Minishlink\WebPush\WebPush($auth);

        $sub = \Minishlink\WebPush\Subscription::create([
            'endpoint'        => $subscription['endpoint'],
            'contentEncoding' => 'aes128gcm',
            'keys'            => [
                'p256dh' => $subscription['keys']['p256dh'],
                'auth'   => $subscription['keys']['auth'],
            ],
        ]);

        $payload = json_encode([
            'notification' => [
                'title' => $title,
                'body'  => $body,
                'icon'  => '/icons/icon-192x192.png',
                'badge' => '/icons/icon-192x192.png',
                'data'  => $data,
            ],
            'data' => $data,
        ]);

        $webPush->queueNotification($sub, $payload);

        foreach ($webPush->flush() as $report) {
            if (!$report->isSuccess()) {
                Log::error('Web Push failed', [
                    'reason'   => $report->getReason(),
                    'endpoint' => $report->getEndpoint(),
                ]);
                return false;
            }
        }

        return true;
    } catch (\Throwable $e) {
        Log::error('Web Push exception: ' . $e->getMessage());
        return false;
    }
}

    private function buildVapidHeaders(string $endpoint, string $payload, string $p256dh, string $auth): array
    {
        $urlParts = parse_url($endpoint);
        $audience = $urlParts['scheme'] . '://' . $urlParts['host'];

        $now = time();
        $expiry = $now + 43200;

        $header = $this->base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'ES256']));
        $claims = $this->base64UrlEncode(json_encode([
            'aud' => $audience,
            'exp' => $expiry,
            'sub' => 'mailto:' . config('mail.from.address', 'admin@ranlogic.com'),
        ]));

        $signingInput = "$header.$claims";

        $keyResource = openssl_pkey_get_private($this->vapidPrivateKey);
if (!$keyResource) {
    Log::error('VAPID: failed to load private key');
    return [];
}

if (!openssl_sign($signingInput, $signature, $keyResource, 'SHA256')) {
    Log::error('VAPID: openssl_sign failed: ' . openssl_error_string());
    return [];
}

       

        $jwt = "$signingInput." . $this->base64UrlEncode($signature);

        try {
    $encryptedPayload = $this->encryptPayload($payload, $p256dh, $auth);
} catch (\Throwable $e) {
    Log::error('encryptPayload failed: ' . $e->getMessage());
    return [];
}

        return [
            'Authorization: vapid t=' . $jwt . ', k=' . $this->vapidPublicKey,
            'Content-Type: application/octet-stream',
            'Content-Encoding: aes128gcm',
            'TTL: 86400',
            'Content-Length: ' . strlen($encryptedPayload),
        ];
    }

    private function encryptPayload(string $payload, string $p256dh, string $auth): string
{
    $userPublicKey = base64_decode(strtr($p256dh, '-_', '+/'));
    $userAuth = base64_decode(strtr($auth, '-_', '+/'));

    // توليد server key pair
    $serverKeyPair = openssl_pkey_new([
        'curve_name' => 'prime256v1',
        'private_key_type' => OPENSSL_KEYTYPE_EC,
    ]);

    $serverKeyDetails = openssl_pkey_get_details($serverKeyPair);
    $serverPublicKeyUncompressed = "\x04"
        . $serverKeyDetails['ec']['x']
        . $serverKeyDetails['ec']['y'];

    // حساب ECDH shared secret
    $userX = substr($userPublicKey, 1, 32);
    $userY = substr($userPublicKey, 33, 32);

    // بناء shared secret يدوياً من EC coordinates
    $serverPrivateD = $serverKeyDetails['ec']['d'];

    // استخدام openssl_pkey_derive للـ ECDH
    $userKeyDer = "\x30\x59"
        . "\x30\x13"
        . "\x06\x07\x2a\x86\x48\xce\x3d\x02\x01"
        . "\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07"
        . "\x03\x42\x00\x04"
        . $userX
        . $userY;

    $userPublicKeyPem = "-----BEGIN PUBLIC KEY-----\n"
        . chunk_split(base64_encode($userKeyDer), 64, "\n")
        . "-----END PUBLIC KEY-----\n";

    $userKeyResource = openssl_pkey_get_public($userPublicKeyPem);

    // openssl_pkey_derive (PHP 7.3+)
    $sharedSecret = openssl_pkey_derive($userKeyResource, $serverKeyPair, 32);

    if (!$sharedSecret) {
        throw new \Exception('ECDH failed: ' . openssl_error_string());
    }

    $salt = random_bytes(16);

    // HKDF Extract
    $prk = hash_hmac('sha256', $sharedSecret, $userAuth, true);

    // HKDF Expand
    $info = "WebPush: info\x00" . $userPublicKey . $serverPublicKeyUncompressed;
    $ikm = hash_hmac('sha256', $info . "\x01", $prk, true);

    $cek = substr(hash_hmac('sha256', "Content-Encoding: aes128gcm\x00\x01", $ikm, true), 0, 16);
    $nonce = substr(hash_hmac('sha256', "Content-Encoding: nonce\x00\x01", $ikm, true), 0, 12);

    $encrypted = openssl_encrypt(
        $payload . "\x02",
        'aes-128-gcm',
        $cek,
        OPENSSL_RAW_DATA,
        $nonce,
        $tag
    );

    return $salt
        . pack('N', 4096)
        . pack('C', strlen($serverPublicKeyUncompressed))
        . $serverPublicKeyUncompressed
        . $encrypted
        . $tag;
}

    private function vapidPrivateKeyToPem(string $privateKey): string
{
    $decoded = base64_decode(strtr($privateKey, '-_', '+/'));

    // EC PRIVATE KEY format (RFC 5915)
    $der = "\x30\x77"                           // SEQUENCE (119 bytes)
        . "\x02\x01\x01"                        // INTEGER version = 1
        . "\x04\x20" . $decoded                 // OCTET STRING (32 bytes) = private key
        . "\xa0\x0a"                            // [0] EXPLICIT
        . "\x06\x08\x2a\x86\x48\xce\x3d\x03\x01\x07"  // OID prime256v1
        . "\xa1\x44"                            // [1] EXPLICIT
        . "\x03\x42\x00\x04"                    // BIT STRING
        . str_repeat("\x00", 64);               // placeholder public key

    return "-----BEGIN EC PRIVATE KEY-----\n"
        . chunk_split(base64_encode($der), 64, "\n")
        . "-----END EC PRIVATE KEY-----\n";
}

    private function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function sendFcm(string $fcmToken, string $title, string $body, array $data = []): bool
    {
        try {
            $accessToken = $this->getAccessToken();

            if (!$accessToken) {
                Log::error('FCM: Failed to get access token');
                return false;
            }

            $url = "https://fcm.googleapis.com/v1/projects/{$this->projectId}/messages:send";

            $payload = [
                'message' => [
                    'token' => $fcmToken,
                    'notification' => [
                        'title' => $title,
                        'body'  => $body,
                    ],
                    'webpush' => [
                        'notification' => [
                            'title' => $title,
                            'body'  => $body,
                            'icon'  => '/icons/icon-192x192.png',
                            'requireInteraction' => true,
                        ],
                        'fcm_options' => [
                            'link' => $data['url'] ?? '/',
                        ],
                    ],
                    'apns' => [
                        'payload' => [
                            'aps' => [
                                'alert' => [
                                    'title' => $title,
                                    'body'  => $body,
                                ],
                                'sound' => 'default',
                                'badge' => 1,
                            ],
                            'url' => $data['url'] ?? '/profile?tab=chat',
                        ],
                        'headers' => [
                            'apns-priority' => '10',
                        ],
                    ],
                    'data' => array_map('strval', $data),
                ],
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $accessToken,
                'Content-Type: application/json',
            ]);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            Log::info('FCM Response', [
                'http_code' => $httpCode,
                'response'  => $response,
            ]);

            if ($httpCode === 200) {
                return true;
            }

            Log::error('FCM send failed', [
                'http_code' => $httpCode,
                'response'  => $response,
            ]);

            return false;
        } catch (\Throwable $e) {
            Log::error('FCM exception: ' . $e->getMessage());
            return false;
        }
    }

    private function getAccessToken(): ?string
    {
        try {
            if (!file_exists($this->credentialsPath)) {
                Log::error('FCM: credentials file not found at ' . $this->credentialsPath);
                return null;
            }

            $credentials = json_decode(file_get_contents($this->credentialsPath), true);

            $now = time();
            $expiry = $now + 3600;

            $header = base64_encode(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
            $payload = base64_encode(json_encode([
                'iss'   => $credentials['client_email'],
                'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud'   => 'https://oauth2.googleapis.com/token',
                'exp'   => $expiry,
                'iat'   => $now,
            ]));

            $header  = rtrim(strtr($header, '+/', '-_'), '=');
            $payload = rtrim(strtr($payload, '+/', '-_'), '=');

            $privateKey = $credentials['private_key'];
            $keyResource = openssl_pkey_get_private($privateKey);

            openssl_sign(
                "$header.$payload",
                $signature,
                $keyResource,
                'SHA256'
            );

            $signature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
            $jwt = "$header.$payload.$signature";

            $ch = curl_init('https://oauth2.googleapis.com/token');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion'  => $jwt,
            ]));

            $response = json_decode(curl_exec($ch), true);
            curl_close($ch);

            return $response['access_token'] ?? null;
        } catch (\Throwable $e) {
            Log::error('FCM getAccessToken error: ' . $e->getMessage());
            return null;
        }
    }
}