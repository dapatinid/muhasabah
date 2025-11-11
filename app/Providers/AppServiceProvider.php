<?php

namespace App\Providers;

use Carbon\Carbon;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        config(['app.timezone' => 'Asia/Jakarta']);
        date_default_timezone_set('Asia/Jakarta');

        // Agar setiap Carbon instance otomatis diubah ke timezone Jakarta
        Carbon::macro('toWib', function () {
            return $this->copy()->timezone('Asia/Jakarta');
        });
    }
}
