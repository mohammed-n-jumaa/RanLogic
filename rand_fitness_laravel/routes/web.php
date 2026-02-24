<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// في ملف routes/web.php
Route::get('/payment/success', function () {
    return view('payment-success');  // عرض صفحة نجاح الدفع
});


Route::get('/payment/cancel', function () {
    return view('payment-cancel');
})->name('payment.cancel');

Route::get('/test-paypal', function () {
    return Http::timeout(30)
        ->get('https://api-m.sandbox.paypal.com')
        ->status();
});
Route::get('/test-paypal-token', function () {
    $client = env('PAYPAL_CLIENT_ID');
    $secret = env('PAYPAL_SECRET');
    $base = env('PAYPAL_BASE_URL', 'https://api-m.sandbox.paypal.com');

    $res = Http::asForm()
        ->withBasicAuth($client, $secret)
        ->timeout(30)
        ->post($base . '/v1/oauth2/token', [
            'grant_type' => 'client_credentials'
        ]);

    return response()->json([
        'status' => $res->status(),
        'body' => $res->json()
    ]);
});

Route::get('/debug-paypal-order/{id}', function ($id) {
    return app(\App\Services\PaymentService::class)->getPayPalOrder($id);
});
Route::get('/debug-capture/{id}', function ($id) {
    return app(\App\Services\PaymentService::class)->capturePayPalOrder($id);
});