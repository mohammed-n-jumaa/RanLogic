<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Subscription;
use App\Services\ImageOptimizationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    protected ImageOptimizationService $imageOptimizer;

    public function __construct(ImageOptimizationService $imageOptimizer)
    {
        $this->imageOptimizer = $imageOptimizer;
    }

    /**
     * Display the authenticated user's profile
     * GET /api/profile
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            $user->load('activeSubscription');
            
            return response()->json([
                'success' => true,
                'data' => new UserResource($user),
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error fetching profile: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء جلب البيانات',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
 * Update the authenticated user's profile
 * PUT /api/profile
 */
public function updateProfile(Request $request): JsonResponse
{
    try {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => "sometimes|email|max:255|unique:users,email,{$user->id}",
            'phone' => 'nullable|string|max:20',
            'height' => 'nullable|numeric|min:0',
            'weight' => 'nullable|numeric|min:0',
            'waist' => 'nullable|numeric|min:0',
            'hips' => 'nullable|numeric|min:0',
            'age' => 'nullable|integer|min:1|max:120',
            'gender' => 'nullable|in:male,female',
            'goal' => 'nullable|in:weight-loss,muscle-gain,toning,fitness',
            'workout_place' => 'nullable|in:home,gym',
            'program' => 'nullable|string|max:255',
            'health_notes' => 'nullable|string|max:1000',
            'photo' => 'nullable|string', // for base64 image
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        // Handle photo if provided as base64
        if ($request->has('photo') && is_string($request->photo)) {
            $imageData = $request->photo;
            
            // Extract base64 data
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $type = strtolower($type[1]);
                
                if (in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                    $imageData = base64_decode($imageData);
                    
                    if ($imageData !== false) {
                        // Delete old avatar if exists
                        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                            Storage::disk('public')->delete($user->avatar);
                        }
                        
                        // Save new image
                        $fileName = 'avatar_' . $user->id . '_' . time() . '.' . $type;
                        $filePath = 'avatars/' . $fileName;
                        Storage::disk('public')->put($filePath, $imageData);
                        
                        $user->avatar = $filePath;
                    }
                }
            }
        }
        
        // Update other fields
        $updateData = $request->only([
            'name',
            'email',
            'phone',
            'height',
            'weight',
            'waist',
            'hips',
            'age',
            'gender',
            'goal',
            'workout_place',
            'program',
            'health_notes',
        ]);
        
        $user->update($updateData);
        
       
        if (isset($updateData['weight']) && $updateData['weight']) {
            \App\Models\WeightLog::updateOrCreate(
                ['user_id' => $user->id, 'logged_at' => today()],
                ['weight' => $updateData['weight']]
            );
        }

        // Save avatar if it was updated
        if (isset($user->avatar)) {
            $user->save();
        }
        
        $user->load('activeSubscription');
        
        return response()->json([
            'success' => true,
            'message' => 'تم تحديث الملف الشخصي بنجاح',
            'data' => new UserResource($user),
        ], 200);
        
    } catch (\Exception $e) {
        Log::error('Error updating profile: ' . $e->getMessage());
        Log::error($e->getTraceAsString());
        
        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ أثناء تحديث البيانات',
            'error' => config('app.debug') ? $e->getMessage() : null,
        ], 500);
    }
}

    /**
 * Update the authenticated user's password
 * PUT /api/profile/password
 */
public function updatePassword(Request $request): JsonResponse
{
    try {
        $validator = Validator::make($request->all(), [
            'current_password' => 'nullable|string',
            'new_password' => 'required|string|min:6',
            'confirm_password' => 'required|string|same:new_password',
        ], [
            'new_password.required' => 'كلمة المرور الجديدة مطلوبة',
            'new_password.min' => 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
            'confirm_password.required' => 'تأكيد كلمة المرور مطلوب',
            'confirm_password.same' => 'كلمة المرور غير متطابقة',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في البيانات المدخلة',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $user = $request->user();
        
        // Verify current password if provided and not empty
        if ($request->current_password && !empty($request->current_password)) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'كلمة المرور الحالية غير صحيحة',
                    'errors' => [
                        'current_password' => ['كلمة المرور الحالية غير صحيحة']
                    ]
                ], 422);
            }
        }
        
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'تم تحديث كلمة المرور بنجاح',
        ], 200);
        
    } catch (\Exception $e) {
        Log::error('Error updating password: ' . $e->getMessage());
        Log::error($e->getTraceAsString());
        
        return response()->json([
            'success' => false,
            'message' => 'حدث خطأ أثناء تحديث كلمة المرور',
            'error' => config('app.debug') ? $e->getMessage() : null,
        ], 500);
    }
}

    /**
     * Upload profile photo
     * POST /api/profile/photo
     */
    public function uploadPhoto(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            // Check if it's base64 or file upload
            if ($request->has('photo') && is_string($request->photo)) {
                // Base64 image
                $imageData = $request->photo;
                
                // Extract base64 data
                if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                    $type = strtolower($type[1]); // jpg, png, gif
                    
                    if (!in_array($type, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Invalid image type',
                        ], 422);
                    }
                    
                    $imageData = base64_decode($imageData);
                    
                    if ($imageData === false) {
                        return response()->json([
                            'success' => false,
                            'message' => 'Base64 decode failed',
                        ], 422);
                    }
                    
                    // Delete old avatar if exists
                    if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                        Storage::disk('public')->delete($user->avatar);
                    }
                    
                    // Save new image
                    $fileName = 'avatar_' . $user->id . '_' . time() . '.' . $type;
                    $filePath = 'avatars/' . $fileName;
                    Storage::disk('public')->put($filePath, $imageData);
                    
                    $user->update(['avatar' => $filePath]);
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid base64 image format',
                    ], 422);
                }
            } elseif ($request->hasFile('avatar')) {
                // File upload
                $validator = Validator::make($request->all(), [
                    'avatar' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
                ]);
                
                if ($validator->fails()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'خطأ في الصورة المرفوعة',
                        'errors' => $validator->errors(),
                    ], 422);
                }
                
                // Delete old avatar if exists
                if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                    Storage::disk('public')->delete($user->avatar);
                }
                
                $avatarFile = $request->file('avatar');
                $filePath = $avatarFile->store('avatars', 'public');
                $this->imageOptimizer->optimize($avatarFile, $filePath, 'public', maxWidth: 600, maxHeight: 600);
                $user->update(['avatar' => $filePath]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'No photo provided',
                ], 422);
            }
            
            $user->load('activeSubscription');
            
            return response()->json([
                'success' => true,
                'message' => 'تم رفع الصورة بنجاح',
                'data' => (new UserResource($user))->onlyAvatar(),
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error uploading photo: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء رفع الصورة',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete profile photo
     * DELETE /api/profile/photo
     */
    public function deletePhoto(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }
            
            $user->update(['avatar' => null]);
            
            return response()->json([
                'success' => true,
                'message' => 'تم حذف الصورة بنجاح',
                'data' => [
                    'avatar_url' => $user->avatar_url,
                ],
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error deleting photo: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ أثناء حذف الصورة',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}