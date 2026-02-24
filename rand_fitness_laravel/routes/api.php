<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LogoController;
use App\Http\Controllers\Api\AboutCoachController;
use App\Http\Controllers\Api\HeroSectionController;
use App\Http\Controllers\Api\CertificationController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\TrainingController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\AdminSubscriptionController;
use App\Http\Controllers\Api\DashboardController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them
| will be assigned to the "api" middleware group. Make something great!
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Public auth routes
Route::prefix('auth')->group(function () {

    // Login
    Route::post('/login', [AuthController::class, 'login'])
        ->name('api.auth.login');
        
    // Register
    Route::post('/register', [AuthController::class, 'register'])
        ->name('api.auth.register');

});

// Protected auth routes
Route::middleware(['auth:sanctum'])->prefix('auth')->group(function () {

    // Get authenticated user
    Route::get('/me', [AuthController::class, 'me'])
        ->name('api.auth.me');

    // Logout (current device)
    Route::post('/logout', [AuthController::class, 'logout'])
        ->name('api.auth.logout');

    // Logout all devices
    Route::post('/logout-all', [AuthController::class, 'logoutAll'])
        ->name('api.auth.logout-all');

    // Refresh token
    Route::post('/refresh', [AuthController::class, 'refresh'])
        ->name('api.auth.refresh');

});

/*
|--------------------------------------------------------------------------
| Logo Routes
|--------------------------------------------------------------------------
*/

// Public route to get active logo
Route::get('/logo/active', [LogoController::class, 'getActiveLogo'])
    ->name('api.logo.active');

// Protected logo routes
Route::middleware(['auth:sanctum'])->group(function () {

    // Get all logos (paginated)
    Route::get('/logos', [LogoController::class, 'index'])
        ->name('api.logos.index');

    // Upload new logo (with rate limiting)
    Route::post('/logo', [LogoController::class, 'store'])
        ->middleware('throttle:logo-uploads')
        ->name('api.logo.store');

    // Activate a specific logo
    Route::patch('/logo/{id}/activate', [LogoController::class, 'activate'])
        ->name('api.logo.activate');

    // Delete a logo
    Route::delete('/logo/{id}', [LogoController::class, 'destroy'])
        ->name('api.logo.destroy');

});

/*
|--------------------------------------------------------------------------
| Hero Section Routes
|--------------------------------------------------------------------------
*/

// Public route - website
Route::get('/hero-section/public', [HeroSectionController::class, 'show']);

// Protected routes - admin only
Route::middleware(['auth:sanctum'])->group(function () {

    // Get hero section (admin)
    Route::get('/admin/hero-section', [HeroSectionController::class, 'index']);

    // Update hero section
    Route::put('/admin/hero-section', [HeroSectionController::class, 'update']);

    // Upload video
    Route::post('/admin/hero-section/video', [HeroSectionController::class, 'uploadVideo']);

    // Delete video
    Route::delete('/admin/hero-section/video', [HeroSectionController::class, 'deleteVideo']);

});

/*
|--------------------------------------------------------------------------
| Certifications Routes
|--------------------------------------------------------------------------
*/

// Public route - website
Route::get('/certifications/public', [CertificationController::class, 'index']);

// Protected routes - admin only
Route::middleware(['auth:sanctum'])->group(function () {

    // Get all certifications (admin)
    Route::get('/admin/certifications', [CertificationController::class, 'adminIndex']);

    // Create certification
    Route::post('/admin/certifications', [CertificationController::class, 'store']);

    // Update certification
    Route::put('/admin/certifications/{id}', [CertificationController::class, 'update']);

    // Delete certification
    Route::delete('/admin/certifications/{id}', [CertificationController::class, 'destroy']);

    // Reorder certifications
    Route::post('/admin/certifications/reorder', [CertificationController::class, 'reorder']);

    // Bulk update certifications
    Route::post('/admin/certifications/bulk-update', [CertificationController::class, 'bulkUpdate']);

});


/*
|--------------------------------------------------------------------------
| About Coach API Routes
|--------------------------------------------------------------------------
*/

// Public Route - For website
Route::get('/about-coach/public', [AboutCoachController::class, 'show']);

// Protected Routes - Admin only
Route::middleware(['auth:sanctum'])->group(function () {
    // Get about coach data for admin
    Route::get('/admin/about-coach', [AboutCoachController::class, 'index']);
    
    // Update about coach
    Route::put('/admin/about-coach', [AboutCoachController::class, 'update']);
    
    // Upload image
    Route::post('/admin/about-coach/image', [AboutCoachController::class, 'uploadImage']);
    
    // Delete image
    Route::delete('/admin/about-coach/image', [AboutCoachController::class, 'deleteImage']);
});

/*
|--------------------------------------------------------------------------
| Testimonials API Routes
|--------------------------------------------------------------------------
*/

// Public Route - For website
Route::get('/testimonials/public', [TestimonialController::class, 'show']);

// Protected Routes - Admin only
Route::middleware(['auth:sanctum'])->group(function () {
    // Get all testimonials and section for admin
    Route::get('/admin/testimonials', [TestimonialController::class, 'index']);
    
    // Update section settings
    Route::put('/admin/testimonials/section', [TestimonialController::class, 'updateSection']);
    
    // Update all (section + testimonials) - Bulk update
    Route::post('/admin/testimonials/update-all', [TestimonialController::class, 'updateAll']);
    
    // Upload testimonial image
    Route::post('/admin/testimonials/{id}/image', [TestimonialController::class, 'uploadImage']);
    
    // Delete testimonial image
    Route::delete('/admin/testimonials/{id}/image', [TestimonialController::class, 'deleteImage']);
});

/*
|--------------------------------------------------------------------------
| FAQ API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::get('/faq/public', [FaqController::class, 'show']);
Route::post('/faq/user-question', [FaqController::class, 'storeUserQuestion']);

// Protected Routes - Admin only
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    // Get all FAQ data for admin
    Route::get('/faq', [FaqController::class, 'index']);
    
    // Update all FAQ data (section + questions)
    Route::post('/faq/update-all', [FaqController::class, 'updateAll']);
    
    // User Questions Management
    Route::post('/faq/user-questions/{id}/mark-read', [FaqController::class, 'markAsRead']);
    Route::post('/faq/user-questions/{id}/mark-unread', [FaqController::class, 'markAsUnread']);
    Route::delete('/faq/user-questions/{id}', [FaqController::class, 'deleteUserQuestion']);
});

/*
|--------------------------------------------------------------------------
| Training System API Routes
|--------------------------------------------------------------------------
|
| All routes for managing clients, workout plans, nutrition plans, and progress tracking
| All routes are protected with auth:sanctum middleware and require admin role
|
*/

Route::middleware(['auth:sanctum'])->prefix('admin/training')->group(function () {
    
    // Trainees Management
    Route::get('/trainees', [TrainingController::class, 'index']);
    Route::get('/trainees/{id}', [TrainingController::class, 'show']);
    Route::post('/trainees', [TrainingController::class, 'store']);
    
    // Support both PUT and POST for update (POST with _method=PUT for FormData)
    Route::put('/trainees/{id}', [TrainingController::class, 'update']);
    Route::post('/trainees/{id}', [TrainingController::class, 'update']);
    
    Route::delete('/trainees/{id}', [TrainingController::class, 'destroy']);
    
    // Nutrition Plans
    Route::post('/trainees/{userId}/nutrition', [TrainingController::class, 'saveNutritionPlan']);
    Route::post('/nutrition/items/{itemId}/toggle', [TrainingController::class, 'toggleMealItem']);
    Route::delete('/nutrition/meals/{mealId}', [TrainingController::class, 'deleteMeal']);
    
    // Workout Plans
    Route::post('/trainees/{userId}/workout', [TrainingController::class, 'saveWorkoutPlan']);
    Route::post('/workout/exercises/{exerciseId}/toggle', [TrainingController::class, 'toggleExercise']);
    Route::delete('/workout/exercises/{exerciseId}', [TrainingController::class, 'deleteExercise']);
    
    // Progress Stats
    Route::get('/trainees/{userId}/progress', [TrainingController::class, 'getProgress']);
});

/*
|--------------------------------------------------------------------------
| Chat System Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('admin/chat')->group(function () {
    // Conversations
    Route::get('/conversations', [ChatController::class, 'getConversations']);
    Route::get('/conversations/{traineeId}', [ChatController::class, 'getConversation']);
    Route::delete('/conversations/{conversationId}', [ChatController::class, 'deleteConversation']);
    Route::post('/conversations/{conversationId}/read', [ChatController::class, 'markAsRead']);
    
    // Messages
    Route::post('/conversations/{traineeId}/messages', [ChatController::class, 'sendMessage']);
    Route::post('/conversations/{traineeId}/files', [ChatController::class, 'sendFile']);
    Route::delete('/messages/{messageId}', [ChatController::class, 'deleteMessage']);
    
    // Stats
    Route::get('/stats', [ChatController::class, 'getStats']);
    
    // Notifications
    Route::get('/notifications', [ChatController::class, 'getNotifications']);
    Route::get('/notifications/unread-count', [ChatController::class, 'getUnreadCount']);
    Route::post('/notifications/read', [ChatController::class, 'markNotificationsAsRead']);
});


/*
|--------------------------------------------------------------------------
| Profile Management Routes
|--------------------------------------------------------------------------
*/

// Protected Profile Routes
Route::middleware(['auth:sanctum'])->prefix('profile')->group(function () {
    
    // Get profile
    Route::get('/', [ProfileController::class, 'show'])
        ->name('api.profile.show');
    
    // Update profile information
    Route::put('/', [ProfileController::class, 'updateProfile'])
        ->name('api.profile.update');
    
    // Update password
    Route::put('/password', [ProfileController::class, 'updatePassword'])
        ->name('api.profile.password.update');
    
    // Upload profile photo
    Route::post('/photo', [ProfileController::class, 'uploadPhoto'])
        ->name('api.profile.photo.upload');
    
    // Delete profile photo
    Route::delete('/photo', [ProfileController::class, 'deletePhoto'])
        ->name('api.profile.photo.delete');
});



/*
|--------------------------------------------------------------------------
| Footer Routes
|--------------------------------------------------------------------------
*/

// Public route - website
Route::get('/footer/public', [FooterController::class, 'getPublicFooter']);

// Protected routes - admin only
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/footer', [FooterController::class, 'getFooterForAdmin']);
    Route::put('/admin/footer', [FooterController::class, 'update']);
});

/*
|--------------------------------------------------------------------------
| Subscription Routes
|--------------------------------------------------------------------------
*/
Route::get('/paypal/success', [SubscriptionController::class, 'paypalSuccess'])
    ->name('paypal.success');
    
Route::get('/paypal/cancel', [SubscriptionController::class, 'paypalCancel'])
    ->name('paypal.cancel');

// Public routes
Route::get('/subscriptions/plans', [SubscriptionController::class, 'getPlans']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // PayPal payments
    Route::post('/subscriptions/paypal/create', [SubscriptionController::class, 'createPayPalPayment']);
    Route::post('/subscriptions/paypal/capture', [SubscriptionController::class, 'capturePayPalPayment']);
    
    // Bank transfer
    Route::post('/subscriptions/bank-transfer', [SubscriptionController::class, 'createBankTransferSubscription']);
    Route::post('/subscriptions/{subscription}/upload-receipt', [SubscriptionController::class, 'uploadBankReceipt']);
    
    // User subscriptions
    Route::get('/subscriptions/my-subscriptions', [SubscriptionController::class, 'getUserSubscriptions']);
    Route::get('/subscriptions/active', [SubscriptionController::class, 'getActiveSubscription']);
});

/*
|--------------------------------------------------------------------------
| Trainee Routes (للمتدربين فقط)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('trainee')->group(function () {
    
    // Nutrition Plan Routes
    Route::get('/nutrition-plan', [App\Http\Controllers\Api\TraineeController::class, 'getNutritionPlan']);
    Route::post('/nutrition/items/{itemId}/toggle', [App\Http\Controllers\Api\TraineeController::class, 'toggleMealItem']);
    
    // Workout Plan Routes
    Route::get('/workout-plan', [App\Http\Controllers\Api\TraineeController::class, 'getWorkoutPlan']);
    Route::post('/workout/exercises/{exerciseId}/toggle', [App\Http\Controllers\Api\TraineeController::class, 'toggleExercise']);
    
    // Progress Stats
    Route::get('/progress', [App\Http\Controllers\Api\TraineeController::class, 'getProgress']);
    
    // Chat Routes
    Route::get('/chat/conversation', [App\Http\Controllers\Api\TraineeChatController::class, 'getConversation']);
    Route::post('/chat/messages', [App\Http\Controllers\Api\TraineeChatController::class, 'sendMessage']);
    Route::post('/chat/files', [App\Http\Controllers\Api\TraineeChatController::class, 'sendFile']);
});


/*
|--------------------------------------------------------------------------
| Admin Subscription Management Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    
    // PayPal Subscriptions Management
    Route::get('/subscriptions/paypal', [AdminSubscriptionController::class, 'getPayPalSubscriptions']);
    Route::post('/subscriptions/paypal', [AdminSubscriptionController::class, 'createPayPalSubscription']);
    
    // Bank Transfer Subscriptions Management
    Route::get('/subscriptions/bank-transfer', [AdminSubscriptionController::class, 'getBankTransferSubscriptions']);
    Route::post('/subscriptions/{id}/approve', [AdminSubscriptionController::class, 'approveBankTransfer']);
    Route::post('/subscriptions/{id}/reject', [AdminSubscriptionController::class, 'rejectBankTransfer']);
    
    // General Subscription Management
    Route::put('/subscriptions/{id}', [AdminSubscriptionController::class, 'updateSubscription']);
    Route::delete('/subscriptions/{id}', [AdminSubscriptionController::class, 'deleteSubscription']);
    Route::get('/subscriptions/stats', [AdminSubscriptionController::class, 'getSubscriptionStats']);

    Route::get('/users', [AdminSubscriptionController::class, 'getUsers']);
Route::get('/plans', [AdminSubscriptionController::class, 'getPlans']);
});



/*
|--------------------------------------------------------------------------
| Dashboard Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->prefix('dashboard')->group(function () {
    Route::get('/metrics', [DashboardController::class, 'getMetrics']);
    Route::get('/charts/growth', [DashboardController::class, 'getGrowthData']);
    Route::get('/charts/revenue', [DashboardController::class, 'getRevenueData']);
    Route::get('/charts/payment-status', [DashboardController::class, 'getPaymentStatusData']);
    Route::get('/charts/program-types', [DashboardController::class, 'getProgramTypeData']);
    Route::get('/charts/completion', [DashboardController::class, 'getCompletionData']);
    Route::get('/charts/engagement', [DashboardController::class, 'getEngagementData']);
    Route::get('/charts/funnel', [DashboardController::class, 'getFunnelData']);
    Route::get('/alerts', [DashboardController::class, 'getAlerts']);
});