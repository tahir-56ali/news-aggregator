<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ScrapeNewsApiArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:scrape-news-api-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch NewsAPI articles and store them in the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $apiUrl = env('NEWSAPI_URL');
        $apiKey = env('NEWSAPI_KEY');
        $response = Http::get("$apiUrl/top-headlines?country=us&apiKey=$apiKey");
        $categoryResponse = Http::get("$apiUrl/top-headlines/sources?apiKey=$apiKey");
        $category = 'Random';

        if ($response->successful()) {
            $articles = $response->json()['articles'];
            $categories = $categoryResponse->json()['sources'];
            foreach ($articles as $article) {
                $catIdToSearch = $article['source']['id'];
                if ($catIdToSearch !== null) {
                    $category = $this->getCategoryById($categories, $catIdToSearch);
                }
                Article::insertOrIgnore([
                    'title' => $article['title'],
                    'content' => $article['content'],
                    'author' => $article['author'],
                    'image_url' => $article['urlToImage'],
                    'source' => $article['source']['name'],
                    'category' => $category,
                    'published_at' => $article['publishedAt'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        $this->info('News articles fetched and stored successfully.');
    }

    /**
     * Get category name by id
     *
     * @param array $data
     * @param string $id
     * @return string|null
     */
    public function getCategoryById(array $data, string $id): ?string {
        $filtered = array_filter($data, function ($item) use ($id) {
            return $item['id'] === $id;
        });

        return !empty($filtered) ? array_values($filtered)[0]['category'] : null;
    }

}
