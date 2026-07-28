<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],
   'paypal' => [
    'client_id' => env('PAYPAL_CLIENT_ID'),
    'secret' => env('PAYPAL_SECRET'),
    'sandbox' => env('PAYPAL_SANDBOX', true),
    'currency' => env('PAYPAL_CURRENCY', 'USD'),
   ],
   'onesignal' => [
    'app_id'       => env('ONE_SIGNAL_APP_ID'),
    'rest_api_key' => env('ONE_SIGNAL_REST_API_KEY'),
   ],

  'firebase' => [
    'project_id'   => env('FIREBASE_PROJECT_ID'),
    'credentials'  => env('FIREBASE_CREDENTIALS', 'storage/app/firebase-service-account.json'),
    'vapid_public' => env('FIREBASE_VAPID_PUBLIC'),
'vapid_private' => env('FIREBASE_VAPID_PRIVATE_PEM'),
'vapid_private_raw' => env('FIREBASE_VAPID_PRIVATE'),


],
];
