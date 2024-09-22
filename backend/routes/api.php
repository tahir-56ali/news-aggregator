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
Route::get('/user/articles', [ArticleController::class, 'userArticles'])->middleware('auth:sanctum');

// User preference routes
Route::get('/user/preferences', [UserPreferenceController::class, 'getPreferences'])->middleware('auth:sanctum');
Route::post('/user/preferences', [UserPreferenceController::class, 'setPreferences'])->middleware('auth:sanctum');
Route::get('/user/articles/personalized', [ArticleController::class, 'getPersonalizedArticles']);
    //->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sources', [ArticleController::class, 'getSources']);
    Route::get('/categories', [ArticleController::class, 'getCategories']);
    Route::get('/authors', [ArticleController::class, 'getAuthors']);
});

// Routes are provided by Laravel Breeze for API authentication: login, register, logout
require __DIR__.'/auth.php';
