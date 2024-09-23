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

        if ($preferred_categories) {
            $articles->orWhereIn('category', $preferred_categories);
        }

        if ($preferred_sources) {
            $articles->orWhereIn('source', $preferred_sources);
        }

        if ($preferred_authors) {
            $articles->orWhereIn('author', $preferred_authors);
        }

        if (!empty($request->get('keyword'))) {
            $articles->where('title', 'like', '%' . $request->keyword . '%');
        }

        if (!empty($request->get('category'))) {
            $articles->where('category', $request->category);
        }

        if (!empty($request->get('source'))) {
            $articles->where('source', $request->source);
        }

        if (!empty($request->get('date'))) {
            $articles->whereDate('published_at', $request->date);
        }

        // Paginate the results (12 results per page by default)
        $personalizedArticles = $articles->orderBy('published_at', 'desc')->paginate(12);

        return response()->json($personalizedArticles);
    }

    // Fetch available sources
    public function getSources()
    {
        $sources = Article::select('source', DB::raw('MAX(published_at) as latest_published_at'))
            ->whereNotNull('source')
            ->where('source', '!=', '')
            ->groupBy('source')
            ->orderBy('latest_published_at', 'desc')
            ->pluck('source');
        return response()->json($sources, 200);
    }

    // Fetch available categories
    public function getCategories()
    {
        $categories = Article::select('category', DB::raw('MAX(published_at) as latest_published_at'))
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->groupBy('category')
            ->orderBy('latest_published_at', 'desc')
            ->pluck('category');
        return response()->json($categories, 200);
    }

    // Fetch available authors
    public function getAuthors()
    {
        $authors = Article::select('author', DB::raw('MAX(published_at) as latest_published_at'))
            ->whereNotNull('author')
            ->where('author', '!=', '')
            ->groupBy('author')
            ->orderBy('latest_published_at', 'desc')
            ->pluck('author');
        return response()->json($authors, 200);
    }
}
