<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\DonasiController;
use App\Http\Controllers\KalamController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\LaporanRiyadhohController;

Route::get('/', function () {
    $kalams = \App\Models\Kalam::with('user:id,name')->latest()->take(3)->get();
    $donasis = \App\Models\Donasi::where('is_published', true)->latest()->take(3)->get();
    // Urutkan berdasarkan priority (ASC), kemudian created_at (DESC)
    $banners = \App\Models\Banner::where('is_active', true)
        ->orderBy('priority', 'asc')
        ->orderBy('created_at', 'desc')
        ->get();

    return \Inertia\Inertia::render('Welcome', [
        'canRegister' => Features::enabled(\Laravel\Fortify\Features::registration()),
        'kalams' => $kalams,
        'banners' => $banners,
        'donasis' => $donasis,
    ]);
})->name('home');

// Laporan Riyadhoh — publik
Route::inertia('/laporan-riyadhoh', 'LaporanRiyadhoh')->name('laporan-riyadhoh');
Route::inertia('/amal-ibadah', 'AmalIbadah')->name('amal-ibadah');
Route::post('/laporan-riyadhoh-submit', [LaporanRiyadhohController::class, 'store'])->name('laporan-riyadhoh.store');
Route::get('/laporan-riyadhoh/log', [LaporanRiyadhohController::class, 'log'])->name('laporan-riyadhoh.log');

Route::get('/kalam', [KalamController::class, 'kalam'])->name('kalam');
Route::get('/donasi', [DonasiController::class, 'donasi'])->name('donasi'); 

Route::get('/donasi/{donasi:slug}/payment', [DonasiController::class, 'payment'])->name('donasi.payment');
Route::post('/donasi/{donasi:slug}/payment', [DonasiController::class, 'storePayment'])->name('donasi.payment.store');

Route::inertia('halaman-dibangun', 'HalamanDibangun')->name('halaman-dibangun');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
    
    Route::get('/admin/kalam', [KalamController::class, 'index'])->name('kalam.index');
    Route::get('/admin/kalam/create', [KalamController::class, 'create'])->name('kalam.create');
    Route::post('/admin/kalam', [KalamController::class, 'store'])->name('kalam.store');
    Route::post('/admin/kalam/upload-image', [KalamController::class, 'uploadImage'])->name('kalam.upload-image');
    Route::get('/admin/kalam/{kalam}/edit', [KalamController::class, 'edit'])->name('kalam.edit');
    Route::put('/admin/kalam/{kalam}', [KalamController::class, 'update'])->name('kalam.update');
    Route::patch('/admin/kalam/{kalam}', [KalamController::class, 'update']);
    Route::delete('/admin/kalam/{kalam}', [KalamController::class, 'destroy'])->name('kalam.destroy');

    Route::get('/admin/donasi', [DonasiController::class, 'index'])->name('donasi.index');
    Route::get('/admin/donasi/create', [DonasiController::class, 'create'])->name('donasi.create');
    Route::post('/admin/donasi', [DonasiController::class, 'store'])->name('donasi.store');
    Route::post('/admin/donasi/upload-image', [DonasiController::class, 'uploadImage'])->name('donasi.upload-image');
    Route::get('/admin/donasi/{donasi}/edit', [DonasiController::class, 'edit'])->name('donasi.edit');
    Route::put('/admin/donasi/{donasi}', [DonasiController::class, 'update'])->name('donasi.update');
    Route::delete('/admin/donasi/{donasi}', [DonasiController::class, 'destroy'])->name('donasi.destroy');   

    Route::post('/admin/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::delete('/admin/payments/{payment}', [PaymentController::class, 'destroy'])->name('payments.destroy'); 

    Route::get('/admin/banner', [BannerController::class, 'index'])->name('banner.index');
    Route::get('/admin/banner/create', [BannerController::class, 'create'])->name('banner.create');
    Route::post('/admin/banner', [BannerController::class, 'store'])->name('banner.store');
    Route::post('/admin/banner/upload', [BannerController::class, 'uploadImage'])->name('banner.upload');    
    Route::get('/admin/banner/{banner}/edit', [BannerController::class, 'edit'])->name('banner.edit');
    Route::put('/admin/banner/{banner}', [BannerController::class, 'update'])->name('banner.update');
    Route::delete('/admin/banner/{banner}', [BannerController::class, 'destroy'])->name('banner.destroy');

    Route::get('/log-riyadhoh', [LaporanRiyadhohController::class, 'logRiyadhoh'])->name('log-riyadhoh');
    Route::patch('/log-riyadhoh/{id}', [LaporanRiyadhohController::class, 'updateLog'])->name('log-riyadhoh.update');
    Route::get('/rapor-riyadhoh', [LaporanRiyadhohController::class, 'raporRiyadhoh'])->name('rapor-riyadhoh');
});

// Show PALING BAWAH — setelah semua route spesifik /kalam/create, /kalam/upload-image
Route::get('/kalam/{kalam}', [KalamController::class, 'show'])->name('kalam.show');
Route::get('/donasi/{donasi}', [DonasiController::class, 'show'])->name('donasi.show');

require __DIR__.'/settings.php';