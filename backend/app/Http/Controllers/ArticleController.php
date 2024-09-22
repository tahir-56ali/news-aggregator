<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\UserPreference;
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

        if (!empty($request->get('date'))) {
            $query->whereDate('published_at', $request->date);
        }

        // Paginate the results (10 results per page by default)
        $articles = $query->orderBy('published_at', 'desc')->paginate(12); // 12 items per page

        return response()->json($articles);
    }

    // Fetch articles based on user preferences
    public function getPersonalizedArticles()
    {
        $user = Auth::user();
        $preferences = $user->preferences; // Get user preferences

        if (!$preferences) {
            return response()->json(['message' => 'No preferences set'], 400);
        }

        // Fetch articles based on preferences
        $articles = Article::query();

        if ($preferences->categories) {
            $articles->whereIn('category', $preferences->categories);
        }

        if ($preferences->sources) {
            $articles->whereIn('source', $preferences->sources);
        }

        if ($preferences->authors) {
            $articles->whereIn('author', $preferences->authors);
        }

        $personalizedArticles = $articles->get();

        return response()->json($personalizedArticles, 200);
    }

    // Fetch available sources
    public function getSources()
    {
        $sources = Article::select('source')
            ->whereNotNull('source')
            ->where('source', '!=', '')
            ->distinct()
            ->pluck('source');
        return response()->json($sources, 200);
    }

    // Fetch available categories
    public function getCategories()
    {
        $categories = Article::select('category')
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->distinct()
            ->pluck('category');
        return response()->json($categories, 200);
    }

    // Fetch available authors
    public function getAuthors()
    {
        $authors = Article::select('author')
            ->whereNotNull('author')
            ->where('author', '!=', '')
            ->distinct()
            ->pluck('author');
        return response()->json($authors, 200);
    }
}
