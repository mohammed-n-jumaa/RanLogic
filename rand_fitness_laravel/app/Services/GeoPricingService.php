<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GeoPricingService
{
    protected array $countryCurrency = [
        'JO' => ['currency' => 'JOD', 'symbol' => 'د.أ'],
        'SA' => ['currency' => 'SAR', 'symbol' => 'ر.س'],
        'AE' => ['currency' => 'AED', 'symbol' => 'د.إ'],
        'KW' => ['currency' => 'KWD', 'symbol' => 'د.ك'],
        'QA' => ['currency' => 'QAR', 'symbol' => 'ر.ق'],
        'BH' => ['currency' => 'BHD', 'symbol' => 'د.ب'],
        'OM' => ['currency' => 'OMR', 'symbol' => 'ر.ع'],
        'EG' => ['currency' => 'EGP', 'symbol' => 'ج.م'],
        'IQ' => ['currency' => 'IQD', 'symbol' => 'ع.د'],
        'MA' => ['currency' => 'MAD', 'symbol' => 'د.م'],
        'TN' => ['currency' => 'TND', 'symbol' => 'د.ت'],
        'LB' => ['currency' => 'USD', 'symbol' => '$'],
        'DE' => ['currency' => 'EUR', 'symbol' => '€'],
        'FR' => ['currency' => 'EUR', 'symbol' => '€'],
        'NL' => ['currency' => 'EUR', 'symbol' => '€'],
        'BE' => ['currency' => 'EUR', 'symbol' => '€'],
        'SE' => ['currency' => 'SEK', 'symbol' => 'kr'],
        'NO' => ['currency' => 'NOK', 'symbol' => 'kr'],
        'DK' => ['currency' => 'DKK', 'symbol' => 'kr'],
        'GB' => ['currency' => 'GBP', 'symbol' => '£'],
        'CH' => ['currency' => 'CHF', 'symbol' => 'Fr'],
        'CA' => ['currency' => 'CAD', 'symbol' => 'CA$'],
        'AU' => ['currency' => 'AUD', 'symbol' => 'A$'],
        'NZ' => ['currency' => 'NZD', 'symbol' => 'NZ$'],
        'US' => ['currency' => 'USD', 'symbol' => '$'],
    ];

    public function getCountryFromIp(string $ip): string
    {
        if (
            $ip === '127.0.0.1' ||
            $ip === '::1' ||
            str_starts_with($ip, '192.168.') ||
            str_starts_with($ip, '10.')
        ) {
            return config('app.env') === 'production' ? 'US' : 'JO';
        }

        $cacheKey = 'geo_ip_' . md5($ip);

        return Cache::remember($cacheKey, now()->addHours(24), function () use ($ip) {
            try {
                $response = Http::timeout(3)
                    ->get("http://ip-api.com/json/{$ip}", [
                        'fields' => 'countryCode,status',
                    ]);

                if ($response->successful() && $response->json('status') === 'success') {
                    return (string) ($response->json('countryCode') ?? 'US');
                }
            } catch (\Exception $e) {
                Log::warning('GeoPricing: IP lookup failed', [
                    'ip'    => $ip,
                    'error' => $e->getMessage(),
                ]);
            }

            return 'US';
        });
    }

    public function getExchangeRate(string $targetCurrency): float
    {
        if ($targetCurrency === 'USD') {
            return 1.0;
        }

        $cacheKey = 'fx_rate_usd_' . $targetCurrency;

        return Cache::remember($cacheKey, now()->addHours(12), function () use ($targetCurrency) {
            // fawazahmed0 — العملة بـ lowercase
            $currencyLower = strtolower($targetCurrency);

            // URL رئيسي
            $primaryUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
            // URL احتياطي
            $fallbackUrl = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";

            foreach ([$primaryUrl, $fallbackUrl] as $url) {
                try {
                    $response = Http::timeout(5)->get($url);

                    if ($response->successful()) {
                        $rate = $response->json("usd.{$currencyLower}");

                        if ($rate && (float) $rate > 0) {
                            Log::info("GeoPricing: rate USD→{$targetCurrency} = {$rate}");
                            return (float) $rate;
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("GeoPricing: failed {$url}", ['error' => $e->getMessage()]);
                    continue;
                }
            }

            // Fallback ثابت إذا فشل كل شيء — أفضل من 1.0
            $staticRates = [
                'JOD' => 0.709,  'SAR' => 3.75,  'AED' => 3.6725,
                'KWD' => 0.308,  'QAR' => 3.64,  'BHD' => 0.376,
                'OMR' => 0.385,  'EGP' => 48.5,  'IQD' => 1310.0,
                'MAD' => 9.97,   'EUR' => 0.92,  'GBP' => 0.79,
                'CAD' => 1.36,   'AUD' => 1.53,
            ];

            if (isset($staticRates[$targetCurrency])) {
                Log::warning("GeoPricing: using static fallback for {$targetCurrency}");
                return $staticRates[$targetCurrency];
            }

            return 1.0;
        });
    }

    public function getCurrencyConfig(string $countryCode): array
    {
        $config = $this->countryCurrency[$countryCode]
                ?? $this->countryCurrency['US'];

        $rate = $this->getExchangeRate($config['currency']);

        return [
            'currency' => $config['currency'],
            'symbol'   => $config['symbol'],
            'rate'     => $rate,
            'country'  => $countryCode,
        ];
    }

    public function convertPrice(float $usdPrice, float $rate): float
    {
        $converted = $usdPrice * $rate;

        if ($converted >= 1000) {
            return round($converted / 50) * 50;
        } elseif ($converted >= 100) {
            return round($converted / 5) * 5;
        } elseif ($converted >= 10) {
            return round($converted);
        } else {
            return round($converted, 2);
        }
    }

    public function convertPlanPricing(array $pricing, float $rate): array
    {
        $result = [];
        foreach ($pricing as $duration => $data) {
            $result[$duration] = [
                'price'         => $this->convertPrice((float) $data['price'], $rate),
                'originalPrice' => $this->convertPrice((float) $data['originalPrice'], $rate),
                'discount'      => $data['discount'],
                'usd_price'     => (float) $data['price'],
                'usd_original'  => (float) $data['originalPrice'],
            ];
        }
        return $result;
    }
}