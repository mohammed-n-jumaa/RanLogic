<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ExpireSubscriptions extends Command
{
    protected $signature   = 'subscriptions:expire';
    protected $description = 'Mark expired subscriptions and update user status';

    public function handle(): void
    {
        $usersToDeactivate = User::where('has_active_subscription', true)
            ->whereDoesntHave('subscriptions', function ($q) {
                $q->where('status', 'approved')
                  ->where('ends_at', '>', now());
            })
            ->get();

        foreach ($usersToDeactivate as $user) {
            $user->update(['has_active_subscription' => false]);
            Log::info('Subscription expired for user', ['user_id' => $user->id]);
        }

        $this->info("Deactivated {$usersToDeactivate->count()} users.");
    }
}