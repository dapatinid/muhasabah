<?php

namespace App\Http\Controllers;

use App\Models\Donasi;
use App\Models\Komentar;
use App\Models\Payment;
use App\Models\Reaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;

class DonasiController extends Controller
{
    /**
     * Halaman List Donasi untuk Publik
     */
    public function donasi(Request $request)
    {
        $query = Donasi::where('is_published', true)
            // 1. Hitung jumlah transaksi donasi masuk (Untuk info: X Donatur)
            ->withCount(['payments as payments_count' => function ($q) {
                $q->where('mutation_type', 'donasi_utama');
            }])
            // 2. Hitung akumulasi kotor donasi masuk (Untuk info: Total Terkumpul)
            ->withSum(['payments as total_donasi_masuk' => function ($q) {
                $q->where('mutation_type', 'donasi_utama');
            }], 'nominal')
            // 3. Hitung akumulasi dana keluar (Untuk info: Telah Disalurkan)
            ->withSum(['payments as total_tasyaruf' => function ($q) {
                $q->where('mutation_type', 'tasyaruf');
            }], 'nominal');

        // Filter Kategori
        $query->when($request->input('kategori'), function ($q, $kategori) {
            $q->where('kategori', $kategori);
        });

        // Filter Search (Dibungkus agar scope orWhere tidak mengganggu is_published)
        $query->when($request->input('search'), function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('judul', 'like', "%{$search}%")
                    ->orWhere('subkategori', 'like', "%{$search}%");
            });
        });

        return Inertia::render('Donasi', [
            // Tambahkan appends query string agar navigasi halaman (pagination) tidak menghilangkan filter
            'donasis' => $query->latest()->paginate(9)->withQueryString(),
            'filters' => $request->only(['search', 'kategori'])
        ]);
    }

    /**
     * Halaman Management Donasi untuk Admin
     */
    public function index(Request $request)
    {
        $query = Donasi::with('user:id,name')
            ->withCount(['payments as payments_count' => function ($query) {
                $query->where('mutation_type', 'donasi_utama');
            }])
            // Tambahkan akumulasi nominal untuk kebutuhan Donasi Rutin (Target = 0)
            ->withSum(['payments as total_tasyaruf' => function ($query) {
                $query->where('mutation_type', 'tasyaruf');
            }], 'nominal')
            ->withSum(['payments as total_donasi_masuk' => function ($query) {
                $query->where('mutation_type', 'donasi_utama');
            }], 'nominal');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                ->orWhere('kategori', 'like', "%{$search}%")
                ->orWhere('subkategori', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Donasi/Index', [
            'donasis' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Donasi/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'panduan_donasi' => 'required|string|max:1000',
            'body' => 'required|string',
            'kategori' => 'required|string',
            'subkategori' => 'required|string',
            'target_dana' => 'required|numeric|min:0',
            'tgl_mulai' => 'nullable|date',
            'tgl_selesai' => 'nullable|date|after_or_equal:tgl_mulai',
        ]);

        // Pastikan relasi donasis() sudah didefinisikan pada model User Anda
        $request->user()->donasis()->create($validated);

        return redirect()->route('donasi.index')->with('success', 'Program donasi berhasil diterbitkan.');
    }

    /**
     * Tampilkan form edit Donasi
     */
    public function edit(Donasi $donasi)
    {
        $users = User::select('id', 'name')->orderBy('name')->get();
        $attachedUsers = $donasi->users()->pluck('users.id')->toArray();

        return Inertia::render('Admin/Donasi/Edit', [
            'donasi' => $donasi,
            'users' => $users,
            'attachedUsers' => $attachedUsers
        ]);
    }

    /**
     * Proses update Donasi
     */
    public function update(Request $request, Donasi $donasi)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:donasis,slug,' . $donasi->id,
            'body' => 'required',
            'kategori' => 'required|string',
            'subkategori' => 'required|string',
            'target_dana' => 'nullable|numeric',
            'tgl_mulai' => 'nullable|date',
            'tgl_selesai' => 'nullable|date|after_or_equal:tgl_mulai',
            'is_published' => 'boolean',
            'users' => 'nullable|array', // Validasi array user
            'users.*' => 'exists:users,id',
        ]);

        $donasi->update($validated);

        // 🌟 SINKRONISASI RELASI MANY-TO-MANY 🌟
        if ($request->has('users')) {
            $donasi->users()->sync($request->users);
        } else {
            $donasi->users()->sync([]); // Kosongkan jika tidak ada user yang dicentang
        }

        return redirect('/admin/donasi')->with('success', 'Program Donasi berhasil diperbarui.');
    }
    /**
     * Menampilkan halaman form update progress berita donasi (Admin)
     */
    public function progress(Donasi $donasi)
    {
        return Inertia::render('Admin/Donasi/Progress', [
            'donasi' => $donasi,
            'breadcrumbs' => [
                ['title' => 'Donasi', 'href' => '/admin/donasi'],
                ['title' => 'Edit Donasi', 'href' => "/admin/donasi/{$donasi->slug}/edit"],
                ['title' => 'Update Progress', 'href' => "/admin/donasi/{$donasi->slug}/progress"],
            ],
        ]);
    }

    /**
     * Menyimpan data progress ke database
     */
    public function updateProgress(Request $request, Donasi $donasi)
        {
            $request->validate([
                'progress' => 'nullable|string',
            ]);

            // Cek apakah data dari Tiptap / Vue benar-benar masuk?
            // dd($request->progress); // <-- BUKA KOMENTAR INI JIKA MASIH GAGAL UNTUK MELIHAT DATA

            // Set value secara eksplisit dan simpan
            $donasi->progress = $request->input('progress');
            $donasi->save();

            return back()->with('success', 'Berita / Progress donasi berhasil diperbarui.');
        }  

    /**
     * Halaman Manajemen Reaksi / Emoticon Program Donasi
     */
    public function reaksi(Donasi $donasi)
    {
        // 1. Ambil summary/total per tipe reaksi (Grup data)
        $summaryReaksi = $donasi->reaksis()
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->pluck('total', 'type') // Menghasilkan format: ['love' => 12, 'pray' => 45]
            ->toArray();

        // Pastikan semua tipe default terisi minimal 0 agar frontend tidak error
        $tipeDefault = ['love' => 0, 'pray' => 0, 'sad' => 0, 'like' => 0];
        $stats = array_merge($tipeDefault, $summaryReaksi);

        // 2. Ambil list log riwayat reaksi terbaru
        $logs = $donasi->reaksis()
            ->with('user:id,name') // Sertakan info user jika donatur login saat klik
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Donasi/Reaksi', [
            'donasi' => $donasi,
            'stats' => $stats,
            'reaksis' => $logs,
            'breadcrumbs' => [
                ['title' => 'Donasi', 'href' => '/admin/donasi'],
                ['title' => 'Edit Donasi', 'href' => "/admin/donasi/{$donasi->slug}/edit"],
                ['title' => 'Reaksi', 'href' => "/admin/donasi/{$donasi->slug}/reaksi"],
            ],
        ]);
    }

    /**
     * Halaman Manajemen Komentar dan Doa Donatur
     */
    public function komentar(Donasi $donasi, Request $request)
    {
        // 1. Ambil doa dari data transaksi (Payments)
        $paymentsDoa = $donasi->payments()
            ->where('mutation_type', 'donasi_utama')
            ->whereNotNull('notes')
            ->where('notes', '!=', '-')
            ->latest()
            ->paginate(15, ['*'], 'page_doa') // parameter halaman unik agar tidak tabrakan
            ->withQueryString();

        // 2. Ambil komentar dari tabel murni komentar (Komentars)
        // Asumsi nama relasi di model Donasi adalah 'komentars'
        $komentarsPublik = $donasi->komentars()
            ->latest()
            ->paginate(15, ['*'], 'page_komentar') // parameter halaman unik
            ->withQueryString();

        return Inertia::render('Admin/Donasi/Komentar', [
            'donasi' => $donasi,
            'paymentsDoa' => $paymentsDoa,
            'komentarsPublik' => $komentarsPublik,
            'breadcrumbs' => [
                ['title' => 'Donasi', 'href' => '/admin/donasi'],
                ['title' => 'Edit Donasi', 'href' => "/admin/donasi/{$donasi->slug}/edit"],
                ['title' => 'Komentar', 'href' => "/admin/donasi/{$donasi->slug}/komentar"],
            ],
            // Kirim tab aktif saat ini agar posisi tab tidak reset saat pindah halaman paginasi
            'currentTab' => $request->input('tab', 'doa_transaksi') 
        ]);
    }

    /**
     * Halaman Manajemen Arus Kas Masuk (Donasi Utama & Infaq)
     */
    public function donasiMasuk(Request $request, Donasi $donasi)
    {
        // Buat base query
        $query = $donasi->payments()->latest();

        // Jika ada filter type, terapkan ke query
        if ($request->filled('type')) {
            $query->where('mutation_type', $request->type);
        }

        // Paginate dan bawa parameter query string (filter) ke link paginasi
        $payments = $query->paginate(20)->withQueryString();

        // Hitung total ringkasan internal (ini tetap menghitung total keseluruhan terlepas dari filter)
        $summary = [
            'total_donasi' => $donasi->payments()->where('mutation_type', 'donasi_utama')->sum('nominal'),
            'total_infaq' => $donasi->payments()->where('mutation_type', 'infaq_sistem')->sum('nominal'),
        ];

        return Inertia::render('Admin/Donasi/DonasiMasuk', [
            'donasi' => $donasi,
            'payments' => $payments,
            'summary' => $summary,
            'breadcrumbs' => [
                ['title' => 'Donasi', 'href' => '/admin/donasi'],
                ['title' => 'Edit Donasi', 'href' => "/admin/donasi/{$donasi->slug}/edit"],
                ['title' => 'Donasi Masuk', 'href' => "/admin/donasi/{$donasi->slug}/donasi-masuk"],
            ],
            // Kirim state filter saat ini ke frontend
            'filters' => $request->only(['type']) 
        ]);
    }

    /**
     * Halaman Manajemen Penyaluran Dana / Cash-out (Tasyaruf)
     */
    public function tasyaruf(Donasi $donasi)
    {
        // Filter tasyaruf diambil dari mutasi debit/kredit akun pengeluaran 
        // atau jika Anda mempunyai mutasi khusus pengeluaran di model Payment
        $tasyarufs = $donasi->payments()
            ->where('mutation_type', 'tasyaruf') 
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Donasi/Tasyaruf', [
            'donasi' => $donasi,
            'tasyarufs' => $tasyarufs,
            'breadcrumbs' => [
                ['title' => 'Donasi', 'href' => '/admin/donasi'],
                ['title' => 'Edit Donasi', 'href' => "/admin/donasi/{$donasi->slug}/edit"],
                ['title' => 'Tasyaruf', 'href' => "/admin/donasi/{$donasi->slug}/tasyaruf"],
            ],
        ]);
    }    

    public function storeTasyaruf(Request $request, Donasi $donasi)
    {
        // Bersihkan nominal dari format ribuan titik jika diinput manual dengan pemisah
        if ($request->has('nominal')) {
            $request->merge([
                'nominal' => str_replace('.', '', $request->nominal),
            ]);
        }

        $request->validate([
            'nominal' => 'required|numeric|min:1000',
            'notes' => 'required|string|max:500',
            'rekening' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // LOCK FOR UPDATE: Kunci baris data donasi ini dan ambil nilai saldo terupdate dari database
            $lockedDonasi = Donasi::where('id', $donasi->id)->lockForUpdate()->first();

            // Validasi sisa saldo setelah data dikunci untuk memastikan data benar-benar akurat
            if ($request->nominal > $lockedDonasi->saldo) {
                throw new \Exception('Nominal pengeluaran melebihi sisa saldo program donasi saat ini.');
            }

            // 1. Catat Mutasi Pengeluaran di tabel Payments
            $tasyaruf = new Payment([
                'nominal' => $request->nominal,
                'nominal_plus' => $request->nominal,
                'debit_akun' => 'LR-KR PENYALURAN DONASI', 
                'kredit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')', 
                'mutation_type' => 'tasyaruf',
                'no_wa' => '-',
                'sapaan' => '-',
                'atas_nama' => 'Penyaluran Sistem',
                'notes' => $request->notes,
                'payment_method' => 'transfer',
                'rekening' => $request->rekening,
                'date' => now(),
                'user_id' => auth()->id(),
                'is_anonymous' => false,
            ]);
            
            $lockedDonasi->payments()->save($tasyaruf);

            // 2. Kurangi Saldo Program Donasi yang telah dikunci
            $lockedDonasi->decrement('saldo', $request->nominal);

            DB::commit();

            return back()->with('success', 'Pengeluaran dana tasyaruf berhasil dicatat.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mencatat pengeluaran: ' . $e->getMessage()]);
        }
    }  

    /**
     * Detail Donasi (Publik/Admin)
     */
    public function show(Donasi $donasi)
    {
        // Bersihkan bodi dari tag HTML untuk deskripsi pratinjau WA (Maks 150 karakter)
        $cleanDescription = Str::limit(strip_tags($donasi->body), 150, '...');

        // Asumsikan field thumbnail donasi Anda bernama 'thumbnail'. 
        // Pastikan menghasilkan URL absolut (https://...) menggunakan asset() atau Storage::url()
        $imageUrl = $donasi->thumbnail ? $donasi->thumbnail : asset('favicon.png');

        return Inertia::render('DonasiShow', [
            'donasi' => $donasi->load([
                'user:id,name,slug', 
                'users',
                'komentars' => function($q) {
                    $q->with('user:id,name')->latest();
                },
                'reaksis',
                'payments' => function($q) {
                    $q->whereIn('mutation_type', ['donasi_utama', 'infaq_sistem', 'tasyaruf'])
                    ->latest()
                    ->limit(50);
                }
            ]),
            // Kirim data SEO meta khusus ke page props
            'meta' => [
                'title' => $donasi->judul,
                'description' => $cleanDescription,
                'image' => $imageUrl,
                'url' => request()->fullUrl(),
            ]
        ]);
    }

   // Contoh untuk Donasi (Terapkan pola yang sama persis untuk Kalam dan Acara, cukup sesuaikan parameter modelnya)
    public function storeKomentar(Request $request, Donasi $donasi)
    {
        // 1. Validasi Dasar (Body selalu wajib)
        $rules = [
            'body' => 'required|string|max:1000',
        ];

        // 2. Jika GUEST (belum login), wajibkan nama dan captcha
        if (!auth()->check()) {
            $rules['nama_publik'] = 'required|string|max:50';
            $rules['captcha_challenge'] = 'required|string';
            $rules['captcha_answer'] = 'required|integer';
        }

        $request->validate($rules);

        // 3. Verifikasi Math Captcha (Hanya untuk GUEST)
        if (!auth()->check()) {
            $challenge = $request->input('captcha_challenge'); 
            if (strpos($challenge, '+') !== false) {
                [$num1, $num2] = explode('+', $challenge);
                $correctAnswer = (int)$num1 + (int)$num2;

                if ((int)$request->input('captcha_answer') !== $correctAnswer) {
                    return back()->withErrors(['captcha_answer' => 'Kode keamanan captcha salah.']);
                }
            } else {
                return back()->withErrors(['captcha_challenge' => 'Tantangan keamanan tidak valid.']);
            }
        }

        // 4. Simpan komentar menggunakan relasi
        $komentar = new Komentar([
            'body' => $request->body,
            // Jika ada nama_publik (berarti guest), simpan. Jika login, biarkan null.
            'nama_publik' => $request->filled('nama_publik') ? strip_tags($request->nama_publik) : null,
            'user_id' => auth()->check() ? auth()->id() : null,
        ]);

        $donasi->komentars()->save($komentar);

        return back()->with('success', 'Komentar Anda berhasil diterbitkan.');
    }

    /**
     * Menyimpan, Mengubah, atau Membatalkan Reaksi Publik/User
     */
    public function storeReaksi(Request $request, Donasi $donasi)
    {
        $request->validate([
            'type' => 'required|string|in:love,like,pray,sad',
        ]);

        $type = $request->input('type');
        $ipAddress = $request->ip();
        $userId = auth()->id(); // Bisa null jika tidak login

        // 1. Cari apakah identifier ini (User ID atau IP jika anonim) sudah pernah bereaksi di donasi ini
        $existingReaction = $donasi->reaksis()
            ->where(function ($query) use ($userId, $ipAddress) {
                if ($userId) {
                    // Jika login, cek berdasarkan user_id
                    $query->where('user_id', $userId);
                } else {
                    // Jika tidak login, cek berdasarkan IP Address dan pastikan user_id-nya null
                    $query->where('ip_address', $ipAddress)->whereNull('user_id');
                }
            })
            ->first();

        if ($existingReaction) {
            if ($existingReaction->type === $type) {
                // Kasus A: Jika klik emoji yang SAMA -> Batalkan reaksi (Unlike / Toggle off)
                $existingReaction->delete();
            } else {
                // Kasus B: Jika klik emoji yang BERBEDA -> Ganti ke reaksi baru (Pindah Reaksi)
                $existingReaction->update([
                    'type' => $type,
                    'ip_address' => $ipAddress // Update IP juga jika sewaktu-waktu IP-nya berubah
                ]);
            }
        } else {
            // Kasus C: Belum pernah bereaksi sama sekali -> Buat baru
            $reaksi = new Reaksi([
                'type' => $type,
                'ip_address' => $ipAddress,
                'user_id' => $userId,
            ]);
            $donasi->reaksis()->save($reaksi);
        }

        return back();
    }   

    public function destroy(Donasi $donasi)
    {
        $donasi->delete();
        return back()->with('success', 'Program donasi berhasil dihapus.');
    }

    /**
     * Upload bukti transfer susulan oleh donatur
     */
    public function uploadBuktiSusulan(Request $request, Payment $payment)
    {
        $request->validate([
            'bukti_transaksi' => 'required|image|mimes:jpeg,png,jpg,webp|max:4000',
        ]);

        try {
            DB::beginTransaction();

            // 1. Simpan file baru
            $imagePath = $request->file('bukti_transaksi')->store('bukti-transfer', 'public');

            // 2. Update record pembayaran (Donasi Utama)
            $payment->update([
                'image' => $imagePath,
            ]);

            // 3. Update juga record Infaq Sistem jika ada yang berpasangan
            // Kita cari infaq yang dibuat di waktu yang sama oleh orang yang sama
            $infaqPasangan = Payment::where('mutation_type', 'infaq_sistem')
                ->where('created_at', $payment->created_at)
                ->where('atas_nama', $payment->atas_nama)
                ->where('paymentable_id', $payment->paymentable_id)
                ->first();

            if ($infaqPasangan) {
                $infaqPasangan->update(['image' => $imagePath]);
            }

            DB::commit();

            return back()->with('success', 'Bukti transfer berhasil diunggah.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['bukti_transaksi' => 'Gagal mengunggah bukti: ' . $e->getMessage()]);
        }
    }    

    public function payment(Donasi $donasi)
    {
        return Inertia::render('DonasiPayment', [
            'donasi' => $donasi
        ]);
    }

    public function storePayment(Request $request, Donasi $donasi)
    {
        // 1. Bersihkan nominal dari titik jika masih ada (antisipasi input string)
        if ($request->has('nominal')) {
            $request->merge([
                'nominal' => str_replace('.', '', $request->nominal),
                'infaq_sistem' => str_replace('.', '', $request->infaq_sistem),
            ]);
        }

        $request->validate([
            'nominal' => 'required|numeric|min:1000',
            'infaq_sistem' => 'required|numeric',
            'no_wa' => 'required|numeric',
            'sapaan' => 'required|string',
            'atas_nama' => $request->is_anonymous ? 'nullable' : 'required|string', 
            'notes' => 'nullable|string',
            'payment_method' => 'required|string',
            'rekening' => 'required|string',
            'bukti_transaksi' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4000'
        ]);

        try {
            DB::beginTransaction();

            // LOCK FOR UPDATE: Kunci record donasi ini agar aman dari perubahan konkuren selama proses payment berjalan
            $lockedDonasi = Donasi::where('id', $donasi->id)->lockForUpdate()->first();

            $isAnonymous = filter_var($request->is_anonymous, FILTER_VALIDATE_BOOLEAN);

            // --- PROSES UPLOAD BUKTI DONASI ---
            $imagePath = null;
            if ($request->hasFile('bukti_transaksi')) {
                $imagePath = $request->file('bukti_transaksi')->store('bukti-transfer', 'public');
            }

            // 1. Catat Infaq Pemeliharaan Sistem
            $infaq = new Payment([
                'nominal' => $request->infaq_sistem,
                'nominal_plus' => $request->infaq_sistem,
                'debit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')', 
                'kredit_akun' => 'NR-DB INFAQ SISTEM', 
                'mutation_type' => 'infaq_sistem',
                'no_wa' => $request->no_wa,
                'sapaan' => $request->sapaan,
                'atas_nama' => $isAnonymous ? 'Hamba Allah' : $request->atas_nama,
                'notes' => 'Infaq Sistem: ' . ($request->notes ?? '-'),
                'payment_method' => $request->payment_method,
                'rekening' => $request->rekening,
                'date' => now(),
                'user_id' => auth()->id(),
                'is_anonymous' => $isAnonymous,
                'image' => $imagePath,
            ]);
            $lockedDonasi->payments()->save($infaq);


            // 2. Catat Donasi Utama
            $donasiUtama = new Payment([
                'nominal' => $request->nominal,
                'nominal_plus' => $request->nominal,
                'debit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')', 
                'kredit_akun' => 'NR-DB DONASI', 
                'mutation_type' => 'donasi_utama',
                'no_wa' => $request->no_wa,
                'sapaan' => $request->sapaan,
                'atas_nama' => $isAnonymous ? 'Hamba Allah' : $request->atas_nama,
                'notes' => $request->notes,
                'payment_method' => $request->payment_method,
                'rekening' => $request->rekening,
                'date' => now(),
                'user_id' => auth()->id(),
                'is_anonymous' => $isAnonymous,
                'image' => $imagePath,
            ]);
            $lockedDonasi->payments()->save($donasiUtama);

            // 3. Update Saldo pada instansi yang dikunci
            $lockedDonasi->increment('saldo', $request->nominal);

            DB::commit();

            return redirect()
                ->route('donasi.show', [$lockedDonasi->slug, 'tab' => 'laporan'])
                ->with('success', 'Terima kasih atas donasi Anda! Pembayaran sedang diproses.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }

    public function storeBulkDonasi(Request $request, Donasi $donasi)
    {
        $rows = collect($request->input('donations', []))->filter(function ($row) {
            return !empty($row['nominal']);
        });

        if ($rows->isEmpty()) {
            return back()->withErrors(['bulk_error' => 'Minimal harus mengisi 1 data donasi yang valid.']);
        }

        if ($rows->count() > 10) {
            return back()->withErrors(['bulk_error' => 'Maksimal input adalah 10 donasi dalam satu waktu.']);
        }

        $paymentsToSave = [];
        $totalIncrementSaldo = 0;

        foreach ($rows as $index => $row) {
            $nominalDonasi = (int) str_replace('.', '', $row['nominal']);
            $nominalInfaq = (int) str_replace('.', '', $row['infaq_sistem'] ?? '0');
            $isAnonymous = filter_var($row['is_anonymous'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $tanggalTransaksi = !empty($row['date']) ? $row['date'] : now();
            
            $viaMethod = strtoupper($row['via'] ?? 'CASH');
            $akunAkuntansi = ($viaMethod === 'CASH') 
                ? 'NR-DB CASH/BANK (CASH TUNAI ADMIN)' 
                : "NR-DB CASH/BANK (TRANSFER {$viaMethod} ADMIN)";

            $namaDonatur = $isAnonymous ? 'Hamba Allah' : $row['atas_nama'];

            if ($nominalInfaq > 0) {
                $paymentsToSave[] = [
                    'nominal' => $nominalInfaq,
                    'nominal_plus' => $nominalInfaq,
                    'debit_akun' => $akunAkuntansi,
                    'kredit_akun' => 'NR-DB INFAQ SISTEM',
                    'mutation_type' => 'infaq_sistem',
                    'no_wa' => $row['no_wa'] ?? '0',
                    'sapaan' => $row['sapaan'] ?? 'Sdr/i',
                    'atas_nama' => $namaDonatur,
                    'notes' => 'Infaq Sistem (' . $viaMethod . '): ' . ($row['notes'] ?? '-'),
                    'rekening' => $viaMethod,
                    'payment_method' => $viaMethod === 'CASH' ? 'TUNAI' : 'BANK',
                    'date' => $tanggalTransaksi,
                    'user_id' => auth()->id(),
                    'is_anonymous' => $isAnonymous,
                    'image' => null,
                ];
            }

            $paymentsToSave[] = [
                'nominal' => $nominalDonasi,
                'nominal_plus' => $nominalDonasi,
                'debit_akun' => $akunAkuntansi,
                'kredit_akun' => 'NR-DB DONASI',
                'mutation_type' => 'donasi_utama',
                'no_wa' => $row['no_wa'] ?? '0',
                'sapaan' => $row['sapaan'] ?? 'Sdr/i',
                'atas_nama' => $namaDonatur,
                'notes' => $row['notes'] ?? 'Input Bulk oleh Admin',
                'rekening' => $viaMethod,
                'payment_method' => $viaMethod === 'CASH' ? 'TUNAI' : 'BANK',
                'date' => $tanggalTransaksi,
                'user_id' => auth()->id(),
                'is_anonymous' => $isAnonymous,
                'image' => null,
            ];

            $totalIncrementSaldo += $nominalDonasi;
        }

        try {
            DB::beginTransaction();

            // LOCK FOR UPDATE: Mengunci record donasi agar tidak ada pembaruan saldo di luar antrean transaksi ini
            $lockedDonasi = Donasi::where('id', $donasi->id)->lockForUpdate()->first();

            foreach ($paymentsToSave as $paymentData) {
                $lockedDonasi->payments()->create($paymentData);
            }

            // Naikkan saldo program donasi yang terkunci
            $lockedDonasi->increment('saldo', $totalIncrementSaldo);

            DB::commit();
            return back()->with('success', 'Berhasil menginput data donasi beserta infaq pemeliharaan sistem!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['bulk_error' => 'Gagal memproses simpan data: ' . $e->getMessage()]);
        }
    }

    public function toggleStatus(Payment $payment)
    {
        // Toggle: Jika status 'success', ubah jadi null, jika null/lainnya, ubah jadi 'success'
        $newStatus = ($payment->status === 'success') ? null : 'success';
        
        $payment->update([
            'status' => $newStatus
        ]);

        return back()->with('success', 'Status transaksi berhasil diperbarui.');
    }    

   public function generateMayarLink(Payment $payment)
    {
        if ($payment->status === 'success' || $payment->image) {
            return back()->with('error', 'Pembayaran tidak valid untuk otomatisasi.');
        }

        if (!empty($payment->link)) {
            return back()->with('info', $payment->link);
        }

        // 🌟 PERBAIKAN: Cari infaq pasangan secara adaptif (Berlaku untuk Donasi_Utama, Sponsor, & Tiket)
        // Kita mencari baris 'infaq_sistem' yang di-insert bersamaan pada detik & nama yang sama
        $infaqPasangan = Payment::where('mutation_type', 'infaq_sistem')
            ->where('paymentable_type', $payment->paymentable_type)
            ->where('paymentable_id', $payment->paymentable_id)
            ->where('created_at', $payment->created_at)
            ->where('atas_nama', $payment->atas_nama)
            ->first();

        // Jumlahkan nominal murni beserta infaq sistem pendukungnya
        $totalAmount = (int) $payment->nominal;
        if ($infaqPasangan) {
            $totalAmount += (int) $infaqPasangan->nominal;
        }

        // Tentukan Redirect URL & Deskripsi secara Dinamis berdasarkan Model Asal
        $redirectUrl = url('/');
        $description = $payment->notes ?? '-';

        if ($payment->paymentable_type === 'App\Models\Donasi') {
            $redirectUrl = url('/donasi/' . $payment->paymentable->slug . '?tab=laporan');
            $description = 'REF-' . $payment->id . ' | Donasi & Infaq: ' . ($payment->notes ?? '-');
        } elseif ($payment->paymentable_type === 'App\Models\Acara') {
            $tabName = ($payment->mutation_type === 'tiket') ? 'peserta' : 'doa';
            $redirectUrl = url('/acara/' . $payment->paymentable->slug . '?tab=' . $tabName);
            
            $jenisTransaksi = ($payment->mutation_type === 'tiket') ? 'Tiket' : 'Sponsor';
            $description = 'REF-' . $payment->id . ' | ' . $jenisTransaksi . ' Acara & Infaq: ' . ($payment->notes ?? '-');
        }

        $payload = [
            'name'         => $payment->atas_nama ?? 'Hamba Allah',
            'email'        => 'donatur_' . $payment->id . '@muhasabah.id',
            'mobile'       => $payment->no_wa ?? '085000000000', 
            'amount'       => $totalAmount, // 🔥 Sekarang nominal sudah terakumulasi akurat!
            'description'  => $description,
            'reference_id' => (string) $payment->id,
            'redirectUrl'  => $redirectUrl,
            'expiredAt'    => now()->addHours(24)->toIso8601String(),
        ];

        $response = Http::withToken(env('MAYAR_API_KEY'))
            ->post('https://api.mayar.id/hl/v1/payment/create', $payload);

        if (!$response->successful() || !isset($response['data']['link'])) {
            \Log::error('Mayar API Error', ['response' => $response->body()]);
            return back()->with('error', 'Gagal menghubungkan ke server Mayar.');
        }

        $mayarLink = $response['data']['link'];
        $mayarId = $response['data']['id'] ?? '';

        $payment->update([
            'link'           => $mayarLink,
            'transaction_id' => $mayarId
        ]);

        return back()->with('info', $mayarLink);
    }
}