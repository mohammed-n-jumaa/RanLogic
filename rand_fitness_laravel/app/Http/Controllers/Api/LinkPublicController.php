<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LinkLink;
use App\Models\LinkProfile;
use App\Models\LinkSocialAnalytic;
use App\Services\LinkAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LinkPublicController extends Controller
{
    public function __construct(private LinkAnalyticsService $analytics) {}

    public function getProfile(): JsonResponse
    {
        $profile = LinkProfile::first();
        $links   = LinkLink::where('active', true)
            ->orderBy('order')
            ->get(['id', 'title', 'url', 'icon', 'title_font', 'order']);

        $themeId = DB::table('site_settings')
            ->where('key', 'active_link_theme')
            ->value('value') ?? 'minimal';

        $profileData = $profile->toArray();
        $profileData['theme_id'] = $themeId;

        return response()->json([
            'data' => [
                'profile' => $profileData,
                'links'   => $links,
            ],
        ]);
    }

    public function recordLinkClick(Request $request, int $id): JsonResponse
    {
        $link = LinkLink::findOrFail($id);
        $link->increment('clicks');
        $this->analytics->recordClick($id, $request);
        return response()->json(['data' => ['clicks' => $link->clicks]]);
    }

    public function recordSocialClick(Request $request): JsonResponse
    {
        $request->validate(['platform' => 'required|string|max:50']);
        LinkSocialAnalytic::create([
            'platform'   => $request->platform,
            'clicked_at' => now(),
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
        ]);
        return response()->json(['data' => ['ok' => true]]);
    }
}