<?php

namespace App\Http\Controllers;

use App\Models\Kalam;
use App\Models\Komentar;
use App\Models\Reaksi;
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
        $query = Kalam::where('is_published', true)->with('user:id,name')->withCount(['komentars', 'reaksis']);

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

        $request->user()->kalams()->create($validated);

        return redirect('/admin/kalam')->with('success', 'Kalam berhasil diterbitkan.');
    }

    public function edit(Kalam $kalam)
    {
        return Inertia::render('Admin/Kalam/Edit', [
            'kalam' => $kalam,
            'breadcrumbs' => [
                ['title' => 'Kalam', 'href' => '/admin/kalam'],
                ['title' => 'Edit Kalam', 'href' => "/admin/kalam/{$kalam->slug}/edit"],
            ],
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
        ]);

        $kalam->update($validated);

        return redirect()->route('kalam.index')->with('success', 'Kalam berhasil diperbarui.');
    }

    /**
     * Detail Kalam (Publik/Admin) dengan Optimasi SEO Meta & Relasi Eager Loading
     */
    public function show(Kalam $kalam)
    {
        $kalam->load([
            'user:id,name',
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

    /**
     * Menyimpan Komentar Publik pada Artikel Kalam dengan Proteksi Captcha
     */
    public function storeKomentar(Request $request, Kalam $kalam)
    {
        $request->validate([
            'nama_publik' => 'required|string|max:50',
            'body' => 'required|string|max:1000',
            'captcha_challenge' => 'required|string',
            'captcha_answer' => 'required|integer',
        ]);

        // Verifikasi Math Captcha di Sisi Server
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

        // Simpan komentar menggunakan relasi MorphMany polimorfik
        $komentar = new Komentar([
            'body' => $request->body,
            'nama_publik' => $request->nama_publik ? strip_tags($request->nama_publik) : null,
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