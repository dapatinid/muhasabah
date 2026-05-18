<?php

namespace App\Http\Controllers;

use App\Models\Kalam;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KalamController extends Controller
{
    public function kalam(Request $request)
    {
        $query = Kalam::with('user:id,name');

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

        // Sekarang metode kalams() sudah ada di model User
        $request->user()->kalams()->create($validated);

        return redirect('/admin/kalam')->with('success', 'Kalam berhasil diterbitkan.');
    }

    public function edit(Kalam $kalam)
    {
        // Pastikan hanya pemilik yang bisa mengedit
        if ($kalam->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit Kalam ini.');
        }

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
        if ($kalam->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:kalams,slug,' . $kalam->id,
            'body' => 'required|string',
            'kategori' => 'required|string',
            'is_anonymous' => 'boolean',
        ]);

        $kalam->update($validated);

        return redirect()->route('kalam.index')->with('success', 'Kalam berhasil diperbarui.');
    }

    public function show(Kalam $kalam)
    {
        $kalam->load([
            'user:id,name',
            'komentars.user:id,name',
            'reaksis',
        ]);

        // Bersihkan isi tulisan dari kode HTML untuk deskripsi pratinjau WA
        $cleanDescription = Str::limit(strip_tags($kalam->body), 150, '...');

        // Asumsikan field thumbnail artikel Anda bernama 'thumbnail' atau 'foto'. Jika tidak ada, pakai default gambar artikel
        $imageUrl = $kalam->thumbnail ? $kalam->thumbnail : asset('favicon.png');

        return Inertia::render('KalamShow', [
            'kalam' => $kalam,
            // Kirim data SEO meta khusus agar terbaca oleh app.blade.php
            'meta' => [
                'title' => $kalam->judul,
                'description' => $cleanDescription,
                'image' => $imageUrl,
                'url' => request()->fullUrl(),
            ]
        ]);
    }  

    public function destroy(Kalam $kalam)
    {
        if ($kalam->user_id !== auth()->id()) abort(403);
        
        $kalam->delete();
        return back()->with('success', 'Kalam berhasil dihapus.');
    }


    public function uploadImage(Request $request)
    {
            // dd($request->all(), $request->method(), $request->url());

        $request->validate(['image' => 'required|image|max:2048']);
        
        $path = $request->file('image')->store('kalam-images', 'public');
        $url = asset('storage/' . $path);

        // ← Simpan langsung, bukan nested dalam array 'flash'
        return back()->with('uploaded_image_url', $url);
    }
}