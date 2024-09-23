<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Article routes
Route::get('/articles', [ArticleController::class, 'index']);

// get and set User preference
Route::get('/user/preferences', [UserPreferenceController::class, 'getPreferences'])->middleware('auth:sanctum');
Route::post('/user/preferences', [UserPreferenceController::class, 'setPreferences'])->middleware('auth:sanctum');
Route::get('/user/articles/personalized', [ArticleController::class, 'getPersonalizedArticles'])->middleware('auth:sanctum');

// homepage search articles section's drop box for authenticated user's sources, categories and authors
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/sources', [ArticleController::class, 'getUserSources']);
    Route::get('/user/categories', [ArticleController::class, 'getUserCategories']);
    Route::get('/user/authors', [ArticleController::class, 'getUserAuthors']);
});

// homepage search articles section's drop box for all available sources, categories and authors
Route::get('/sources', [ArticleController::class, 'getSources']);
Route::get('/categories', [ArticleController::class, 'getCategories']);
Route::get('/authors', [ArticleController::class, 'getAuthors']);

// Routes are provided by Laravel Breeze for API authentication: login, register, logout
require __DIR__.'/auth.php';
