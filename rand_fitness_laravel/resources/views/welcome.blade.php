<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RanLogic — API Status</title>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: #0a0e1a;
            color: #e2f0ff;
            font-family: 'Tajawal', sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .container {
            width: 100%;
            max-width: 520px;
            padding: 24px;
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 32px;
        }

        .logo {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 1.1rem;
            font-weight: 600;
            color: #e2f0ff;
        }

        .logo span { color: #00e5ff; }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(0,255,136,0.08);
            border: 1px solid rgba(0,255,136,0.2);
            border-radius: 100px;
            padding: 6px 14px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.72rem;
            color: #00ff88;
        }

        .dot {
            width: 6px; height: 6px;
            background: #00ff88;
            border-radius: 50%;
            box-shadow: 0 0 8px #00ff88;
            animation: blink 2s ease infinite;
        }

        @keyframes blink {
            0%,100% { opacity: 1; }
            50% { opacity: 0.3; }
        }

        .card {
            background: #0d1117;
            border: 1px solid #1e2d40;
            border-radius: 16px;
            overflow: hidden;
        }

        .terminal-bar {
            display: flex;
            align-items: center;
            gap: 7px;
            padding: 12px 18px;
            background: rgba(255,255,255,0.02);
            border-bottom: 1px solid #1e2d40;
        }

        .tdot { width: 11px; height: 11px; border-radius: 50%; }
        .tdot.r { background: #ff5f57; }
        .tdot.y { background: #ffbd2e; }
        .tdot.g { background: #28c840; }

        .terminal-title {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.68rem;
            color: #4a6480;
            margin: 0 auto;
        }

        .response {
            padding: 24px 20px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.8rem;
            line-height: 1.9;
            direction: ltr;
            text-align: left;
        }

        .url-line { color: #4a6480; margin-bottom: 8px; }
        .url-line span { color: #00e5ff; }
        .http-status { color: #00ff88; font-weight: 600; margin-bottom: 16px; }

        .jkey { color: #7b9cc8; }
        .jval-str { color: #00ff88; }
        .jval-num { color: #ffd580; }
        .jval-env { color: #c792ea; }
        .jbracket { color: #e2f0ff; }

        .json-line {
            padding-right: 20px;
        }

        .info-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1px;
            background: #1e2d40;
            border-top: 1px solid #1e2d40;
        }

        .info-cell {
            background: #0d1117;
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .info-label {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.65rem;
            color: #4a6480;
        }

        .info-value {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.78rem;
            color: #00e5ff;
            word-break: break-all;
        }

        .auth-section {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
        }

        .auth-section a {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.75rem;
            color: #4a6480;
            text-decoration: none;
            padding: 8px 18px;
            border: 1px solid #1e2d40;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .auth-section a:hover {
            color: #e2f0ff;
            border-color: #2e4060;
        }

        .footer-note {
            text-align: center;
            margin-top: 24px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 0.65rem;
            color: #1e2d40;
        }
    </style>
</head>
<body>
<div class="container">

    <div class="header">
        <div class="logo">Ran<span>Logic</span></div>
        <div class="status-badge">
            <div class="dot"></div>
            API Online
        </div>
    </div>

    <div class="card">
        <div class="terminal-bar">
            <div class="tdot r"></div>
            <div class="tdot y"></div>
            <div class="tdot g"></div>
            <div class="terminal-title">GET /api/health</div>
        </div>

        <div class="response">
            <div class="url-line">► <span>{{ url('/api') }}</span></div>
            <div class="http-status">✓ 200 OK — API يعمل بنجاح</div>

            <span class="jbracket">{</span><br>
            <div class="json-line"><span class="jkey">"status"</span>: <span class="jval-str">"operational"</span>,</div>
            <div class="json-line"><span class="jkey">"laravel"</span>: <span class="jval-num">"v{{ Illuminate\Foundation\Application::VERSION }}"</span>,</div>
            <div class="json-line"><span class="jkey">"php"</span>: <span class="jval-num">"v{{ PHP_VERSION }}"</span>,</div>
            <div class="json-line"><span class="jkey">"env"</span>: <span class="jval-env">"{{ app()->environment() }}"</span>,</div>
            <div class="json-line"><span class="jkey">"debug"</span>: <span class="jval-env">{{ config('app.debug') ? 'true' : 'false' }}</span></div>
            <span class="jbracket">}</span>
        </div>

        <div class="info-row">
            <div class="info-cell">
                <div class="info-label">// base url</div>
                <div class="info-value">{{ url('/') }}</div>
            </div>
            <div class="info-cell">
                <div class="info-label">// app name</div>
                <div class="info-value">{{ config('app.name') }}</div>
            </div>
        </div>
    </div>

    @if (Route::has('login'))
        <div class="auth-section">
            @auth
                <a href="{{ url('/home') }}">→ Dashboard</a>
            @else
                <a href="{{ route('login') }}">تسجيل الدخول</a>
                @if (Route::has('register'))
                    <a href="{{ route('register') }}">إنشاء حساب</a>
                @endif
            @endauth
        </div>
    @endif

    <div class="footer-note">RanLogic · Laravel v{{ Illuminate\Foundation\Application::VERSION }} · PHP v{{ PHP_VERSION }}</div>

</div>
</body>
</html>