<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class FetchNewsApiArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-news-api-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch News API articles and store them in the database';

    private $apiUrl;
    private $apiKey;

    // Constructor
    public function __construct()
    {
        parent::__construct();
        $this->apiUrl = env('NEWS_API_URL');
        $this->apiKey = env('NEWS_API_KEY');
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {

            $response = Http::get("$this->apiUrl/top-headlines?country=us&apiKey=$this->apiKey");
            $categoryResponse = Http::get("$this->apiUrl/top-headlines/sources?apiKey=$this->apiKey");
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
                        'author' => $article['author'] ?? 'Unknown',
                        'image_url' => $article['urlToImage'],
                        'article_url' => $article['url'],
                        'source' => $article['source']['name'],
                        'category' => $category,
                        'published_at' => $article['publishedAt'],
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ]);
                }
                $this->info('News API articles fetched and stored successfully.');
            } else {
                $this->error('No articles found in the response.');
            }
        } catch (\Exception $e) {
            $this->error('Error fetching articles: ' . $e->getMessage());
        }
    }

    /**
     * Get category name by id
     *
     * @param array $data
     * @param string $id
     * @return string|null
     */
    public function getCategoryById(array $data, string $id): ?string
    {
        $filtered = array_filter($data, function ($item) use ($id) {
            return $item['id'] === $id;
        });

        return !empty($filtered) ? array_values($filtered)[0]['category'] : null;
    }

}
