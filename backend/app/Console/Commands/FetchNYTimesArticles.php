<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use App\Models\Article;
use Carbon\Carbon;

class FetchNYTimesArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-n-y-times-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch articles from the New York Times API and store them in the database';

    private $apiUrl;
    private $apiKey;

    // Constructor
    public function __construct()
    {
        parent::__construct();
        $this->apiUrl = env('NY_TIMES_API_URL');
        $this->apiKey = env('NY_TIMES_API_KEY');
    }

    // Execute the console command.
    public function handle()
    {
        // Initialize Guzzle HTTP client
        $client = new Client();

        try {
            // Make the request to the New York Times API
            $response = $client->get($this->apiUrl, [
                'query' => [
                    'api-key' => $this->apiKey,
                    'q' => 'news', // Search query (can be dynamic)
                    'sort' => 'newest', // Sort by newest articles
                    'page' => 0, // Pagination (you can iterate through multiple pages if needed)
                ]
            ]);

            // Decode the response body
            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['response']['docs'])) {
                foreach ($data['response']['docs'] as $articleData) {
                    // Save the article to the database
                    Article::insertOrIgnore([
                            'title' => $articleData['headline']['main'],
                            'author' => isset($articleData['byline']['original']) ? str_replace('By ', '', $articleData['byline']['original']) : 'Unknown',
                            'image_url' => isset($articleData['multimedia'][0]) ? 'https://www.nytimes.com/' . $articleData['multimedia'][0]['url'] : null,
                            'content' => $articleData['lead_paragraph'] ?? 'No content available',
                            'source' => $articleData['source'] ?? 'New York Times',
                            'category' => $articleData['section_name'],
                            'published_at' => Carbon::parse($articleData['pub_date']),
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                }
                $this->info('New York Times API Articles fetched and saved successfully.');
            } else {
                $this->error('No articles found in the response.');
            }

        } catch (\Exception $e) {
            $this->error('Error fetching articles: ' . $e->getMessage());
        }
    }
}
