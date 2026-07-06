<?php

namespace App\Http\Controllers;

use App\Models\Kalam;
use App\Models\Komentar;
use App\Models\Reaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KalamController extends Controller
{
    /**
     * Halaman List Kalam untuk Publik
     */
    public function kalam(Request $request)
    {
        $query = Kalam::where('is_published', true)->with(['user:id,name','users'])->withCount(['komentars', 'reaksis']);

        if ($search = $request->input('search')) {
            $query->where('judul', 'like', "%{$search}%")
                ->orWhere('kategori', 'like', "%{$search}%");
        }

        if ($kategori = $request->input('kategori')) {
            $query->where('kategori', $kategori);
        }

        $kalams = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Kalam', [
            'kalams' => $kalams,
            'filters' => $request->only(['search', 'kategori']),
        ]);
    }

    /**
     * Halaman Management Kalam untuk Admin
     */
    public function index(Request $request)
    {
        $query = Kalam::with('user:id,name');

        if ($search = $request->input('search')) {
            $query->where('judul', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%");
        }

        $kalams = $query->latest()
                        ->paginate(10)
                        ->withQueryString();

        return Inertia::render('Admin/Kalam/Index', [
            'kalams' => $kalams,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Kalam/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'body' => 'required|string',
            'kategori' => 'required|string',
            'is_anonymous' => 'boolean',
        ]);

        // 1. Buat data Kalam baru terlebih dahulu
        $kalam = $request->user()->kalams()->create($validated);

        // 2. Ambil array 'users' dari request frontend (jika tidak ada, default array kosong [])
        $userIds = $request->input('users', []);

        // 3. Amankan pivot menggunakan method secure Anda
        $kalam->syncUsersSecure($userIds);

        return redirect('/admin/kalam')->with('success', 'Kalam berhasil diterbitkan.');
    }

    public function edit(Kalam $kalam)
    {
        $users = User::whereNotIn('id', [1, 2])->select('id', 'name', 'slug')->orderBy('name')->get();
        $attachedUsers = $kalam->users()->pluck('users.id')->toArray();

        return Inertia::render('Admin/Kalam/Edit', [
            'kalam' => $kalam,
            'breadcrumbs' => [
                ['title' => 'Kalam', 'href' => '/admin/kalam'],
                ['title' => 'Edit Kalam', 'href' => "/admin/kalam/{$kalam->slug}/edit"],
            ],
            'users' => $users,
            'attachedUsers' => $attachedUsers            
        ]);
    }

    public function update(Request $request, Kalam $kalam)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:kalams,slug,' . $kalam->id,
            'body' => 'required|string',
            'kategori' => 'required|string',
            'is_anonymous' => 'boolean',
            'is_published' => 'boolean',
            'users' => 'nullable|array', // Validasi array user
            'users.*' => 'exists:users,id',
        ]);

        // 1. Update data Kalam utama
        $kalam->update($validated);

        // 2. Tangkap kiriman array 'users' dari form frontend, jika tidak dicentang sama sekali default ke []
        $userIds = $request->input('users', []);

        // 3. Ganti fungsi ->users()->sync() bawaan menjadi fungsi secure buatan Anda 🌟
        $kalam->syncUsersSecure($userIds);     

        return redirect()->route('kalam.index')->with('success', 'Kalam berhasil diperbarui.');
    }


    /**
     * Halaman Manajemen Reaksi / Emoticon Program Kalam
     */
    public function reaksi(Kalam $kalam)
    {
        // 1. Ambil summary/total per tipe reaksi (Grup data)
        $summaryReaksi = $kalam->reaksis()
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->pluck('total', 'type') // Menghasilkan format: ['love' => 12, 'pray' => 45]
            ->toArray();

        // Pastikan semua tipe default terisi minimal 0 agar frontend tidak error
        $tipeDefault = ['barakallah' => 0, 'masya_allah' => 0, 'subhanallah' => 0, 'aamiin' => 0];
        $stats = array_merge($tipeDefault, $summaryReaksi);

        // 2. Ambil list log riwayat reaksi terbaru
        $logs = $kalam->reaksis()
            ->with('user:id,name') // Sertakan info user jika donatur login saat klik
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Kalam/Reaksi', [
            'kalam' => $kalam,
            'stats' => $stats,
            'reaksis' => $logs,
            'breadcrumbs' => [
                ['title' => 'Kalam', 'href' => '/admin/kalam'],
                ['title' => 'Edit Kalam', 'href' => "/admin/kalam/{$kalam->slug}/edit"],
                ['title' => 'Reaksi', 'href' => "/admin/kalam/{$kalam->slug}/reaksi"],
            ],
        ]);
    }

    /**
     * Halaman Manajemen Komentar dan Doa Donatur
     */
    public function komentar(Kalam $kalam, Request $request)
    {
        // Asumsi nama relasi di model Kalam adalah 'komentars'
        $komentarsPublik = $kalam->komentars()
            ->latest()
            ->paginate(15, ['*'], 'page_komentar') // parameter halaman unik
            ->withQueryString();

        return Inertia::render('Admin/Kalam/Komentar', [
            'kalam' => $kalam,
            'komentarsPublik' => $komentarsPublik,
            'breadcrumbs' => [
                ['title' => 'Kalam', 'href' => '/admin/kalam'],
                ['title' => 'Edit Kalam', 'href' => "/admin/kalam/{$kalam->slug}/edit"],
                ['title' => 'Komentar', 'href' => "/admin/kalam/{$kalam->slug}/komentar"],
            ],
        ]);
    }


    /**
     * Detail Kalam (Publik/Admin) dengan Optimasi SEO Meta & Relasi Eager Loading
     */
    public function show(Kalam $kalam)
    {
        if (!$kalam->is_published) {
            return redirect()->route('kalam')->with('error', 'Kalam ini belum diterbitkan atau tidak tersedia untuk publik.');
        }

        $kalam->load([
            'user:id,name,slug',
            'users',
            'komentars' => function ($q) {
                $q->with('user:id,name')->latest();
            },
            'reaksis',
        ]);

        // Bersihkan isi tulisan dari kode HTML untuk deskripsi pratinjau WA
        $cleanDescription = Str::limit(strip_tags($kalam->body), 150, '...');

        // Ambil URL thumbnail jika tersedia, gunakan default jika kosong
        $imageUrl = $kalam->thumbnail ? $kalam->thumbnail : asset('favicon.png');

        return Inertia::render('KalamShow', [
            'kalam' => $kalam,
            'meta' => [
                'title' => $kalam->judul,
                'description' => $cleanDescription,
                'image' => $imageUrl,
                'url' => request()->fullUrl(),
            ]
        ]);
    }  

    // Contoh untuk Kalam (Terapkan pola yang sama persis untuk Kalam dan Acara, cukup sesuaikan parameter modelnya)
    public function storeKomentar(Request $request, Kalam $kalam)
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

        $kalam->komentars()->save($komentar);

        return back()->with('success', 'Komentar Anda berhasil diterbitkan.');
    }

    /**
     * Menyimpan, Mengubah, atau Membatalkan Reaksi Publik di Artikel Kalam
     */
    public function storeReaksi(Request $request, Kalam $kalam)
    {
        $request->validate([
            'type' => 'required|string|in:barakallah,masya_allah,subhanallah,aamiin',
        ]);

        $type = $request->input('type');
        $ipAddress = $request->ip();
        $userId = auth()->id(); 

        // Cari apakah pengguna (via User ID atau IP jika anonim) sudah memberikan reaksi pada artikel ini
        $existingReaction = $kalam->reaksis()
            ->where(function ($query) use ($userId, $ipAddress) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('ip_address', $ipAddress)->whereNull('user_id');
                }
            })
            ->first();

        if ($existingReaction) {
            if ($existingReaction->type === $type) {
                // Jika jenis emoji sama -> Hapus reaksi (Toggle Off)
                $existingReaction->delete();
            } else {
                // Jika jenis emoji berbeda -> Perbarui reaksi (Ganti Pilihan)
                $existingReaction->update([
                    'type' => $type,
                    'ip_address' => $ipAddress
                ]);
            }
        } else {
            // Belum bereaksi -> Buat catatan baru
            $reaksi = new Reaksi([
                'type' => $type,
                'ip_address' => $ipAddress,
                'user_id' => $userId,
            ]);
            $kalam->reaksis()->save($reaksi);
        }

        return back();
    }

    public function destroy(Kalam $kalam)
    {
        if ($kalam->user_id !== auth()->id()) abort(403);
        
        $kalam->delete();
        return back()->with('success', 'Kalam berhasil dihapus.');
    }

    public function uploadImage(Request $request)
    {
        $request->validate(['image' => 'required|image|max:2048']);
        
        $path = $request->file('image')->store('kalam-images', 'public');
        $url = asset('storage/' . $path);

        return back()->with('uploaded_image_url', $url);
    }
}