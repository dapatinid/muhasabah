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

            // Urutkan: yang online (last_seen_at dalam 5 menit terakhir) tampil di atas, lalu terbaru
            $items = $query
                ->orderByRaw('CASE WHEN last_seen_at >= ? THEN 0 ELSE 1 END', [now()->subMinutes(5)])
                ->latest()
                ->paginate(12)
                ->withQueryString();

            // Tambahkan flag is_online ke setiap item
            $items->getCollection()->transform(function ($user) {
                $user->is_online = $user->last_seen_at && $user->last_seen_at->gt(now()->subMinutes(5));
                return $user;
            });
        } 
        elseif ($tab === 'lingkaran') {
            $query = Lingkaran::withAvg('ratings', 'score')->withCount('ratings')->where('is_published', true);
            if ($search) $query->where('nama', 'like', "%{$search}%")->orWhere('jenis', 'like', "%{$search}%");
            $items = $query->latest()->paginate(12)->withQueryString();
        } 
        elseif ($tab === 'masjid') {
            $query = Masjid::withAvg('ratings', 'score')->withCount('ratings')->where('is_published', true);
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
            'lingkarans:id,nama,slug,logo', // Ambil data lingkaran yang diikuti tokoh
            'masjids:id,nama,slug,logo',    // Ambil data masjid yang diikuti tokoh
            'kalams' => function($query) {
                $query->where('is_published', true)
                      ->withCount(['komentars', 'reaksis']) // Hitung jumlah komentar & reaksi
                      ->latest();
            },
            'donasis' => function($query) {
                $query->where('is_published', true)
                      ->withSum(['payments as donasi_masuk' => function($q) {
                          $q->where('mutation_type', 'donasi_utama');
                      }], 'nominal') // Hitung total donasi masuk per program
                      ->latest();
            },
            'acaras' => function($query) {
                $query->where('is_published', true)->latest();
            }
        ]);

        // Tambahkan flag is_online (true jika aktif dalam 5 menit terakhir)
        $user->is_online = $user->last_seen_at && $user->last_seen_at->gt(now()->subMinutes(5));

        return Inertia::render('Tokoh', [
            'user' => $user
        ]);
    }

    /**
     * Halaman Profil Publik Komunitas / Lingkaran
     */
    public function lingkaran(Lingkaran $lingkaran)
    {
        // 🛠️ PERBAIKAN: Gagalkan akses jika statusnya belum di-publish (Error 404)
        if (!$lingkaran->is_published) {
            abort(404);
        }

        // Muat jumlah ulasan, rata-rata rating, daftar anggota (users), dan detail ulasan (ratings)
        $lingkaran->loadAvg('ratings', 'score')
                  ->loadCount('ratings')
                  ->load([
                      'users:id,name,avatar,slug,class', // Ambil data orang-orang di lingkaran ini
                      'ratings' => function($query) {
                          $query->with('user:id,name,avatar')->latest(); // Ambil ulasan terbaru beserta info user pembawa ulasan
                      }
                  ]);

        return Inertia::render('Lingkaran', [
            'lingkaran' => $lingkaran
        ]);
    }

    /**
     * Halaman Profil Publik Masjid
     */
    public function masjid(Masjid $masjid)
    {// 🛠️ PERBAIKAN: Gagalkan akses jika statusnya belum di-publish (Error 404)
        if (!$masjid->is_published) {
            abort(404);
        }
        // Muat jumlah ulasan, rata-rata rating, daftar anggota (users), dan detail ulasan (ratings)
        $masjid->loadAvg('ratings', 'score')
                  ->loadCount('ratings')
                  ->load([
                      'users:id,name,avatar,slug,class', // Ambil data orang-orang di lingkaran ini
                      'ratings' => function($query) {
                          $query->with('user:id,name,avatar')->latest(); // Ambil ulasan terbaru beserta info user pembawa ulasan
                      }
                  ]);

        return Inertia::render('Masjid', [
            'masjid' => $masjid
        ]);
    }
}