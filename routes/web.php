<?php

use App\Http\Controllers\PrintController;
use App\Http\Middleware\IsAdmin;
use App\Livewire\EventDetailPage;
use App\Livewire\User\Profile;
use Illuminate\Support\Facades\Route;
use App\Livewire\Users\Index;

use App\Livewire\Jurnalamal\Index as JurnalamalIndex;
use App\Livewire\Dashboard\Index as DashboardIndex;
use App\Livewire\Dashboard\Detail as DashboardDetail;
use App\Livewire\Raport\Index as RaportIndex;
use App\Livewire\Raport\Detail as RaportDetail;

use App\Livewire\HomePage;
use App\Livewire\TicketPage;
use App\Livewire\User\ProfileAkun;
use App\Livewire\User\ProfileAlamat;
use App\Livewire\User\ProfileDataDiri;
use App\Livewire\Users\Edit;
use App\Livewire\Users\EditAlamat;
use App\Livewire\Users\EditDataDiri;

Route::get('/login/check', function () {
    return ['authenticated' => auth()->check()];
});

Route::get('/', HomePage::class)->name('home');
// Route::view('/events', 'events')->name('events');
// Route::get('/event/{slug}', EventDetailPage::class)->name('event');

// Route::view('/', 'welcome')->name('welcome');

Route::middleware(['auth'])->group(function () {
//     Route::view('/dashboard', 'dashboard')->name('dashboard');
    Route::get('/dashboard', DashboardIndex::class)->name('dashboard.index');
    Route::get('/progress-detail/{id}', DashboardDetail::class)->name('dashboard.detail');
    Route::get('/jurnal-amal', JurnalamalIndex::class)->name('jurnalamal.index');
    // Route::get('/jurnalamal/{jurnalamalid}/update', Edit::class)->name('jurnalamal.update');

    Route::get('/user/profile', Profile::class)->name('user.profile');
    Route::get('/user/profile-akun', ProfileAkun::class)->name('user.profileakun');
    Route::get('/user/profile-data-diri', ProfileDataDiri::class)->name('user.profiledatadiri');
    Route::get('/user/profile-alamat', ProfileAlamat::class)->name('user.profilealamat');

    // Route::get('/ticket', TicketPage::class)->name('ticket');
    // Route::get('/printtiket', [PrintController::class, 'printtiket'])->name('printtiket');

    Route::middleware(IsAdmin::class)->group(function () {

        Route::get('/raport', RaportIndex::class)->name('raport.index');
        Route::get('/raport/{user_id}-{cha_id}', RaportDetail::class)->name('raport.detail');

        Route::get('/users', Index::class)->name('users.index');
        Route::get('/users/{userid}/edit', Edit::class)->name('users.edit');
        Route::get('/users/{userid}/edit-alamat', EditAlamat::class)->name('users.editalamat');
        Route::get('/users/{userid}/edit-data-diri', EditDataDiri::class)->name('users.editdatadiri');
        
    });
});

require __DIR__.'/auth.php';
