<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $user->load([
            'tentangSaya',
            'city',
            'lingkarans:id,nama,slug,logo', // Ambil data lingkaran yang diikuti tokoh
            'masjids:id,nama,slug,logo',    // Ambil data masjid yang diikuti tokoh
            'kalams' => function ($query) {
                $query->where('is_published', true)
                      ->withCount(['komentars', 'reaksis']) // Hitung jumlah komentar & reaksi
                      ->latest();
            },
            'donasis' => function ($query) {
                $query->where('is_published', true)
                      ->withSum(['payments as donasi_masuk' => function ($q) {
                          $q->where('mutation_type', 'donasi_utama');
                      }], 'nominal') // Hitung total donasi masuk per program
                      ->latest();
            },
            'acaras' => function ($query) {
                $query->where('is_published', true)->latest();
            },
        ]);

        return Inertia::render('Dashboard', [
            'user' => $user,
            'stats' => [
                'total_kalam'      => $user->kalams->count(),
                'total_donasi'     => $user->donasis->count(),
                'total_acara'      => $user->acaras->count(),
                'donasi_terkumpul' => $user->donasis->sum('donasi_masuk'),
            ],
        ]);
    }
}