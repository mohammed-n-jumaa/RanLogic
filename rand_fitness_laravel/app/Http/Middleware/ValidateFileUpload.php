<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateFileUpload
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            
            // Additional security checks
            
            // 1. Check if file is actually uploaded (not moved from temp)
            if (!$file->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'الملف المرفوع غير صالح.',
                ], 400);
            }
            
            // 2. Double-check MIME type
            $allowedMimes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/svg+xml',
                'image/webp'
            ];
            
            if (!in_array($file->getMimeType(), $allowedMimes)) {
                return response()->json([
                    'success' => false,
                    'message' => 'نوع الملف غير مدعوم.',
                ], 400);
            }
            
            // 3. Check file extension matches MIME type
            $extension = strtolower($file->getClientOriginalExtension());
            $mimeType = $file->getMimeType();
            
            $validCombinations = [
                'png' => 'image/png',
                'jpg' => ['image/jpeg', 'image/jpg'],
                'jpeg' => ['image/jpeg', 'image/jpg'],
                'svg' => 'image/svg+xml',
                'webp' => 'image/webp',
            ];
            
            if (isset($validCombinations[$extension])) {
                $expectedMimes = is_array($validCombinations[$extension]) 
                    ? $validCombinations[$extension] 
                    : [$validCombinations[$extension]];
                
                if (!in_array($mimeType, $expectedMimes)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'امتداد الملف لا يتطابق مع نوعه.',
                    ], 400);
                }
            }
            
            // 4. Prevent SVG script injection
            if ($extension === 'svg') {
                $content = file_get_contents($file->getRealPath());
                
                // Check for potentially dangerous tags
                $dangerousTags = ['script', 'onclick', 'onload', 'onerror', 'javascript:'];
                
                foreach ($dangerousTags as $tag) {
                    if (stripos($content, $tag) !== false) {
                        return response()->json([
                            'success' => false,
                            'message' => 'ملف SVG يحتوي على محتوى غير آمن.',
                        ], 400);
                    }
                }
            }
        }
        
        return $next($request);
    }
}