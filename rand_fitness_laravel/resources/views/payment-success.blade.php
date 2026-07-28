<!-- resources/views/payment-success.blade.php -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <link rel="stylesheet" href="{{ asset('css/payment-success.css') }}">
    <script src="https://cdn.jsdelivr.net/npm/react@18.0.0/umd/react.production.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@18.0.0/umd/react-dom.production.min.js"></script>
</head>
<body>
    <div id="payment-success">
        <div class="status-card success">
            <div class="success-icon">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="green" stroke-width="4" fill="none" />
                    <path d="M30,50 L45,65 L70,35" stroke="green" stroke-width="4" fill="none" />
                </svg>
            </div>
            <h2>Payment Successful! 🎉</h2>
            <p>Your subscription has been activated. You can now start your training journey.</p>
            <div class="action-buttons">
                <button onclick="window.location.href='/profile'">Go to Profile</button>
                <button onclick="window.location.href='/'">Start Training</button>
            </div>
        </div>
    </div>
</body>
</html>
