<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Services\ChatService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
            $this->app->singleton(ChatService::class, function ($app) {
            return new ChatService();
        });    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
          // Disable SSL verify for local dev only
    if ($this->app->environment('local')) {
        \Illuminate\Support\Facades\Http::globalOptions([
            'verify' => false,
        ]);
    }
     Schema::defaultStringLength(191);

    }
}
