<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LinkUpdateProfileRequest;
use App\Http\Requests\LinkUploadPhotoRequest;
use App\Services\LinkProfileService;
use Illuminate\Http\JsonResponse;

class LinkProfileController extends Controller
{
    public function __construct(private LinkProfileService $service) {}

    public function show(): JsonResponse
    {
        return response()->json(['data' => $this->service->get()]);
    }

    public function update(LinkUpdateProfileRequest $request): JsonResponse
    {
        $profile = $this->service->update($request->validated());

        return response()->json(['data' => $profile]);
    }

    public function uploadPhoto(LinkUploadPhotoRequest $request): JsonResponse
    {
        $profile = $this->service->uploadAvatar($request->file('photo'));

        return response()->json(['data' => $profile]);
    }

    public function deletePhoto(): JsonResponse
    {
        $profile = $this->service->deleteAvatar();

        return response()->json(['data' => $profile]);
    }
}