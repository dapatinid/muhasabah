<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Komentar;
use App\Models\Reaksi;
use App\Models\Rating;
use Inertia\Inertia;

class AktifitasController extends Controller
{
    public function donasi()
    {
        $data = Payment::where('user_id', auth()->id())
            ->where('mutation_type', 'donasi_utama')
            ->with('paymentable:id,judul,slug')
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Aktifitas/Donasi', [
            'currentTab' => 'donasi',
            'dataList' => $data,
            'breadcrumbs' => [
                ['title' => 'Aktifitas', 'href' => "/user/aktifitas/donasi"],
                ['title' => 'Donasi Saya', 'href' => "/user/aktifitas/donasi"],
            ],
        ]);
    }

    public function tiket()
    {
        $data = Payment::where('user_id', auth()->id())
            ->where('mutation_type', 'tiket')
            ->with('paymentable:id,judul,slug')
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Aktifitas/Tiket', [
            'currentTab' => 'tiket',
            'dataList' => $data,
            'breadcrumbs' => [
                ['title' => 'Aktifitas', 'href' => "/user/aktifitas/donasi"],
                ['title' => 'Tiket Saya', 'href' => "/user/aktifitas/tiket"],
            ],
        ]);
    }

    public function reaksi()
    {
        $data = Reaksi::where('user_id', auth()->id())
            ->with('reaktiable:id,judul,slug')
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Aktifitas/Reaksi', [
            'currentTab' => 'reaksi',
            'dataList' => $data,
            'breadcrumbs' => [
                ['title' => 'Aktifitas', 'href' => "/user/aktifitas/donasi"],
                ['title' => 'Reaksi Saya', 'href' => "/user/aktifitas/reaksi"],
            ],
        ]);
    }

    public function komentar()
    {
        $data = Komentar::where('user_id', auth()->id())
            ->with('commentable:id,judul,slug')
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Aktifitas/Komentar', [
            'currentTab' => 'komentar',
            'dataList' => $data,
            'breadcrumbs' => [
                ['title' => 'Aktifitas', 'href' => "/user/aktifitas/donasi"],
                ['title' => 'Komentar Saya', 'href' => "/user/aktifitas/komentar"],
            ],
        ]);
    }

    public function rating()
    {
        $data = Rating::where('user_id', auth()->id())
            ->with('rateable')
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Aktifitas/Rating', [
            'currentTab' => 'rating',
            'dataList' => $data,
            'breadcrumbs' => [
                ['title' => 'Aktifitas', 'href' => "/user/aktifitas/donasi"],
                ['title' => 'Rating Saya', 'href' => "/user/aktifitas/rating"],
            ],
        ]);
    }
}