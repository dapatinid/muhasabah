<?php

namespace App\Http\Controllers;

use App\Models\Donasi;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DonasiController extends Controller
{
    /**
     * Halaman List Donasi untuk Publik
     */
    public function donasi(Request $request)
    {
        $query = Donasi::where('is_published', true);

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
            'donasis' => $query->latest()->paginate(9)->withQueryString(),
            'filters' => $request->only(['search', 'kategori']) // Tambahkan kategori di sini
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
            }]);

        if ($search = $request->input('search')) {
            $query->where('judul', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%")
                  ->orWhere('subkategori', 'like', "%{$search}%");
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
            'body' => 'required|string',
            'kategori' => 'required|string',
            'subkategori' => 'required|string',
            'target_dana' => 'required|numeric|min:0',
        ]);

        // Pastikan relasi donasis() sudah ada di model User
        $request->user()->donasis()->create($validated);

        return redirect()->route('donasi.index')->with('success', 'Program donasi berhasil diterbitkan.');
    }

    public function edit(Donasi $donasi)
    {
        return Inertia::render('Admin/Donasi/Edit', [
            'donasi' => $donasi,
            'breadcrumbs' => [
                ['title' => 'Donasi', 'href' => '/admin/donasi'],
                ['title' => 'Edit Donasi', 'href' => "/admin/donasi/{$donasi->slug}/edit"],
            ],
        ]);
    }

    public function update(Request $request, Donasi $donasi)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'body' => 'required|string',
            'kategori' => 'required|string',
            'subkategori' => 'required|string',
            'target_dana' => 'required|numeric|min:0',
            'is_published' => 'boolean'
        ]);

        $donasi->update($validated);

        return redirect()->route('donasi.index')->with('success', 'Data donasi berhasil diperbarui.');
    }

    /**
     * Detail Donasi (Publik/Admin)
     */
    public function show(Donasi $donasi)
    {
        return Inertia::render('DonasiShow', [
            'donasi' => $donasi->load(['user:id,name', 'payments' => function($q) {
                $q->where('mutation_type', 'donasi_utama')->latest()->limit(20);
            }]),
        ]);
    }

    public function destroy(Donasi $donasi)
    {
        $donasi->delete();
        return back()->with('success', 'Program donasi berhasil dihapus.');
    }

    public function uploadImage(Request $request)
    {
        $request->validate(['image' => 'required|image|max:2048']);
        
        $path = $request->file('image')->store('donasi-images', 'public');
        $url = asset('storage/' . $path);

        return back()->with('uploaded_image_url', $url);
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
            'atas_nama' => $request->is_anonymous ? 'nullable' : 'required|string', // Atas nama wajib jika tidak anonim
            'notes' => 'nullable|string',
            'payment_method' => 'required|string',
            'rekening' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $isAnonymous = filter_var($request->is_anonymous, FILTER_VALIDATE_BOOLEAN);

            $infaq = new Payment([
                        'nominal' => $request->infaq_sistem,
                        'nominal_plus' => $request->infaq_sistem,
                        'debit_akun' => 'NR-DB CASH/BANK (' . $request->rekening . ')', 
                        'kredit_akun' => 'NR-DB INFAQ SISTEM', 
                        'mutation_type' => 'infaq_sistem',
                        'no_wa' => $request->no_wa,
                        'sapaan' => $request->sapaan,
                        'atas_nama' => $isAnonymous ? 'Hamba Allah' : $request->atas_nama,
                        'notes' => 'Infaq Pemeliharaan Sistem: ' . ($request->notes ?? '-'),
                        'payment_method' => $request->payment_method,
                        'rekening' => $request->rekening,
                        'date' => now(),
                        'user_id' => auth()->id(),
                        'is_anonymous' => $isAnonymous,
                    ]);
            $donasi->payments()->save($infaq);


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
            ]);
            $donasi->payments()->save($donasiUtama);

            // 3. Update Saldo (Hanya nominal donasi utama, infaq tidak masuk ke saldo program)
            $donasi->increment('saldo', $request->nominal);

            DB::commit();

            return redirect()->route('donasi.show', $donasi->slug)->with('success', 'Terima kasih atas donasi Anda! Pembayaran sedang diproses.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Terjadi kesalahan: ' . $e->getMessage()]);
        }
    }
}