<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;

class AuthController extends Controller
{
    /**
     * Handle admin login request.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $throttleKey = 'login-email:' . strtolower($request->email);

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'success' => false,
                'message' => "محاولات كثيرة جداً على هذا الحساب. حاول مرة أخرى بعد {$seconds} ثانية.",
            ], 429);
        }

        try {
            // Attempt to find user by email
            $user = User::where('email', $request->email)->first();

            // Check if user exists
            if (!$user) {
                RateLimiter::hit($throttleKey, 60);

                return response()->json([
                    'success' => false,
                    'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
                ], 401);
            }

            // Check password
            if (!Hash::check($request->password, $user->password)) {
                RateLimiter::hit($throttleKey, 60);

                Log::warning('Failed login attempt', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
                ], 401);
            }

            // Check if user is active
            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'حسابك غير نشط. يرجى التواصل مع الإدارة.',
                ], 403);
            }

            // Successful login — clear failed attempts
            RateLimiter::clear($throttleKey);

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            $user->load('activeSubscription');
            $activeSubscription = $user->activeSubscription;

            Log::info('Successful login', [
                'user_id' => $user->id,
                'role' => $user->role,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح.',
                'data' => [
                    'user' => (new UserResource($user))->minimal(),
                    'token' => $token,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'email' => $request->email ?? 'unknown',
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تسجيل الدخول.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Handle user registration request.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            // Check if email already exists
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'هذا البريد الإلكتروني مستخدم بالفعل.',
                ], 422);
            }

            // Create new user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user', // Default role
                'is_active' => true,
                'language' => $request->language ?? 'ar',
                'gender' => $request->gender ?? null,
                'age' => $request->age ?? null,
                'phone' => $request->phone ?? null,
            ]);

            // Create token for immediate login
            $token = $user->createToken('auth_token')->plainTextToken;

            $user->load('activeSubscription');
            $activeSubscription = $user->activeSubscription;

            Log::info('New user registered', [
                'user_id' => $user->id,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح!',
                'data' => [
                    'user' => (new UserResource($user))->minimal(),
                    'token' => $token,
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage(), [
                'email' => $request->email ?? 'unknown',
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء إنشاء الحساب.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get authenticated user information.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $user->load('activeSubscription');
            $activeSubscription = $user->activeSubscription;

            return response()->json([
                'success' => true,
                'data' => new UserResource($user),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Me endpoint error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب معلومات المستخدم.',
            ], 500);
        }
    }

    /**
     * Logout user (revoke token).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            Log::info('User logged out', [
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الخروج بنجاح.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تسجيل الخروج.',
            ], 500);
        }
    }

    /**
     * Revoke all user tokens.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logoutAll(Request $request): JsonResponse
    {
        try {
            // Revoke all tokens
            $request->user()->tokens()->delete();

            Log::info('All user tokens revoked', [
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الخروج من جميع الأجهزة بنجاح.',
            ], 200);

        } catch (\Exception $e) {
            Log::error('Logout all error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تسجيل الخروج.',
            ], 500);
        }
    }

    /**
     * Refresh user token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            // Create new token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الجلسة بنجاح.',
                'data' => [
                    'token' => $token,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء تحديث الجلسة.',
            ], 500);
        }
    }
}