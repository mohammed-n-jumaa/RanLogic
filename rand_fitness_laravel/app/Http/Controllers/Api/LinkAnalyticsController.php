<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\LinkAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LinkAnalyticsController extends Controller
{
    public function __construct(private LinkAnalyticsService $service) {}

    public function summary(Request $request): JsonResponse
    {
        $period = $request->query('period', 'week');

        $data = $this->service->getSummary($period);

        return response()->json(['data' => $data]);
    }

    public function links(Request $request): JsonResponse
    {
        $period = $request->query('period', 'week');

        $data = $this->service->getLinksStats($period);

        return response()->json(['data' => $data]);
    }
    public function socials(Request $request): JsonResponse
{
    $period = $request->query('period', 'week');
    $data   = $this->service->getSocialStats($period);
    return response()->json(['data' => $data]);
}
}