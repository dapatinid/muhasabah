<?php

use App\Http\Controllers\KalamController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\LaporanRiyadhohController;

Route::get('/', function () {
    $kalams = \App\Models\Kalam::with('user:id,name')
        ->latest()
        ->take(4)
        ->get();

    return \Inertia\Inertia::render('Welcome', [
        'canRegister' => \Laravel\Fortify\Features::enabled(\Laravel\Fortify\Features::registration()),
        'kalams' => $kalams,
    ]);
})->name('home');

// Laporan Riyadhoh — publik
Route::inertia('/laporan-riyadhoh', 'LaporanRiyadhoh')->name('laporan-riyadhoh');
Route::inertia('/amal-ibadah', 'AmalIbadah')->name('amal-ibadah');
Route::post('/laporan-riyadhoh-submit', [LaporanRiyadhohController::class, 'store'])->name('laporan-riyadhoh.store');
Route::get('/laporan-riyadhoh/log', [LaporanRiyadhohController::class, 'log'])->name('laporan-riyadhoh.log');

// Kalam publik — index & show
Route::get('/kalam', [KalamController::class, 'index'])->name('kalam.index');

// Kalam butuh login — create, store, upload-image HARUS sebelum /{kalam}
// agar /kalam/create tidak dianggap slug
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');

    Route::get('/kalam/create', [KalamController::class, 'create'])->name('kalam.create');
    Route::post('/kalam', [KalamController::class, 'store'])->name('kalam.store');
    Route::post('/kalam/upload-image', [KalamController::class, 'uploadImage'])->name('kalam.upload-image');
    Route::get('/kalam/{kalam}/edit', [KalamController::class, 'edit'])->name('kalam.edit');
    Route::put('/kalam/{kalam}', [KalamController::class, 'update'])->name('kalam.update');
    Route::patch('/kalam/{kalam}', [KalamController::class, 'update']);
    Route::delete('/kalam/{kalam}', [KalamController::class, 'destroy'])->name('kalam.destroy');

    Route::get('/log-riyadhoh', [LaporanRiyadhohController::class, 'logRiyadhoh'])->name('log-riyadhoh');
    Route::patch('/log-riyadhoh/{id}', [LaporanRiyadhohController::class, 'updateLog'])->name('log-riyadhoh.update');
    Route::get('/rapor-riyadhoh', [LaporanRiyadhohController::class, 'raporRiyadhoh'])->name('rapor-riyadhoh');
});

// Show PALING BAWAH — setelah semua route spesifik /kalam/create, /kalam/upload-image
Route::get('/kalam/{kalam}', [KalamController::class, 'show'])->name('kalam.show');

require __DIR__.'/settings.php';