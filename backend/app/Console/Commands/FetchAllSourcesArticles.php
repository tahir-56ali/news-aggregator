<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FetchAllSourcesArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-all-sources-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch articles from all available APIs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Run the three fetch commands
        $this->call('app:fetch-news-api-articles');
        $this->call('app:fetch-guardian-api-articles');
        $this->call('app:fetch-n-y-times-articles');

        // Output success message
        $this->info('All articles fetched successfully from News API, Guardian, and NY Times.');

        return 0;
    }
}
