<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // Fetch articles with optional filters
    public function index(Request $request)
    {
        $query = Article::query();

        if (!empty($request->get('keyword'))) {
            $query->where('title', 'like', '%' . $request->keyword . '%');
        }

        if (!empty($request->get('category'))) {
            $query->where('category', $request->category);
        }

        if (!empty($request->get('source'))) {
            $query->where('source', $request->source);
        }

        if (!empty($request->get('author'))) {
            $query->where('author', $request->author);
        }

        if (!empty($request->get('date'))) {
            $query->whereDate('published_at', $request->date);
        }

        // Paginate the results (12 results per page by default)
        $articles = $query->orderBy('published_at', 'desc')->paginate(12);

        return response()->json($articles);
    }

    // Fetch articles based on user preferences
    public function getPersonalizedArticles(Request $request)
    {
        $user = Auth::user();
        $preferences = $user->preferences; // Get user preferences

        if (!$preferences) {
            return response()->json(['message' => 'No preferences set, Please set your preferences under Profile page'], 400);
        }

        // Fetch articles based on preferences
        $articles = Article::query();

        $preferred_categories = json_decode($preferences->preferred_categories, true) ?? [];
        $preferred_sources = json_decode($preferences->preferred_sources, true) ?? [];
        $preferred_authors = json_decode($preferences->preferred_authors, true) ?? [];

        if (empty($preferred_categories) && empty($preferred_sources) && empty($preferred_authors)) {
            return response()->json(['message' => 'No preferences set. Please set your preferences on the Profile page.'], 400);
        }

        $articles->where(function ($query) use ($preferred_categories, $preferred_sources, $preferred_authors) {
            if ($preferred_categories) {
                $query->orWhereIn('category', $preferred_categories);
            }
            if ($preferred_sources) {
                $query->orWhereIn('source', $preferred_sources);
            }
            if ($preferred_authors) {
                $query->orWhereIn('author', $preferred_authors);
            }
        });

        if (!empty($request->get('keyword'))) {
            $articles->where('title', 'like', '%' . $request->keyword . '%');
        }

        if (!empty($request->get('category'))) {
            $articles->where('category', $request->category);
        }

        if (!empty($request->get('source'))) {
            $articles->where('source', $request->source);
        }

        if (!empty($request->get('author'))) {
            $articles->where('author', $request->author);
        }

        if (!empty($request->get('date'))) {
            $articles->whereDate('published_at', $request->date);
        }

        //return $articles->toSql();
        //return $articles->getBindings();
        // Paginate the results (12 results per page by default)
        $personalizedArticles = $articles->orderBy('published_at', 'desc')->paginate(12);

        return response()->json($personalizedArticles);
    }

    // Fetch available sources
    public function getSources()
    {
        $sources = $this->getPreferencesBy('source');
        return response()->json($sources, 200);
    }

    // Fetch available categories
    public function getCategories()
    {
        $categories = $this->getPreferencesBy('category');
        return response()->json($categories, 200);
    }

    // Fetch available authors
    public function getAuthors()
    {
        $authors = $this->getPreferencesBy('author');
        return response()->json($authors, 200);
    }

    // Fetch available sources
    public function getUserSources()
    {
        $userSources = $this->getPersonalizedPreferencesBy('preferred_sources');
        return response()->json($userSources, 200);
    }

    // Fetch available categories
    public function getUserCategories()
    {
        $userCategories = $this->getPersonalizedPreferencesBy('preferred_categories');
        return response()->json($userCategories, 200);
    }

    // Fetch available authors
    public function getUserAuthors()
    {
        $userAuthors = $this->getPersonalizedPreferencesBy('preferred_authors');
        return response()->json($userAuthors, 200);
    }

    protected function getPreferencesBy($type)
    {
        return Article::select($type, DB::raw('MAX(published_at) as latest_published_at'))
            ->whereNotNull($type)
            ->where($type, '!=', '')
            ->groupBy($type)
            ->orderBy('latest_published_at', 'desc')
            ->pluck($type);
    }

    protected function getPersonalizedPreferencesBy($type)
    {
        $user = Auth::user();
        $preferences = $user->preferences; // Get user preferences

        if (!$preferences) {
            return response()->json(['data' => []], 400);
        }

        return json_decode($preferences->$type, true) ?? [];
    }


}
