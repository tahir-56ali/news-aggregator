<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ScrapeNewsArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:scrape-news-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch news articles from APIs and store them in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $apiKey = 'your_newsapi_key';
        $response = Http::get("https://newsapi.org/v2/top-headlines?country=us&apiKey=$apiKey");

        if ($response->successful()) {
            $articles = $response->json()['articles'];
            foreach ($articles as $article) {
                Article::create([
                    'title' => $article['title'],
                    'description' => $article['description'],
                    'url' => $article['url'],
                    'source' => $article['source']['name'],
                    'published_at' => $article['publishedAt'],
                ]);
            }
        }
        $this->info('News articles fetched and stored successfully.');
    }
}
