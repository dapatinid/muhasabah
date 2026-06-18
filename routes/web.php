<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\DonasiController;
use App\Http\Controllers\KalamController;
use App\Http\Controllers\AcaraController; // Controller Baru
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\LaporanRiyadhohController;
use App\Http\Controllers\LingkaranController;
use App\Http\Controllers\MasjidController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\TentangSayaController;
use App\Http\Controllers\UjiKelayakanController;
use App\Http\Controllers\UkhuwahController;
use App\Models\Province;
use App\Models\City;
use App\Models\District;
use App\Models\Village;

Route::get('/', function () {
    $kalams = \App\Models\Kalam::with('users:id,name')->latest()->take(3)->get();
    
    $donasis = \App\Models\Donasi::with('payments')
        ->where('is_published', true)
        ->latest()
        ->take(3)
        ->get();
        
    $banners = \App\Models\Banner::where('is_active', true)
        ->orderBy('priority', 'asc')
        ->orderBy('created_at', 'desc')
        ->get();

    // 🌟 PERBAIKAN: Tambahkan eager loading untuk relasi 'variants'
    $acaras = \App\Models\Acara::where('is_published', true)
        ->with(['variants']) // <--- Memanggil relasi varian tiket baru
        ->withSum(['payments as donasi_masuk_sum_nominal' => function ($query) {
            $query->where('mutation_type', 'sponsor'); 
        }], 'nominal')
        ->latest()
        ->take(3)
        ->get();

    return \Inertia\Inertia::render('Welcome', [
        'canRegister' => Features::enabled(\Laravel\Fortify\Features::registration()),
        'kalams' => $kalams,
        'banners' => $banners,
        'donasis' => $donasis,
        'acaras' => $acaras,
    ]);
})->name('home');

// Laporan Riyadhoh — publik
Route::inertia('/laporan-riyadhoh', 'LaporanRiyadhoh')->name('laporan-riyadhoh');
Route::inertia('/amal-ibadah', 'AmalIbadah')->name('amal-ibadah');
Route::post('/laporan-riyadhoh-submit', [LaporanRiyadhohController::class, 'store'])->name('laporan-riyadhoh.store');
Route::get('/laporan-riyadhoh/log', [LaporanRiyadhohController::class, 'log'])->name('laporan-riyadhoh.log');

Route::get('/kalam', [KalamController::class, 'kalam'])->name('kalam');
Route::get('/donasi', [DonasiController::class, 'donasi'])->name('donasi');
Route::get('/acara', [AcaraController::class, 'acara'])->name('acara'); 
Route::get('/ukhuwah', [UkhuwahController::class, 'ukhuwah'])->name('ukhuwah');


// Rute Interaksi Publik dengan Rate Limiter Ketat (Anti Spam)
Route::middleware(['throttle:10,1'])->group(function () {
    // ini rute untuk upload bukti pembayaran susulan, karena biasanya ini yang sering terlambat di-upload oleh donatur
    Route::post('/payment/{payment}/upload-bukti', [DonasiController::class, 'uploadBuktiSusulan'])->name('payment.upload_bukti');

    Route::get('/donasi/{donasi:slug}/payment', [DonasiController::class, 'payment'])->name('donasi.payment');
    Route::get('/acara/{acara:slug}/payment', [AcaraController::class, 'payment'])->name('acara.payment'); 

    Route::post('/donasi/{donasi:slug}/payment', [DonasiController::class, 'storePayment'])->name('donasi.payment.store');
    Route::post('/donasi/{donasi:slug}/komentar', [DonasiController::class, 'storeKomentar'])->name('donasi.storeKomentar');
    Route::post('/donasi/{donasi:slug}/reaksi', [DonasiController::class, 'storeReaksi'])->name('donasi.storeReaksi');
    
    Route::post('/acara/{acara:slug}/payment', [AcaraController::class, 'storePayment'])->name('acara.payment.store');
    Route::post('/acara/{acara:slug}/komentar', [AcaraController::class, 'storeKomentar'])->name('acara.storeKomentar');
    Route::post('/acara/{acara:slug}/reaksi', [AcaraController::class, 'storeReaksi'])->name('acara.storeReaksi');

    Route::post('/kalam/{kalam:slug}/komentar', [KalamController::class, 'storeKomentar'])->name('kalam.storeKomentar');
    Route::post('/kalam/{kalam:slug}/reaksi', [KalamController::class, 'storeReaksi'])->name('kalam.storeReaksi');
});

Route::inertia('halaman-dibangun', 'HalamanDibangun')->name('halaman-dibangun');

Route::middleware(['auth', 'verified', 'is_active'])->group(function () {
    
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::inertia('/pendaftaran/relawan-donatur', 'Pendaftaran/RelawanDonatur')->name('pendaftaran.relawan-donatur');
    Route::inertia('/pendaftaran/penulis', 'Pendaftaran/Penulis')->name('pendaftaran.penulis');
    Route::inertia('/pendaftaran/penggalang-dana', 'Pendaftaran/PenggalangDana')->name('pendaftaran.penggalang-dana');
    Route::inertia('/pendaftaran/penyelenggara-acara', 'Pendaftaran/PenyelenggaraAcara')->name('pendaftaran.penyelenggara-acara'); 
    
    Route::post('/pendaftaran/uji-kelayakan', [UjiKelayakanController::class, 'store'])->name('pendaftaran.store');

    Route::post('/lingkaran/{lingkaran:slug}/rate', [RatingController::class, 'storeLingkaran']);
    Route::post('/masjid/{masjid:slug}/rate', [RatingController::class, 'storeMasjid']);

    Route::get('/admin/tentang-saya', function () {
        // Gunakan optional operator (?) agar tidak error jika data kosong
        $tentangSaya = auth()->user()->tentangSaya; 
        
        return inertia('Admin/TentangSaya/Edit', [
            'tentangSaya' => $tentangSaya
        ]);
    })->name('tentang-saya.edit');

    Route::post('/admin/tentang-saya', [TentangSayaController::class, 'storeOrUpdate'])->name('tentang-saya.update');
    
    // Rute Upload Gambar (PENTING: Pastikan URL-nya konsisten dengan di Vue)
    Route::post('/admin/tentang-saya/upload-image', [TentangSayaController::class, 'uploadImage'])->name('tentang-saya.upload-image');
    
    Route::middleware(['admin', 'restrict_owner'])->group(function () {

        Route::middleware(['auth', 'user_class:relawan-donatur'])->group(function () {
            Route::get('/admin/lingkaran', [LingkaranController::class, 'index'])->name('lingkaran.index');
            Route::get('/admin/lingkaran/create', [LingkaranController::class, 'create'])->name('lingkaran.create');
            Route::post('/admin/lingkaran', [LingkaranController::class, 'store'])->name('lingkaran.store');
            Route::post('/admin/lingkaran/upload-image', [LingkaranController::class, 'uploadImage'])->name('lingkaran.upload-image');
            Route::get('/admin/lingkaran/{lingkaran:slug}/edit', [LingkaranController::class, 'edit'])->name('lingkaran.edit');
            Route::put('/admin/lingkaran/{lingkaran:slug}', [LingkaranController::class, 'update'])->name('lingkaran.update');
            Route::patch('/admin/lingkaran/{lingkaran:slug}', [LingkaranController::class, 'update']);

            Route::get('/admin/masjid', [MasjidController::class, 'index'])->name('masjid.index');
            Route::get('/admin/masjid/create', [MasjidController::class, 'create'])->name('masjid.create');
            Route::post('/admin/masjid', [MasjidController::class, 'store'])->name('masjid.store');
            Route::post('/admin/masjid/upload-image', [MasjidController::class, 'uploadImage'])->name('masjid.upload-image');
            Route::get('/admin/masjid/{masjid:slug}/edit', [MasjidController::class, 'edit'])->name('masjid.edit');
            Route::put('/admin/masjid/{masjid:slug}', [MasjidController::class, 'update'])->name('masjid.update');
            Route::patch('/admin/masjid/{masjid:slug}', [MasjidController::class, 'update']);
        });
        
        // Fitur Kelola Kalam (Admin)
        Route::middleware(['auth', 'user_class:penulis'])->group(function () {
            Route::get('/admin/kalam', [KalamController::class, 'index'])->name('kalam.index');
            Route::get('/admin/kalam/create', [KalamController::class, 'create'])->name('kalam.create');
            Route::post('/admin/kalam', [KalamController::class, 'store'])->name('kalam.store');
            Route::post('/admin/kalam/upload-image', [KalamController::class, 'uploadImage'])->name('kalam.upload-image');
            Route::get('/admin/kalam/{kalam}/edit', [KalamController::class, 'edit'])->name('kalam.edit');
            Route::put('/admin/kalam/{kalam}', [KalamController::class, 'update'])->name('kalam.update');
            Route::patch('/admin/kalam/{kalam}', [KalamController::class, 'update']);
            Route::delete('/admin/kalam/{kalam}', [KalamController::class, 'destroy'])->name('kalam.destroy');
        });

        // Fitur Kelola Donasi (Admin)
        Route::middleware(['auth', 'user_class:penggalang-dana'])->group(function () {
            Route::get('/admin/donasi', [DonasiController::class, 'index'])->name('donasi.index');
            Route::get('/admin/donasi/create', [DonasiController::class, 'create'])->name('donasi.create');
            Route::post('/admin/donasi', [DonasiController::class, 'store'])->name('donasi.store');
            Route::get('/admin/donasi/{donasi}/edit', [DonasiController::class, 'edit'])->name('donasi.edit');
            Route::put('/admin/donasi/{donasi}', [DonasiController::class, 'update'])->name('donasi.update');
            Route::get('/admin/donasi/{donasi}/progress', [DonasiController::class, 'progress'])->name('donasi.progress');
            Route::put('/admin/donasi/{donasi}/progress', [DonasiController::class, 'updateProgress'])->name('donasi.progress.update');
            Route::get('/admin/donasi/{donasi}/reaksi', [DonasiController::class, 'reaksi'])->name('donasi.reaksi');
            Route::get('/admin/donasi/{donasi}/komentar', [DonasiController::class, 'komentar'])->name('donasi.komentar');
            Route::get('/admin/donasi/{donasi}/donasi-masuk', [DonasiController::class, 'donasiMasuk'])->name('donasi.donasi-masuk');
            Route::post('/admin/donasi/{donasi}/bulk-donasi', [DonasiController::class, 'storeBulkDonasi'])->name('admin.donasi.bulk');
            Route::get('/admin/donasi/{donasi}/tasyaruf', [DonasiController::class, 'tasyaruf'])->name('donasi.tasyaruf');
            Route::post('/admin/donasi/{donasi}/tasyaruf', [DonasiController::class, 'storeTasyaruf'])->name('donasi.tasyaruf.store');
            Route::delete('/admin/donasi/{donasi}', [DonasiController::class, 'destroy'])->name('donasi.destroy');   
        });
        
        // Fitur Kelola Acara (Admin)
        Route::middleware(['auth', 'user_class:penyelenggara-acara'])->group(function () {
            Route::get('/admin/acara', [AcaraController::class, 'index'])->name('acara.index');
            Route::get('/admin/acara/create', [AcaraController::class, 'create'])->name('acara.create');
            Route::post('/admin/acara', [AcaraController::class, 'store'])->name('acara.store');
            Route::get('/admin/acara/{acara:slug}/edit', [AcaraController::class, 'edit'])->name('acara.edit');
            Route::put('/admin/acara/{acara:slug}', [AcaraController::class, 'update'])->name('acara.update');
            Route::get('/admin/acara/{acara:slug}/progress', [AcaraController::class, 'progress'])->name('acara.progress');
            Route::put('/admin/acara/{acara:slug}/progress', [AcaraController::class, 'updateProgress'])->name('acara.progress.update');
            Route::get('/admin/acara/{acara:slug}/reaksi', [AcaraController::class, 'reaksi'])->name('acara.reaksi');
            Route::get('/admin/acara/{acara:slug}/komentar', [AcaraController::class, 'komentar'])->name('acara.komentar');
            Route::get('/admin/acara/{acara:slug}/keuangan', [AcaraController::class, 'keuangan'])->name('acara.keuangan');
            Route::post('/admin/acara/{acara:slug}/bulk-keuangan', [AcaraController::class, 'bulkKeuangan'])->name('admin.acara.bulk');
            Route::post('/admin/acara/{acara:slug}/tasyaruf', [AcaraController::class, 'storeTasyaruf'])->name('acara.tasyaruf.store');
            Route::delete('/admin/acara/{acara:slug}', [AcaraController::class, 'destroy'])->name('acara.destroy');
        });
        
        // Umum
        Route::put('/admin/payment/{payment}/toggle-status', [DonasiController::class, 'toggleStatus'])->name('payment.toggle_status');
        
        });
        
        Route::middleware('control.panel')->group(function () {

            Route::get('/admin/banner', [BannerController::class, 'index'])->name('banner.index');

            Route::middleware(['super.admin'])->group(function () {
                Route::delete('/admin/lingkaran/{lingkaran:slug}', [LingkaranController::class, 'destroy'])->name('lingkaran.destroy'); 
                Route::delete('/admin/masjid/{masjid:slug}', [MasjidController::class, 'destroy'])->name('masjid.destroy'); 
                    
                // Banner
                Route::get('/admin/banner/create', [BannerController::class, 'create'])->name('banner.create');
                Route::post('/admin/banner', [BannerController::class, 'store'])->name('banner.store');
                Route::post('/admin/banner/upload', [BannerController::class, 'uploadImage'])->name('banner.upload');    
                Route::get('/admin/banner/{banner}/edit', [BannerController::class, 'edit'])->name('banner.edit');
                Route::put('/admin/banner/{banner}', [BannerController::class, 'update'])->name('banner.update');
                Route::delete('/admin/banner/{banner}', [BannerController::class, 'destroy'])->name('banner.destroy');

                // Riyadhoh
                Route::get('/log-riyadhoh', [LaporanRiyadhohController::class, 'logRiyadhoh'])->name('log-riyadhoh');
                Route::patch('/log-riyadhoh/{id}', [LaporanRiyadhohController::class, 'updateLog'])->name('log-riyadhoh.update');
                Route::delete('/log-riyadhoh/{id}', [LaporanRiyadhohController::class, 'deleteLog'])->name('log-riyadhoh.destroy');
                Route::get('/rapor-riyadhoh', [LaporanRiyadhohController::class, 'raporRiyadhoh'])->name('rapor-riyadhoh');        
            });
        });

});

// Show PALING BAWAH
Route::get('/kalam/{kalam:slug}', [KalamController::class, 'show'])->name('kalam.show');
Route::get('/donasi/{donasi:slug}', [DonasiController::class, 'show'])->name('donasi.show');
Route::get('/acara/{acara:slug}', [AcaraController::class, 'show'])->name('acara.show'); // Detail Acara Publik

Route::get('/tokoh/{user:slug}', [UkhuwahController::class, 'tokoh'])->name('tokoh.show');
Route::get('/lingkaran/{lingkaran:slug}', [UkhuwahController::class, 'lingkaran'])->name('lingkaran.show');
Route::get('/masjid/{masjid:slug}', [UkhuwahController::class, 'masjid'])->name('masjid.show');


// Tambahkan rute ini di bawah
Route::get('/api/wilayah/provinces', function () {
    return response()->json(Province::orderBy('name')->get());
});

Route::get('/api/wilayah/cities/{province_code}', function ($province_code) {
    return response()->json(City::where('province_code', $province_code)->orderBy('name')->get());
});

Route::get('/api/wilayah/districts/{city_code}', function ($city_code) {
    return response()->json(District::where('city_code', $city_code)->orderBy('name')->get());
});

Route::get('/api/wilayah/villages/{district_code}', function ($district_code) {
    return response()->json(Village::where('district_code', $district_code)->orderBy('name')->get());
});

// Mayar Integration
Route::post('/payment/{payment}/mayar', [\App\Http\Controllers\DonasiController::class, 'generateMayarLink'])->name('payment.mayar');
Route::post('/webhook/mayar', [\App\Http\Controllers\WebhookController::class, 'handleMayar']);

require __DIR__.'/settings.php';