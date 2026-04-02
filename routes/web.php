<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\LaporanRiyadhohController;

Route::inertia('/', 'Welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Laporan Riyadhoh — publik (tidak perlu login)
Route::post('/laporan', [LaporanRiyadhohController::class, 'store'])->name('laporan.store');

// Tampilan data laporan — bisa dikunci dengan auth jika perlu
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
    Route::get('/laporan', [LaporanRiyadhohController::class, 'index'])->name('laporan.index');
});

require __DIR__.'/settings.php';