<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Article;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes
//Route::post('/login', [AuthController::class, 'login']);
//Route::post('/register', [AuthController::class, 'register']);
//Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Article routes
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/user/articles', [ArticleController::class, 'userArticles'])->middleware('auth:sanctum');

// User preference routes
Route::get('/user/preferences', [UserPreferenceController::class, 'getPreferences'])->middleware('auth:sanctum');
Route::post('/user/preferences', [UserPreferenceController::class, 'setPreferences'])->middleware('auth:sanctum');
