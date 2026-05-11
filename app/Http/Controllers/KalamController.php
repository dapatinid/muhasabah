<?php

namespace App\Http\Controllers;

use App\Models\Kalam;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KalamController extends Controller
{
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

        return Inertia::render('Kalam/Index', [
            'kalams' => $kalams,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Kalam/Create');
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

        return redirect('/kalam')->with('success', 'Kalam berhasil diterbitkan.');
    }

    public function edit(Kalam $kalam)
    {
        // Pastikan hanya pemilik yang bisa mengedit
        if ($kalam->user_id !== auth()->id()) {
            abort(403, 'Anda tidak memiliki akses untuk mengedit Kalam ini.');
        }

        return Inertia::render('Kalam/Edit', [
            'kalam' => $kalam
        ]);
    }

    public function update(Request $request, Kalam $kalam)
    {
        if ($kalam->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'body' => 'required|string',
            'kategori' => 'required|string',
            'is_anonymous' => 'boolean',
        ]);

        $kalam->update($validated);

        // ← Pakai route() dengan slug, bukan redirect('/kalam')
        return redirect()->route('kalam.index')->with('success', 'Kalam berhasil diperbarui.');
    }

    public function show(Kalam $kalam)
    {
        $kalam->load([
            'user:id,name',
            'komentars.user:id,name',
            'reaksis',
        ]);

        return Inertia::render('Kalam/Show', [
            'kalam' => $kalam,
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
        $request->validate(['image' => 'required|image|max:2048']);
        
        $path = $request->file('image')->store('kalam-images', 'public');
        $url = asset('storage/' . $path);

        // Kirim URL ke props agar bisa ditangkap onSuccess di frontend
        return back()->with('flash', [
            'uploaded_image_url' => $url
        ]);
    }
}