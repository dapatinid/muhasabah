<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Lingkaran;
use App\Models\Masjid;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UkhuwahController extends Controller
{
    /**
     * Halaman Utama Direktori Ukhuwah
     */
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

        // Pastikan Anda memindahkan file Ukhuwah.vue ke dalam folder resources/js/Pages/Ukhuwah/Index.vue
        // Jika masih di luar folder, biarkan 'Ukhuwah' saja.
        return Inertia::render('Ukhuwah', [ 
            'items' => $items,
            'tab' => $tab,
            'filters' => $request->only(['search', 'tab']),
        ]);
    }

    /**
     * Halaman Profil Publik Tokoh (User)
     */
    public function tokoh(User $user)
    {
        // Eager load relasi kota, serta ambil kalams, donasis, acaras milik user
        // Kita batasi hanya mengambil yang ter-publish dan beberapa data terbaru (contoh: 4 data terbaru)
        $user->load([
            'city',
            'kalams' => function($query) {
                $query->latest()->take(4);
            },
            'donasis' => function($query) {
                $query->where('is_published', true)->latest()->take(4);
            },
            'acaras' => function($query) {
                $query->where('is_published', true)->latest()->take(4);
            }
        ]);

        return Inertia::render('Tokoh', [
            'user' => $user
        ]);
    }

    /**
     * Halaman Profil Publik Komunitas / Lingkaran
     */
    public function lingkaran(Lingkaran $lingkaran)
    {
        // Muat jumlah ulasan dan rata-rata rating
        $lingkaran->loadAvg('ratings', 'score')->loadCount('ratings');

        return Inertia::render('Lingkaran', [
            'lingkaran' => $lingkaran
        ]);
    }

    /**
     * Halaman Profil Publik Masjid
     */
    public function masjid(Masjid $masjid)
    {
        // Muat jumlah ulasan dan rata-rata rating
        $masjid->loadAvg('ratings', 'score')->loadCount('ratings');

        return Inertia::render('Masjid', [
            'masjid' => $masjid
        ]);
    }
}