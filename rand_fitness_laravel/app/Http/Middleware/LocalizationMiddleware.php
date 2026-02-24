<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;

class LocalizationMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Check session first
        if (session()->has('language')) {
            App::setLocale(session('language'));
        }
        // Then check cookie
        elseif ($request->cookie('language')) {
            App::setLocale($request->cookie('language'));
            session(['language' => $request->cookie('language')]);
        }
        // Then check Accept-Language header
        elseif ($request->header('Accept-Language')) {
            $locale = substr($request->header('Accept-Language'), 0, 2);
            if (in_array($locale, ['ar', 'en'])) {
                App::setLocale($locale);
                session(['language' => $locale]);
            }
        }
        // Default to English
        else {
            App::setLocale('en');
            session(['language' => 'en']);
        }

        return $next($request);
    }
}