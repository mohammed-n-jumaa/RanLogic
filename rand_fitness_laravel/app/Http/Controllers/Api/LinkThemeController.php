<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LinkUpdateThemeRequest;
use App\Services\LinkThemeService;
use Illuminate\Http\JsonResponse;

class LinkThemeController extends Controller
{
    public function __construct(private LinkThemeService $linkThemeService) {}

    public function show(): JsonResponse
    {
        $themeId = $this->linkThemeService->getTheme();

        return response()->json([
            'success' => true,
            'data'    => ['theme_id' => $themeId],
        ]);
    }

    public function update(LinkUpdateThemeRequest $request): JsonResponse
    {
        $themeId = $this->linkThemeService->updateTheme(
            $request->validated('theme_id')
        );

        return response()->json([
            'success' => true,
            'data'    => ['theme_id' => $themeId],
        ]);
    }
}