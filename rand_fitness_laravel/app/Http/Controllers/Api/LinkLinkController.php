<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LinkLinkRequest;
use App\Models\LinkLink;
use App\Services\LinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LinkLinkController extends Controller
{
    public function __construct(private readonly LinkService $service) {}

    public function index(): JsonResponse
    {
        $links = $this->service->getAll();

        return response()->json([
            'success' => true,
            'data'    => $this->service->formatCollection($links),
        ]);
    }

    public function store(LinkLinkRequest $request): JsonResponse
    {
        $link = $this->service->create($request->validated());

        return response()->json([
            'success' => true,
            'data'    => $this->service->formatOne($link),
        ], 201);
    }

    public function update(LinkLinkRequest $request, int $id): JsonResponse
    {
        $link    = LinkLink::findOrFail($id);
        $updated = $this->service->update($link, $request->validated());

        return response()->json([
            'success' => true,
            'data'    => $this->service->formatOne($updated),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $link = LinkLink::findOrFail($id);
        $this->service->delete($link);

        return response()->json(['success' => true]);
    }

    public function toggle(int $id): JsonResponse
    {
        $link    = LinkLink::findOrFail($id);
        $updated = $this->service->toggle($link);

        return response()->json([
            'success' => true,
            'data'    => $this->service->formatOne($updated),
        ]);
    }

    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'items'         => ['required', 'array'],
            'items.*.id'    => ['required', 'integer', 'exists:link_links,id'],
            'items.*.order' => ['required', 'integer', 'min:0'],
        ]);

        $this->service->reorder($request->input('items'));

        return response()->json(['success' => true]);
    }

    public function recordClick(int $id): JsonResponse
    {
        $link    = LinkLink::findOrFail($id);
        $updated = $this->service->recordClick($link);

        return response()->json([
            'success' => true,
            'data'    => $this->service->formatOne($updated),
        ]);
    }
}