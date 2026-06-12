<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lingkaran;
use App\Models\Masjid;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UkhuwahController extends Controller
{
    public function ukhuwah(Request $request)
    {
        // Default tab adalah 'tokoh'
        $tab = $request->input('tab', 'tokoh'); 
        $search = $request->input('search');

        $items = null;

        if ($tab === 'tokoh') {
            $query = User::query()->whereNotIn('id', [1]); // Bisa tambahkan ->where('is_active', true) jika ada
            if ($search) $query->where('name', 'like', "%{$search}%");
            $items = $query->latest()->paginate(12)->withQueryString();
        } 
        elseif ($tab === 'lingkaran') {
            $query = Lingkaran::withAvg('ratings', 'score')->withCount('ratings');
            if ($search) $query->where('nama', 'like', "%{$search}%")->orWhere('jenis', 'like', "%{$search}%");
            $items = $query->latest()->paginate(12)->withQueryString();
        } 
        elseif ($tab === 'masjid') {
            $query = Masjid::withAvg('ratings', 'score')->withCount('ratings');
            if ($search) $query->where('nama', 'like', "%{$search}%")->orWhere('jenis', 'like', "%{$search}%");
            $items = $query->latest()->paginate(12)->withQueryString();
        }

        return Inertia::render('Ukhuwah', [
            'items' => $items,
            'tab' => $tab,
            'filters' => $request->only(['search', 'tab']),
        ]);
    }
}