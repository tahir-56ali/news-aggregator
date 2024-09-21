<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use GuzzleHttp\Client;
use App\Models\Article;
use Carbon\Carbon;

class FetchGuardianArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-guardian-api-articles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch articles from The Guardian API and store them in the database';

    private $apiUrl;
    private $apiKey;

    // Constructor
    public function __construct()
    {
        parent::__construct();
        $this->apiUrl = env('GUARDIAN_API_URL');
        $this->apiKey = env('GUARDIAN_API_KEY');
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Initialize Guzzle HTTP client
        $client = new Client();

        try {
            // Make the request to The Guardian API
            $response = $client->get($this->apiUrl, [
                'query' => [
                    'api-key' => $this->apiKey,
                    'show-fields' => 'headline,byline,thumbnail,body',
                    'page-size' => 10, // Limit to 10 articles for now
                    'order-by' => 'newest'
                ]
            ]);

            // Decode the response body
            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['response']['results'])) {
                foreach ($data['response']['results'] as $articleData) {
                    // Save the article to the database
                    Article::insertOrIgnore([
                            'title' => $articleData['fields']['headline'],
                            'author' => $articleData['fields']['byline'] ?? 'Unknown',
                            'image_url' => $articleData['fields']['thumbnail'] ?? null,
                            'content' => $articleData['fields']['body'],
                            'source' => 'The Guardian',
                            'category' => $articleData['sectionName'],
                            'published_at' => Carbon::parse($articleData['webPublicationDate']),
                            'created_at' => Carbon::now(),
                            'updated_at' => Carbon::now(),
                        ]);
                }
                $this->info('The Guardian API Articles fetched and saved successfully.');
            } else {
                $this->error('No articles found in the response.');
            }

        } catch (\Exception $e) {
            $this->error('Error fetching articles: ' . $e->getMessage());
        }
    }
}
