<?php

namespace App\Http\Controllers;

use App\Models\Kalam;
use App\Models\Donasi;
use App\Models\Acara;
use App\Models\Payment;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'total_kalam' => Kalam::count(),
                'total_donasi' => Donasi::count(),
                'total_acara' => Acara::count(),
                'donasi_terkumpul' => Payment::whereMutationType('donasi_utama')->sum('nominal'), // Contoh statistik
            ]
        ]);
    }
}