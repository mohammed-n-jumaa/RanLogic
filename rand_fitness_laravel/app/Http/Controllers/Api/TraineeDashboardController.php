<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BodyMeasurement;
use App\Models\ProgressPhoto;
use App\Models\WaterLog;
use App\Models\WeightLog;
use App\Services\TraineeDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class TraineeDashboardController extends Controller
{
    public function __construct(private TraineeDashboardService $service) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user->role !== 'user') {
                return response()->json(['success' => false, 'message' => 'غير مصرح'], 403);
            }

            $data = $this->service->getDashboardData($user->id);

            return response()->json(['success' => true, 'data' => $data]);
        } catch (\Exception $e) {
            Log::error('Dashboard error: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ'], 500);
        }
    }

    public function logWeight(Request $request): JsonResponse
    {
        $data = $request->validate([
            'weight'    => 'required|numeric|min:30|max:300',
            'logged_at' => 'nullable|date',
        ]);

        $user = $request->user();

        $log = WeightLog::updateOrCreate(
            ['user_id' => $user->id, 'logged_at' => $data['logged_at'] ?? today()],
            ['weight' => $data['weight']]
        );

        $user->update(['weight' => $data['weight']]);

        return response()->json(['success' => true, 'data' => $log]);
    }

    public function logWater(Request $request): JsonResponse
    {
        $data = $request->validate([
            'cups' => 'required|integer|min:0|max:20',
        ]);

        $log = WaterLog::updateOrCreate(
            ['user_id' => $request->user()->id, 'logged_at' => today()],
            ['cups' => $data['cups']]
        );

        return response()->json(['success' => true, 'data' => $log]);
    }

    public function logMeasurement(Request $request): JsonResponse
    {
        $data = $request->validate([
            'waist'       => 'nullable|numeric|min:40|max:200',
            'hips'        => 'nullable|numeric|min:40|max:200',
            'arm'         => 'nullable|numeric|min:15|max:60',
            'thigh'       => 'nullable|numeric|min:30|max:100',
            'chest'       => 'nullable|numeric|min:50|max:180',
            'measured_at' => 'nullable|date',
        ]);

        $measurement = BodyMeasurement::updateOrCreate(
            ['user_id' => $request->user()->id, 'measured_at' => $data['measured_at'] ?? today()],
            $data
        );

        return response()->json(['success' => true, 'data' => $measurement]);
    }

    public function uploadProgressPhoto(Request $request): JsonResponse
    {
        $request->validate([
            'photo'           => 'required|image|max:5120',
            'note'            => 'nullable|string|max:500',
            'marketing_consent' => 'nullable|boolean',
        ]);

        $path = $request->file('photo')->store('progress-photos', 'public');
        $user = $request->user();

        if ($request->boolean('marketing_consent', false) && !$user->marketing_consent) {
            $user->update(['marketing_consent' => true]);
        }
        $photo = ProgressPhoto::create([
            'user_id'           => $user->id,
            'photo_path'        => $path,
            'weight_at_photo'   => $user->weight,
            'note'              => $request->note,
            'taken_at'          => today(),
            'marketing_consent' => $request->boolean('marketing_consent', false),
        ]);

        return response()->json(['success' => true, 'data' => $photo]);
    }

    public function joinChallenge(int $challengeId, Request $request): JsonResponse
    {
        $request->user()->challenges()->syncWithoutDetaching([
            $challengeId => ['started_at' => today(), 'completed_days' => 0],
        ]);

        return response()->json(['success' => true, 'message' => 'تم الانضمام للتحدي']);
    }

    public function incrementChallenge(int $challengeId, Request $request): JsonResponse
    {
        $user = $request->user();
        $pivot = DB::table('challenge_user')
            ->where('user_id', $user->id)
            ->where('challenge_id', $challengeId)
            ->first();

        if (!$pivot) {
            return response()->json(['success' => false, 'message' => 'لم تنضم لهذا التحدي'], 404);
        }

        DB::table('challenge_user')
            ->where('id', $pivot->id)
            ->update(['completed_days' => $pivot->completed_days + 1]);

        return response()->json(['success' => true]);
    }

   public function updateConsent(Request $request): JsonResponse
{
    $data = $request->validate([
        'marketing_consent' => 'required|boolean',
    ]);

    $user = $request->user();
    $user->marketing_consent = $data['marketing_consent'];
    $user->save();

    return response()->json(['success' => true, 'data' => ['marketing_consent' => (bool) $user->marketing_consent]]);
}

}
