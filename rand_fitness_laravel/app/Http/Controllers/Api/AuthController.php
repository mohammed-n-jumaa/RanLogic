<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

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
        try {
            // Attempt to find user by email
            $user = User::where('email', $request->email)->first();

            // Check if user exists
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
                ], 401);
            }

            // Check password
            if (!Hash::check($request->password, $user->password)) {
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

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            // ✅ Get active subscription - استخدم starts_at و ends_at
            $activeSubscription = Subscription::where('user_id', $user->id)
                ->where('status', 'approved')
                ->where('ends_at', '>=', now())
                ->latest()
                ->first();

            Log::info('Successful login', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم تسجيل الدخول بنجاح.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'gender' => $user->gender,
                        'avatar_url' => $user->avatar_url,
                        'has_active_subscription' => $user->has_active_subscription,
                        'subscription_start_date' => $activeSubscription ? $activeSubscription->starts_at : null,
                        'subscription_end_date' => $activeSubscription ? $activeSubscription->ends_at : null,
                        'subscription_plan_type' => $activeSubscription ? $activeSubscription->plan_type : null,
                        'language' => $user->language ?? 'ar',
                    ],
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

            // ✅ Get active subscription - استخدم starts_at و ends_at
            $activeSubscription = Subscription::where('user_id', $user->id)
                ->where('status', 'approved')
                ->where('ends_at', '>=', now())
                ->latest()
                ->first();

            Log::info('New user registered', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إنشاء الحساب بنجاح!',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'gender' => $user->gender,
                        'avatar_url' => $user->avatar_url,
                        'has_active_subscription' => $user->has_active_subscription,
                        'subscription_start_date' => $activeSubscription ? $activeSubscription->starts_at : null,
                        'subscription_end_date' => $activeSubscription ? $activeSubscription->ends_at : null,
                        'subscription_plan_type' => $activeSubscription ? $activeSubscription->plan_type : null,
                        'language' => $user->language,
                    ],
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

            // ✅ Get active subscription - استخدم starts_at و ends_at
            $activeSubscription = Subscription::where('user_id', $user->id)
                ->where('status', 'approved')
                ->where('ends_at', '>=', now())
                ->latest()
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'gender' => $user->gender,
                    'age' => $user->age,
                    'height' => $user->height,
                    'weight' => $user->weight,
                    'waist' => $user->waist,
                    'hips' => $user->hips,
                    'goal' => $user->goal,
                    'workout_place' => $user->workout_place,
                    'health_notes' => $user->health_notes,
                    'program' => $user->program,
                    'avatar_url' => $user->avatar_url,
                    'is_active' => $user->is_active,
                    'has_active_subscription' => $user->has_active_subscription,
                    'subscription_start_date' => $activeSubscription ? $activeSubscription->starts_at : null,
                    'subscription_end_date' => $activeSubscription ? $activeSubscription->ends_at : null,
                    'subscription_plan_type' => $activeSubscription ? $activeSubscription->plan_type : null,
                    'subscription_status' => $activeSubscription ? $activeSubscription->status : null,
                    'language' => $user->language ?? 'ar',
                    'email_verified_at' => $user->email_verified_at,
                ],
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