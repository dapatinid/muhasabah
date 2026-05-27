<?php

namespace App\Http\Controllers;

use App\Models\Acara;
use App\Models\Komentar;
use App\Models\Payment;
use App\Models\Reaksi;
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
            // tiket_terjual sudah ada sebagai kolom di tabel (di-increment saat storePayment)
            // sehingga tidak perlu withCount/withSum lagi untuk tiket.
            // Hanya butuh donasi_masuk_sum_nominal untuk progress bar donasi di card.
            ->withSum(['payments as donasi_masuk_sum_nominal' => function ($q) {
                $q->where('mutation_type', 'donasi_acara')->where('status', 'success');
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
                $query->where('mutation_type', 'tiket_utama')->where('status', 'success');
            }])
            ->withSum(['payments as total_donasi_masuk' => function ($query) {
                $query->where('mutation_type', 'donasi_acara')->where('status', 'success');
            }], 'nominal')
            ->withSum(['payments as total_pengeluaran' => function ($query) {
                $query->where('mutation_type', 'tasyaruf_acara');
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
            'panduan_acara' => 'required|string|max:1000',
            'body' => 'required|string',
            'kategori' => 'required|string',
            'subkategori' => 'required|string',
            'lokasi' => 'required|string|max:255',
            'accept_tiket' => 'required|boolean',
            'accept_donasi' => 'required|boolean',
            'harga_tiket' => 'required_if:accept_tiket,true|numeric|min:0',
            'kuota_tiket' => 'required_if:accept_tiket,true|integer|min:0',
            'target_donasi' => 'required_if:accept_donasi,true|numeric|min:0',
            'tgl_mulai' => 'nullable|date',
            'tgl_selesai' => 'nullable|date|after_or_equal:tgl_mulai',
            'batas_registrasi' => 'nullable|date|before_or_equal:tgl_mulai',
        ]);

        $request->user()->acaras()->create($validated);

        return redirect()->route('acara.index')->with('success', 'Event/Acara baru berhasil diterbitkan.');
    }

    public function edit(Acara $acara)
    {
        $acara->tgl_mulai = $acara->tgl_mulai ? \Carbon\Carbon::parse($acara->tgl_mulai)->format('Y-m-d\TH:i') : '';
        $acara->tgl_selesai = $acara->tgl_selesai ? \Carbon\Carbon::parse($acara->tgl_selesai)->format('Y-m-d\TH:i') : '';
        $acara->batas_registrasi = $acara->batas_registrasi ? \Carbon\Carbon::parse($acara->batas_registrasi)->format('Y-m-d\TH:i') : '';

        return Inertia::render('Admin/Acara/Edit', [
            'acara' => $acara,
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
            ],
        ]);
    }

   public function update(Request $request, Acara $acara)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'tgl_mulai' => 'nullable',
            'tgl_selesai' => 'nullable',
            'batas_registrasi' => 'nullable',
            // validasi field lainnya...
        ]);

        // Paksa Carbon membaca input mentah dari browser sebagai timezone lokal Anda (tanpa konversi)
        if ($request->tgl_mulai) {
            $validated['tgl_mulai'] = Carbon::parse($request->tgl_mulai, 'Asia/Jakarta')->toDateTimeString();
        }
        if ($request->tgl_selesai) {
            $validated['tgl_selesai'] = Carbon::parse($request->tgl_selesai, 'Asia/Jakarta')->toDateTimeString();
        }
        if ($request->batas_registrasi) {
            $validated['batas_registrasi'] = Carbon::parse($request->batas_registrasi, 'Asia/Jakarta')->toDateTimeString();
        }

        $acara->update($validated);

        return redirect()->back()->with('success', 'Acara berhasil diperbarui.');
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
        $request->validate(['progress' => 'nullable|string']);
        $acara->progress = $request->input('progress');
        $acara->save();

        return back()->with('success', 'Progress jalannya acara berhasil diperbarui.');
    }  

    public function reaksi(Acara $acara)
    {
        $summaryReaksi = $acara->reaksis()->select('type', DB::raw('count(*) as total'))->groupBy('type')->pluck('total', 'type')->toArray();
        $stats = array_merge(['love' => 0, 'pray' => 0, 'sad' => 0, 'like' => 0], $summaryReaksi);
        $logs = $acara->reaksis()->with('user:id,name')->latest()->paginate(20);

        return Inertia::render('Admin/Acara/Reaksi', [
            'acara' => $acara,
            'stats' => $stats,
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
        $paymentsNotes = $acara->payments()->whereIn('mutation_type', ['tiket_utama', 'donasi_acara'])->whereNotNull('notes')->where('notes', '!=', '-')->latest()->paginate(15, ['*'], 'page_notes')->withQueryString();
        $komentarsPublik = $acara->komentars()->latest()->paginate(15, ['*'], 'page_komentar')->withQueryString();

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

    public function transaksiMasuk(Request $request, Acara $acara)
    {
        $query = $acara->payments()->latest();
        if ($request->filled('type')) {
            $query->where('mutation_type', $request->type);
        }

        $payments = $query->paginate(20)->withQueryString();
        $summary = [
            'total_tiket' => $acara->payments()->where('mutation_type', 'tiket_utama')->sum('nominal'),
            'total_donasi' => $acara->payments()->where('mutation_type', 'donasi_acara')->sum('nominal'),
            'total_infaq' => $acara->payments()->where('mutation_type', 'infaq_sistem')->sum('nominal'),
        ];

        return Inertia::render('Admin/Acara/TransaksiMasuk', [
            'acara' => $acara,
            'payments' => $payments,
            'summary' => $summary,
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
                ['title' => 'Transaksi Masuk', 'href' => "/admin/acara/{$acara->slug}/transaksi-masuk"],
            ],
            'filters' => $request->only(['type']) 
        ]);
    }

    public function tasyaruf(Acara $acara)
    {
        $tasyarufs = $acara->payments()->where('mutation_type', 'tasyaruf_acara')->latest()->paginate(20);

        return Inertia::render('Admin/Acara/Tasyaruf', [
            'acara' => $acara,
            'tasyarufs' => $tasyarufs,
            'breadcrumbs' => [
                ['title' => 'Acara', 'href' => '/admin/acara'],
                ['title' => 'Edit Acara', 'href' => "/admin/acara/{$acara->slug}/edit"],
                ['title' => 'Pengeluaran Acara', 'href' => "/admin/acara/{$acara->slug}/tasyaruf"],
            ],
        ]);
    }    

    public function storeTasyaruf(Request $request, Acara $acara)
    {
        if ($request->has('nominal')) {
            $request->merge(['nominal' => str_replace('.', '', $request->nominal)]);
        }

        $request->validate([
            'nominal' => 'required|numeric|min:1000',
            'notes' => 'required|string|max:500',
            'rekening' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            $lockedAcara = Acara::where('id', $acara->id)->lockForUpdate()->first();

            if ($request->nominal > $lockedAcara->saldo_donasi) {
                throw new \Exception('Nominal pengeluaran melebihi sisa saldo donasi acara.');
            }

            $tasyaruf = new Payment([
                'nominal' => $request->nominal,
                'nominal_plus' => $request->nominal,
                'debit_akun' => 'LR-KR OPERASIONAL ACARA', 
                'kredit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')', 
                'mutation_type' => 'tasyaruf_acara',
                'no_wa' => '-', 'sapaan' => '-', 'atas_nama' => 'Penyaluran Sistem',
                'notes' => $request->notes, 'payment_method' => 'transfer',
                'rekening' => $request->rekening, 'date' => now(), 'user_id' => auth()->id(), 'is_anonymous' => false,
                'jumlah_tiket' => 0
            ]);
            
            $lockedAcara->payments()->save($tasyaruf);
            $lockedAcara->decrement('saldo_donasi', $request->nominal);

            DB::commit();
            return back()->with('success', 'Pengeluaran kas acara berhasil dicatat.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mencatat pengeluaran: ' . $e->getMessage()]);
        }
    }  

    /**
     * Detail Acara Publik (FIXED DATA SEPARATE & PROGRESS BAR)
     */
    public function show(Acara $acara)
    {
        $cleanDescription = Str::limit(strip_tags($acara->body), 150, '...');
        $imageUrl = $acara->thumbnail ? $acara->thumbnail : asset('favicon.png');

        // Tambahkan kalkulasi total donasi masuk (hanya yang sudah sukses terverifikasi)
        $acara->loadSum(['payments as total_donasi_masuk' => function ($q) {
            $q->where('mutation_type', 'donasi_acara')->where('status', 'success');
        }], 'nominal');

        // Load relasi pendukung secara rapi dan pastikan 'infaq_sistem' juga ikut dimuat untuk log verifikasi frontend
        $acara->load([
            'user:id,name', 
            'komentars' => function($q) { 
                $q->with('user:id,name')->latest(); 
            },
            'reaksis',
            'payments' => function($q) {
                $q->whereIn('mutation_type', ['tiket_utama', 'donasi_acara', 'infaq_sistem', 'tasyaruf_acara'])
                  ->latest();
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

    public function storeKomentar(Request $request, Acara $acara)
    {
        $request->validate([
            'nama_publik' => 'required|string|max:50',
            'body' => 'required|string|max:1000',
            'captcha_challenge' => 'required|string',
            'captcha_answer' => 'required|integer',
        ]);

        $challenge = $request->input('captcha_challenge');
        if (strpos($challenge, '+') !== false) {
            [$num1, $num2] = explode('+', $challenge);
            if ((int)$request->input('captcha_answer') !== ((int)$num1 + (int)$num2)) {
                return back()->withErrors(['captcha_answer' => 'Kode keamanan captcha salah.']);
            }
        }

        $komentar = new Komentar([
            'body' => $request->body,
            'nama_publik' => strip_tags($request->nama_publik),
            'user_id' => auth()->check() ? auth()->id() : null,
        ]);
        $acara->komentars()->save($komentar);

        return back()->with('success', 'Komentar Anda berhasil diterbitkan.');
    }

    public function storeReaksi(Request $request, Acara $acara)
    {
        $request->validate(['type' => 'required|string|in:love,like,pray,sad']);
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
        return Inertia::render('AcaraPayment', [
            'acara' => $acara,
            'buyType' => $request->input('buy_type', 'tiket') 
        ]);
    }

    /**
     * Store Payment (FIXED JUMLAH TIKET PADA DONASI)
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
            'jumlah_tiket' => 'required_if:buy_type,tiket|integer|min:1', 
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
            
            // Jika tiket = ambil request asli, jika donasi = set 0 (bukan kuota kursi) agar tidak merusak manifest peserta utama
            $jumlahTiket = $request->buy_type === 'tiket' ? (int) $request->jumlah_tiket : 0;

            if ($request->buy_type === 'tiket' && $lockedAcara->accept_tiket) {
                if (($lockedAcara->tiket_terjual + $jumlahTiket) > $lockedAcara->kuota_tiket) {
                    throw new \Exception('Maaf, sisa kuota kursi tidak mencukupi untuk jumlah pesanan Anda.');
                }

                $expectedNominal = (int) $lockedAcara->harga_tiket * $jumlahTiket;
                if ((int) $request->nominal !== $expectedNominal) {
                    throw new \Exception('Terjadi ketidakcocokan nilai kalkulasi harga tiket.');
                }
            }

            $isAnonymous = filter_var($request->is_anonymous, FILTER_VALIDATE_BOOLEAN);
            
            $imagePath = $request->hasFile('bukti_acara') 
                ? $request->file('bukti_acara')->store('bukti-transfer', 'public') 
                : null;

            $namaDonatur = $isAnonymous && $request->buy_type === 'donasi' ? 'Hamba Allah' : $request->atas_nama;

            // Jurnal Infaq Sistem
            if ((int) $request->infaq_sistem > 0) {
                $lockedAcara->payments()->save(new Payment([
                    'nominal' => $request->infaq_sistem,
                    'nominal_plus' => $request->infaq_sistem,
                    'debit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')',
                    'kredit_akun' => 'NR-DB INFAQ SISTEM', 
                    'mutation_type' => 'infaq_sistem',
                    'no_wa' => $request->no_wa,
                    'sapaan' => $request->sapaan,
                    'atas_nama' => $namaDonatur,
                    'notes' => 'Infaq Pemeliharaan Aplikasi Event: ' . ($request->notes ?? '-'),
                    'payment_method' => $request->payment_method,
                    'rekening' => $request->rekening,
                    'date' => now(),
                    'user_id' => auth()->id(),
                    'image' => $imagePath,
                    'status' => 'pending',
                    'jumlah_tiket' => 0 // Infaq sistem tidak memakai kuota kursi
                ]));
            }

            // Jurnal Utama (Tiket VS Donasi)
            $mType = $request->buy_type === 'tiket' ? 'tiket_utama' : 'donasi_acara';
            $kreditAkun = $request->buy_type === 'tiket' ? 'NR-DB TIKET ACARA' : 'NR-DB DONASI ACARA';
            
            $prefixNotes = $request->buy_type === 'tiket' 
                ? "[Booking {$jumlahTiket} Tiket] " 
                : "[Donasi Sukarela] ";

            $lockedAcara->payments()->save(new Payment([
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
                'jumlah_tiket' => $jumlahTiket // FIXED: Menyimpan data kuantitas tiket ke tabel pivot ledger
            ]));

            if ($request->buy_type === 'tiket') {
                $lockedAcara->increment('tiket_terjual', $jumlahTiket);
            } else {
                $lockedAcara->increment('saldo_donasi', $request->nominal);
            }

            DB::commit();
            
            return redirect()->route('acara.show', [$lockedAcara->slug])
                             ->with('success', 'Registrasi dan data pembayaran berhasil disimpan. Mohon tunggu verifikasi tim admin.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }
}