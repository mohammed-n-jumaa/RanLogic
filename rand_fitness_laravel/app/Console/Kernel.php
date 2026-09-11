<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        $schedule->command('subscriptions:expire')->dailyAt('01:00');

        // Process queued jobs every minute (no Supervisor available on shared/cloud hosting)
        $schedule->command('queue:work --stop-when-empty --max-time=55 --tries=3')
            ->everyMinute()
            ->withoutOverlapping()
            ->runInBackground();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
   
        require base_path('routes/console.php');
    }
}