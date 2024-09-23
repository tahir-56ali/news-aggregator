<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    // Get user preferences
    public function getPreferences(Request $request)
    {
        $user = $request->user();
        $preferences = UserPreference::where('user_id', $user->id)->first();

        if (!$preferences) {
            return response()->json([
                'preferred_sources' => [],
                'preferred_categories' => [],
                'preferred_authors' => [],
            ]);
        }

        return response()->json([
            'preferred_sources' => json_decode($preferences->preferred_sources),
            'preferred_categories' => json_decode($preferences->preferred_categories),
            'preferred_authors' => json_decode($preferences->preferred_authors),
        ]);
    }

    // Set user preferences
    public function setPreferences(Request $request)
    {
        $user = $request->user();

        $preferences = UserPreference::updateOrCreate(
            ['user_id' => $user->id],
            [
                'preferred_sources' => json_encode($request->preferred_sources),
                'preferred_categories' => json_encode($request->preferred_categories),
                'preferred_authors' => json_encode($request->preferred_authors),
            ]
        );

        return response()->json(['message' => 'Preferences saved successfully']);
    }
}
