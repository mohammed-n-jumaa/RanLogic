<?php

namespace App\Services;

use App\Models\LinkAnalytic;
use App\Models\LinkLink;
use App\Models\LinkSocialAnalytic;
use Illuminate\Support\Facades\DB;

class LinkAnalyticsService
{
    public function recordClick(int $linkId, $request): void
    {
        LinkAnalytic::create([
            'link_id'    => $linkId,
            'clicked_at' => now(),
            'ip_address' => $request->ip(),
            'user_agent' => substr($request->userAgent() ?? '', 0, 500),
            'referer'    => substr($request->header('referer') ?? '', 0, 500),
        ]);
    }

    public function getSummary(string $period): array
    {
        $from = $this->periodStart($period);

        $totalClicks = LinkAnalytic::where('clicked_at', '>=', $from)->count();

        $totalSocialClicks = LinkSocialAnalytic::where('clicked_at', '>=', $from)->count();

        $topLink = LinkAnalytic::where('clicked_at', '>=', $from)
            ->select('link_id', DB::raw('COUNT(*) as clicks'))
            ->groupBy('link_id')
            ->orderByDesc('clicks')
            ->with('link:id,title')
            ->first();

        $activeLinks = LinkLink::where('active', true)->count();

        return [
            'total_clicks'        => $totalClicks,
            'total_social_clicks' => $totalSocialClicks,
            'top_link'            => $topLink?->link?->title ?? '—',
            'active_links'        => $activeLinks,
        ];
    }

    public function getLinksStats(string $period): array
    {
        $from = $this->periodStart($period);

        return LinkLink::withCount([
                'analytics as period_clicks' => fn ($q) =>
                    $q->where('clicked_at', '>=', $from),
                'analytics as total_clicks',
            ])
            ->orderByDesc('period_clicks')
            ->get()
            ->map(fn ($link) => [
                'id'            => $link->id,
                'title'         => $link->title,
                'url'           => $link->url,
                'is_active'     => $link->active,
                'period_clicks' => (int) ($link->period_clicks ?? 0),
                'total_clicks'  => (int) ($link->total_clicks  ?? 0),
            ])
            ->toArray();
    }

    public function getSocialStats(string $period): array
    {
        $from = $this->periodStart($period);

        return LinkSocialAnalytic::where('clicked_at', '>=', $from)
            ->select('platform', DB::raw('COUNT(*) as clicks'))
            ->groupBy('platform')
            ->orderByDesc('clicks')
            ->get()
            ->map(fn ($row) => [
                'platform' => $row->platform,
                'clicks'   => (int) $row->clicks,
            ])
            ->toArray();
    }

    private function periodStart(string $period): \Carbon\Carbon
    {
        return match ($period) {
            'today' => now()->startOfDay(),
            'month' => now()->subDays(30),
            default => now()->subDays(7),
        };
    }
}