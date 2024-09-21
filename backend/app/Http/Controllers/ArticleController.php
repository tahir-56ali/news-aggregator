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
    public function userArticles(Request $request)
    {
        $user = $request->user();
        $preferences = UserPreference::where('user_id', $user->id)->first();

        if (!$preferences) {
            return response()->json(['articles' => []]);
        }

        $query = Article::query();

        if ($preferences->preferred_sources) {
            $sources = json_decode($preferences->preferred_sources);
            $query->whereIn('source', $sources);
        }

        if ($preferences->preferred_categories) {
            $categories = json_decode($preferences->preferred_categories);
            $query->whereIn('category', $categories);
        }

        if ($preferences->preferred_authors) {
            $authors = json_decode($preferences->preferred_authors);
            $query->whereIn('author', $authors);
        }

        return response()->json(['articles' => $query->get()]);
    }
}
