<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $table = 'articles';

    protected $fillable = [
        'title',
        'content',
        'author',
        'image_url',
        'source',
        'category',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public static $rules = [
        'title' => 'required|string|unique:articles|max:255',
        'content' => 'nullable|string',
        'image_url' => 'required|url',
        'source' => 'required|string|max:255',
        'category' => 'required|string|max:255',
        'author' => 'required|string|max:255',
        'published_at' => 'required|date',
    ];
}
