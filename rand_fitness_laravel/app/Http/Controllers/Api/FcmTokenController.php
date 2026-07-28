<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ChatService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FcmTokenController extends Controller
{
    public function __construct(protected ChatService $chatService) {}

    public function store(Request $request): JsonResponse
{
    $request->validate([
        'fcm_token'        => ['nullable', 'string', 'max:500'],
        'onesignal_id'     => ['nullable', 'string', 'max:500'],
    ]);

    $userId = auth()->id();

    if ($request->filled('onesignal_id')) {
        \App\Models\User::where('id', $userId)
            ->update(['onesignal_id' => $request->string('onesignal_id')->toString()]);
    }

    if ($request->filled('fcm_token')) {
        $this->chatService->saveFcmToken($userId, $request->string('fcm_token')->toString());
    }

    return response()->json(['success' => true]);
}
}