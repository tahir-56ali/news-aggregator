<?php

use App\Console\Commands\FetchNewsApiArticles;
use App\Console\Commands\FetchGuardianArticles;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command(FetchNewsApiArticles::class)->hourly();
Schedule::command(FetchGuardianArticles::class)->hourly();
