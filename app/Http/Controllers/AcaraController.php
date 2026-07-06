<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use App\Models\Komentar;
use App\Models\Payment;
use App\Models\Reaksi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AcaraController extends Controller
{
    /**
     * Halaman List Acara untuk Publik
     */
    public function acara(Request $request)
    {
        $query = Acara::where('is_published', true)
                    ->with(['variants']) // 👈 Tambah eager load varian untuk cek list harga
                    ->withSum(['payments as donasi_masuk_sum_nominal' => function ($q) {
                        $q->whereIn('mutation_type', ['tiket', 'sponsor'])->where('status', 'success');
                    }], 'nominal');

        // Filter Kategori
        $query->when($request->input('kategori'), function ($q, $kategori) {
            $q->where('kategori', $kategori);
        });

        // Filter Search
        $query->when($request->input('search'), function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('judul', 'like', "%{$search}%")
                    ->orWhere('subkategori', 'like', "%{$search}%")
                    ->orWhere('lokasi', 'like', "%{$search}%");
            });
        });

        return Inertia::render('Acara', [
                    'acaras' => $query->latest()->paginate(9)->withQueryString(),
                    'filters' => $request->only(['search', 'kategori'])
                ]);
    }  

    /**
     * Halaman Management Acara untuk Admin
     */
    public function index(Request $request)
    {
        $query = Acara::with('user:id,name')
            ->withCount(['payments as tiket_terverifikasi_count' => function ($query) {
                $query->where('mutation_type', 'tiket')->where('status', 'success');
            }])
            ->withSum(['payments as total_tiket_masuk' => function ($query) {
                $query->where('mutation_type', 'tiket')->where('status', 'success');
            }], 'nominal')
            ->withSum(['payments as total_donasi_masuk' => function ($query) {
                $query->where('mutation_type', 'sponsor')->where('status', 'success');
            }], 'nominal')
            ->withSum(['payments as total_pengeluaran' => function ($query) {
                $query->where('mutation_type', 'tasyaruf'); // Mutasi keluar/pengeluaran kas
            }], 'nominal');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                ->orWhere('kategori', 'like', "%{$search}%")
                ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/Acara/Index', [
            'acaras' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Acara/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'panduan_acara' => 'nullable|string|max:1000',
            'body' => 'required|string',
            'kategori' => 'required|string',
            'subkategori' => 'required|string',
            'lokasi' => 'required|string|max:255',
            'accept_tiket' => 'required|boolean',
            'accept_donasi' => 'required|boolean',
            'kuota_tiket' => 'required_if:accept_tiket,true|integer|min:0', 
            'target_donasi' => 'required_if:accept_donasi,true|numeric|min:0',
            'tgl_mulai' => 'nullable|date',
            'tgl_selesai' => 'nullable|date|after_or_equal:tgl_mulai',
            'batas_registrasi' => 'nullable|date|before_or_equal:tgl_mulai',
            
            // Aturan Validasi Varian Baru
            'variants' => 'required_if:accept_tiket,true|array',
            'variants.*.nama_varian' => 'required|string|max:100',
            'variants.*.harga' => 'required|numeric|min:0',
            'variants.*.jumlah_kursi' => 'required|integer|min:1',

            // 🌟 Tambahkan Validasi untuk Users/Authors Multi-select
            'users' => 'nullable|array',
            'users.*' => 'exists:users,id',
        ]);

        // 1. Jalankan transaksi database dan pastikan me-return objek $acara
        $acara = DB::transaction(function () use ($request, $validated) {
            // Buat data acara dasar tanpa array variants
            $acaraData = collect($validated)->except('variants', 'users')->toArray();
            $acaraModel = $request->user()->acaras()->create($acaraData);

            // Simpan varian tiket jika fitur tiket aktif
            if ($validated['accept_tiket'] && !empty($validated['variants'])) {
                $acaraModel->variants()->createMany($validated['variants']);
            }

            // 🌟 KRUSIAL: Kembalikan objek model agar bisa dipakai di luar closure transaction
            return $acaraModel;
        });

        // 2. Ambil array 'users' dari request frontend (jika kosong, default [])
        $userIds = $request->input('users', []);

        // 3. Amankan pivot menggunakan method secure milik Anda 🌟
        $acara->syncUsersSecure($userIds);

        return redirect()->route('acara.index')->with('success', 'Event/Acara baru berhasil diterbitkan.');
    }

    public function edit(Acara $acara)
    {
        $users = User::whereNotIn('id', [1, 2])->select('id', 'name')->orderBy('name')->get();
        $attachedUsers = $acara->users()->pluck('users.id')->toArray();

        $acara->tgl_mulai = $acara->tgl_mulai ? Carbon::parse($acara->tgl_mulai)->format('Y-m-d\TH:i') : '';
        $acara->tgl_selesai = $acara->tgl_selesai ? Carbon::parse($acara->tgl_selesai)->format('Y-m-d\TH:i') : '';
        $acara->batas_registrasi = $acara->batas_registrasi ? Carbon::parse($acara->batas_registrasi)->format('Y-m-d\TH:i') : '';
        
        $acara->load('variants'); // 👈 Pastikan varian ter-load saat masuk halaman edit admin

        return Inertia::render('Admin/Acara/Edit', [
            'acara' => $acara,
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
            ],
            'users' => $users,
            'attachedUsers' => $attachedUsers            
        ]);
    }

    public function update(Request $request, Acara $acara)
    {
        $acara = Acara::findOrFail($acara->id);
        $validated = $request->validate([
            'judul'             => 'required|string|max:255',
            'slug'              => 'required|string|unique:acaras,slug,' . $acara->id,
            'lokasi'            => 'required|string',
            'body'              => 'required|string', 
            'kategori'          => 'required|string',
            'subkategori'       => 'required|string',
            'accept_tiket'      => 'required|boolean',
            'kuota_tiket'       => 'required|integer|min:0', // hapus harga_tiket
            'accept_donasi'     => 'required|boolean',
            'target_donasi'     => 'required|numeric|min:0',
            'panduan_acara'     => 'nullable|string',
            'tgl_mulai'         => 'nullable|date',
            'tgl_selesai'       => 'nullable|date',
            'batas_registrasi'  => 'nullable|date',
            'is_published'     => 'boolean',
            
            // Aturan Validasi Varian Baru pada Update
            'variants' => 'required_if:accept_tiket,true|array',
            'variants.*.nama_varian' => 'required|string|max:100',
            'variants.*.harga' => 'required|numeric|min:0',
            'variants.*.jumlah_kursi' => 'required|integer|min:1',

            'users' => 'nullable|array', // Validasi array user
            'users.*' => 'exists:users,id',
        ]);

        if ($request->tgl_mulai) {
            $validated['tgl_mulai'] = Carbon::parse($request->tgl_mulai, 'Asia/Jakarta')->toDateTimeString();
        }
        if ($request->tgl_selesai) {
            $validated['tgl_selesai'] = Carbon::parse($request->tgl_selesai, 'Asia/Jakarta')->toDateTimeString();
        }
        if ($request->batas_registrasi) {
            $validated['batas_registrasi'] = Carbon::parse($request->batas_registrasi, 'Asia/Jakarta')->toDateTimeString();
        }

        DB::transaction(function () use ($acara, $validated) {
            $acaraData = collect($validated)->except('variants')->toArray();
            $acara->update($acaraData);

            // Perbarui data varian: hapus yang lama dan insert yang baru
            if ($validated['accept_tiket']) {
                $acara->variants()->delete();
                $acara->variants()->createMany($validated['variants']);
            } else {
                $acara->variants()->delete();
            }
        });

        // 2. Tangkap kiriman array 'users' dari form frontend, jika tidak dicentang sama sekali default ke []
        $userIds = $request->input('users', []);

        // 3. Ganti fungsi ->users()->sync() bawaan menjadi fungsi secure buatan Anda 🌟
        $acara->syncUsersSecure($userIds);       

        return redirect()->route('acara.index')->with('success', 'Acara berhasil diperbarui.');
    }    

    public function progress(Acara $acara)
    {
        return Inertia::render('Admin/Acara/Progress', [
            'acara' => $acara,
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
                ['title' => 'Update Progress', 'href' => "/admin/acara/{$acara->slug}/progress"],
            ],
        ]);
    }

    public function updateProgress(Request $request, Acara $acara)
    {
        $request->validate([
            'progress' => 'required|string'
        ]);

        $acara->update([
            'progress' => $request->input('progress')
        ]);

        return back()->with('success', 'Maklumat progress jalannya acara berhasil diperbarui.');
    }  

    public function reaksi(Acara $acara)
    {
        $summaryReaksi = $acara->reaksis()
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->pluck('total', 'type')
            ->toArray();

        $stats = array_merge(['love' => 0, 'like' => 0, 'pray' => 0, 'sad' => 0], $summaryReaksi);
        $logs = $acara->reaksis()->with('user:id,name')->latest()->paginate(20);

        return Inertia::render('Admin/Acara/Reaksi', [
            'acara' => $acara,
            'statReaksi' => $stats, 
            'reaksis' => $logs,
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
                ['title' => 'Reaksi', 'href' => "/admin/acara/{$acara->slug}/reaksi"],
            ],
        ]);
    }

    public function komentar(Acara $acara, Request $request)
    {
        $paymentsNotes = $acara->payments()
            ->whereIn('mutation_type', ['tiket', 'sponsor'])
            ->whereNotNull('notes')
            ->where('notes', '!=', '-')
            ->latest()
            ->paginate(15, ['*'], 'page_notes')
            ->withQueryString();

        $komentarsPublik = $acara->komentars()
            ->with('user:id,name')
            ->latest()
            ->paginate(15, ['*'], 'page_komentar')
            ->withQueryString();

        return Inertia::render('Admin/Acara/Komentar', [
            'acara' => $acara,
            'paymentsNotes' => $paymentsNotes,
            'komentarsPublik' => $komentarsPublik, 
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
                ['title' => 'Komentar & Catatan', 'href' => "/admin/acara/{$acara->slug}/komentar"],
            ],
            'currentTab' => $request->input('tab', 'catatan_transaksi') 
        ]);
    }

    /**
     * TAMPILAN: Ledger Buku Kas / Laporan Keuangan Acara (Admin)
     */
    public function keuangan(Acara $acara, Request $request)
    {
        // 1. Ambil Summary Akumulasi Sesuai Kategori Komponen Baru
        $summary = [
            'total_tiket' => (int) $acara->payments()->where('mutation_type', 'tiket')->where('status', 'success')->sum('nominal'),
            'total_infaq' => (int) $acara->payments()->where('mutation_type', 'infaq_sistem')->where('status', 'success')->sum('nominal'),
            'total_sponsor' => (int) $acara->payments()->where('mutation_type', 'sponsor')->where('status', 'success')->sum('nominal'),
            'total_pengeluaran' => (int) $acara->payments()->where('mutation_type', 'tasyaruf')->where('status', 'success')->sum('nominal'),
        ];

        // 2. Siapkan query mutasi ledger keuangan
        $query = $acara->payments()->latest();

        // 3. Filter Alokasi berdasarkan data kiriman frontend Vue
        if ($request->filled('type')) {
            $query->where('mutation_type', $request->type);
        }

        // 4. Paginate agar sinkron dengan interface komponen table pagination Vue Anda
        $payments = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Acara/Keuangan', [
            'acara' => [
                'id' => $acara->id,
                'judul' => $acara->judul,
                'slug' => $acara->slug,
                'saldo' => (int) $acara->saldo_donasi // Kolom dinamis total keuangan sisa kas
            ],
            'payments' => $payments,
            'summary' => $summary,
            'filters' => $request->only(['type']),
            'errors' => (object) [],
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
                ['title' => 'Buku Kas Keuangan', 'href' => "/admin/acara/{$acara->slug}/keuangan"],
            ],
        ]);
    }

    /**
     * PROSES: Input Massal/Bulk Jurnal Pembayaran Tunai Keuangan Acara
     */
    public function bulkKeuangan(Request $request, Acara $acara)
    {
        $request->validate([
            'transactions' => 'required|array|min:1|max:10',
            'transactions.*.atas_nama' => 'required_without:transactions.*.is_anonymous|nullable|string|max:255',
            'transactions.*.nominal' => 'required|string',
            'transactions.*.infaq_sistem' => 'required|string',
            'transactions.*.mutation_type' => 'required|string|in:tiket,sponsor',
            'transactions.*.via' => 'required|string',
            'transactions.*.date' => 'required|date',
            'transactions.*.notes' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();
            $lockedAcara = Acara::where('id', $acara->id)->lockForUpdate()->first();

            foreach ($request->transactions as $row) {
                $nominal = (int) str_replace('.', '', $row['nominal']);
                $infaq = (int) str_replace('.', '', $row['infaq_sistem']);
                $isAnonymous = filter_var($row['is_anonymous'] ?? false, FILTER_VALIDATE_BOOLEAN);
                $namaEntitas = $isAnonymous ? 'Hamba Allah' : $row['atas_nama'];

                // Input Hasil Pokok (Tiket / Sponsor)
                if ($nominal > 0) {
                    $kreditAkun = $row['mutation_type'] === 'tiket' ? 'NR-DB TIKET ACARA' : 'NR-DB SPONSOR ACARA';
                    
                    $lockedAcara->payments()->create([
                        'nominal' => $nominal,
                        'nominal_plus' => $nominal,
                        'debit_akun' => 'NR-DB CASH/BANK (' . $row['via'] . ')',
                        'kredit_akun' => $kreditAkun,
                        'mutation_type' => $row['mutation_type'],
                        'no_wa' => $row['no_wa'] ?? null,
                        'sapaan' => $row['sapaan'] ?? 'Sdr/i',
                        'atas_nama' => $namaEntitas,
                        'notes' => '[Bulk Manual] ' . ($row['notes'] ?? '-'),
                        'payment_method' => 'CASH',
                        'rekening' => $row['via'],
                        'date' => $row['date'],
                        'status' => 'success', // Entri manual kas langsung diset sukses
                        'user_id' => auth()->id(),
                        'jumlah_tiket' => $row['mutation_type'] === 'tiket' ? 1 : 0
                    ]);

                    // Update sisa saldo kas utama di tabel acara
                    $lockedAcara->increment('saldo_donasi', $nominal);
                    if ($row['mutation_type'] === 'tiket') {
                        // Ubah dari angka statis 1 menjadi dinamis mengikuti isi transaksi baris data
                        $inputKursi = isset($row['jumlah_tiket']) ? (int)$row['jumlah_tiket'] : 1;
                        $lockedAcara->increment('tiket_terjual', $inputKursi);
                    }
                }

                // Input Infaq Tambahan
                if ($infaq > 0) {
                    $lockedAcara->payments()->create([
                        'nominal' => $infaq,
                        'nominal_plus' => $infaq,
                        'debit_akun' => 'NR-DB CASH/BANK (' . $row['via'] . ')',
                        'kredit_akun' => 'NR-DB INFAQ SISTEM',
                        'mutation_type' => 'infaq_sistem',
                        'no_wa' => $row['no_wa'] ?? null,
                        'sapaan' => $row['sapaan'] ?? 'Sdr/i',
                        'atas_nama' => $namaEntitas,
                        'notes' => '[Bulk Infaq Sistem]',
                        'payment_method' => 'CASH',
                        'rekening' => $row['via'],
                        'date' => $row['date'],
                        'status' => 'success',
                        'user_id' => auth()->id(),
                        'jumlah_tiket' => 0
                    ]);

                    $lockedAcara->increment('saldo_donasi', $infaq);
                }
            }

            DB::commit();
            return back()->with('success', 'Gabungan data kas transaksi massal berhasil dicatat.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['bulk_error' => 'Gagal menyimpan transaksi: ' . $e->getMessage()]);
        }
    }

    /**
     * PROSES: Input Jurnal Pengeluaran Kas / Tasyaruf Acara (Admin)
     */
    public function storeTasyaruf(Request $request, Acara $acara)
    {
        if ($request->has('nominal')) {
            $request->merge([
                'nominal' => str_replace('.', '', $request->nominal),
            ]);
        }

        $request->validate([
            'date'      => 'required|date',
            'atas_nama' => 'required|string|max:255',
            'nominal'   => 'required|numeric|min:1',
            'via'       => 'required|string|max:50',
            'notes'     => 'nullable|string|max:1000',
        ]);

        $nominalKeluar = (int) $request->nominal;

        if ($acara->saldo_donasi < $nominalKeluar) {
            return back()->withErrors(['bulk_error' => 'Gagal! Saldo kas tidak mencukupi.']);
        }

        try {
            DB::beginTransaction();

            $acara->payments()->create([
                'nominal'         => $nominalKeluar,
                'nominal_mins'    => $nominalKeluar,
                'debit_akun'      => 'NR-DB BIAYA OPERASIONAL ACARA',
                'kredit_akun'     => 'NR-DB CASH/BANK (' . $request->via . ')',
                'mutation_type'   => 'tasyaruf',
                'sapaan'          => 'Pihak',
                'atas_nama'       => $request->atas_nama,
                'notes'           => '[Pengeluaran] ' . ($request->notes ?? '-'),
                'payment_method'  => 'CASH',
                'rekening'        => $request->via,
                'date'            => $request->date,
                'status'          => 'success',
                'user_id'         => auth()->id(),
            ]);

            $acara->decrement('saldo_donasi', $nominalKeluar);

            DB::commit();
            return back()->with('success', 'Pengeluaran kas berhasil dicatat.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['bulk_error' => $e->getMessage()]);
        }
    }   

    public function show(Acara $acara)
    {
        if (!$acara->is_published) {
            return redirect()->route('acara')->with('error', 'Acara ini belum diterbitkan atau tidak tersedia untuk publik.');
        }

        $cleanDescription = Str::limit(strip_tags($acara->body), 150, '...');
        $imageUrl = $acara->thumbnail ? $acara->thumbnail : asset('favicon.png');

        $acara->loadSum(['payments as total_donasi_masuk' => function ($q) {
            $q->whereIn('mutation_type', ['tiket', 'sponsor'])->where('status', 'success');
        }], 'nominal');

        $acara->load([
            'user:id,name,slug', 
            'users',
            'variants',
            'komentars' => function($q) { 
                $q->with('user:id,name')->latest(); 
            },
            'reaksis',
            'payments' => function($q) {
                $q->whereIn('mutation_type', ['tiket', 'infaq_sistem', 'sponsor', 'tasyaruf'])->latest();
            }
        ]);

        return Inertia::render('AcaraShow', [
            'acara' => $acara,
            'meta' => [
                'title' => $acara->judul,
                'description' => $cleanDescription,
                'image' => $imageUrl,
                'url' => request()->fullUrl(),
            ]
        ]);
    }

// Contoh untuk Acara (Terapkan pola yang sama persis untuk Kalam dan Acara, cukup sesuaikan parameter modelnya)
    public function storeKomentar(Request $request, Acara $acara)
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

        $acara->komentars()->save($komentar);

        return back()->with('success', 'Komentar Anda berhasil diterbitkan.');
    }

    public function storeReaksi(Request $request, Acara $acara)
    {
        $request->validate(['type' => 'required|string|in:takjub,suka,penuh_doa,tidak_hadir']);
        $type = $request->input('type');
        $ipAddress = $request->ip();
        $userId = auth()->id();

        $existingReaction = $acara->reaksis()->where(function ($query) use ($userId, $ipAddress) {
                if ($userId) { $query->where('user_id', $userId); } 
                else { $query->where('ip_address', $ipAddress)->whereNull('user_id'); }
            })->first();

        if ($existingReaction) {
            if ($existingReaction->type === $type) { $existingReaction->delete(); } 
            else { $existingReaction->update(['type' => $type, 'ip_address' => $ipAddress]); }
        } else {
            $acara->reaksis()->save(new Reaksi(['type' => $type, 'ip_address' => $ipAddress, 'user_id' => $userId]));
        }
        return back();
    }   

    public function destroy(Acara $acara)
    {
        $acara->delete();
        return back()->with('success', 'Acara berhasil dihapus.');
    }

    public function payment(Acara $acara, Request $request)
    {
        $acara->load('variants'); // 👈 Kirim daftar varian tiket ke view checkout

        return Inertia::render('AcaraPayment', [
            'acara' => $acara,
            'buyType' => $request->input('buy_type', 'tiket') 
        ]);
    }

    /**
     * Store Payment Publik (Melalui form Gate)
     */
    public function storePayment(Request $request, Acara $acara)
    {
        if ($request->has('nominal')) {
            $request->merge([
                'nominal' => str_replace('.', '', $request->nominal),
                'infaq_sistem' => str_replace('.', '', $request->infaq_sistem),
            ]);
        }

        $request->validate([
            'buy_type' => 'required|string|in:tiket,donasi',
            'acara_variant_id' => 'required_if:buy_type,tiket|nullable|exists:acara_variants,id', // 👈 Validasi varian id pilihan
            'nominal' => 'required|numeric|min:0',
            'infaq_sistem' => 'required|numeric|min:0',
            'no_wa' => 'required|string', 
            'sapaan' => 'required|string',
            'atas_nama' => $request->is_anonymous ? 'nullable' : 'required|string|max:255', 
            'is_anonymous' => 'nullable',
            'notes' => 'nullable|string',
            'payment_method' => 'required|string',
            'rekening' => 'required|string',
            'bukti_acara' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4192' 
        ]);

        try {
            DB::beginTransaction();

            $lockedAcara = Acara::where('id', $acara->id)->lockForUpdate()->first();
            
            // Default awal multiplier kapasitas kursi terpotong
            $kursiYangDibeli = 0; 
            $namaVarianTerpilih = '';

            if ($request->buy_type === 'tiket' && $lockedAcara->accept_tiket) {
                // Cari data varian dari database backend untuk menghindari manipulasi request harga/kursi
                $variant = \App\Models\AcaraVariant::where('acara_id', $lockedAcara->id)
                    ->where('id', $request->acara_variant_id)
                    ->firstOrFail();

                $kursiYangDibeli = $variant->jumlah_kursi;
                $namaVarianTerpilih = $variant->nama_varian;

                // Cek ketersediaan kuota keseluruhan di lokasi
                if (($lockedAcara->tiket_terjual + $kursiYangDibeli) > $lockedAcara->kuota_tiket) {
                    throw new \Exception('Maaf, sisa kuota kursi tidak mencukupi untuk jenis paket tiket pilihan Anda.');
                }

                // Bandingkan nominal kiriman dengan database asli
                if ((int) $request->nominal !== (int) $variant->harga) {
                    throw new \Exception('Terjadi ketidakcocokan nilai kalkulasi skema harga tiket varian.');
                }
            }

            $isAnonymous = filter_var($request->is_anonymous, FILTER_VALIDATE_BOOLEAN);
            $imagePath = $request->hasFile('bukti_acara') 
                ? $request->file('bukti_acara')->store('bukti-transfer', 'public') 
                : null;

            $namaDonatur = $isAnonymous && $request->buy_type === 'donasi' ? 'Hamba Allah' : $request->atas_nama;

            // 1. Log Jurnal Infaq Sistem (Kode tetap sama)
            if ((int) $request->infaq_sistem > 0) {
                $lockedAcara->payments()->create([
                    'nominal' => $request->infaq_sistem,
                    'nominal_plus' => $request->infaq_sistem,
                    'debit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')',
                    'kredit_akun' => 'NR-DB INFAQ SISTEM', 
                    'mutation_type' => 'infaq_sistem',
                    'no_wa' => $request->no_wa,
                    'sapaan' => $request->sapaan,
                    'atas_nama' => $namaDonatur,
                    'notes' => 'Infaq Sistem: ' . ($request->notes ?? '-'),
                    'payment_method' => $request->payment_method,
                    'rekening' => $request->rekening,
                    'date' => now(),
                    'user_id' => auth()->id(),
                    'image' => $imagePath,
                    'status' => 'pending',
                    'jumlah_tiket' => 0
                ]);
            }

            // 2. Log Jurnal Arus Utama (Simpan referensi nama varian ke notes & isi kapasitas jumlah_tiket secara akurat)
            $mType = $request->buy_type === 'tiket' ? 'tiket' : 'sponsor';
            $kreditAkun = $request->buy_type === 'tiket' ? 'NR-DB TIKET ACARA' : 'NR-DB SPONSOR ACARA';
            $prefixNotes = $request->buy_type === 'tiket' ? "[Paket: {$namaVarianTerpilih} - {$kursiYangDibeli} Kursi] " : "";

            $lockedAcara->payments()->create([
                'nominal' => $request->nominal,
                'nominal_plus' => $request->nominal,
                'debit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')',
                'kredit_akun' => $kreditAkun, 
                'mutation_type' => $mType,
                'no_wa' => $request->no_wa,
                'sapaan' => $request->sapaan,
                'atas_nama' => $namaDonatur,
                'notes' => $prefixNotes . ($request->notes ?? '-'),
                'payment_method' => $request->payment_method,
                'rekening' => $request->rekening,
                'date' => now(),
                'user_id' => auth()->id(),
                'image' => $imagePath,
                'status' => 'pending',
                'jumlah_tiket' => $kursiYangDibeli // 👈 Otomatis menyimpan 1, 2 atau 4 sesuai kapasitas paket!
            ]);

            // Jika tiket, asumsikan penambahan langsung kuota booking terjual
            if ($request->buy_type === 'tiket') {
                $lockedAcara->increment('tiket_terjual', $kursiYangDibeli);
            }

            DB::commit();

            if ($request->buy_type === 'tiket') {
                return redirect()->route('acara.show', [$lockedAcara->slug,  'tab' => 'pendaftaran'])
                                 ->with('success', 'Registrasi berhasil dikirim. Mohon tunggu verifikasi admin.');
            } else {
                return redirect()->route('acara.show', [$lockedAcara->slug,  'tab' => 'donatur'])
                                 ->with('success', 'Donasi Anda berhasil dikirim. Terima kasih atas dukungan Anda!');
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }    
}