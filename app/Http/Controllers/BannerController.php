<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    /**
     * Menampilkan daftar banner di halaman admin.
     */
    public function index(Request $request)
    {
        $query = Banner::query();

        // Fitur pencarian berdasarkan judul atau subtitle
        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('subtitle', 'like', "%{$search}%");
        }

        $banners = $query->orderBy('priority', 'asc')
                        ->latest()
                        ->paginate(10)
                        ->withQueryString();

        return Inertia::render('Admin/Banner/Index', [
            'banners' => $banners,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Menampilkan form pembuatan banner baru.
     */
    public function create()
    {
        return Inertia::render('Admin/Banner/Create', [
            'breadcrumbs' => [
                ['title' => 'Banner', 'href' => '/admin/banner'],
                ['title' => 'Tambah Banner', 'href' => '/admin/banner/create'],
            ],
        ]);
    }

    /**
     * Menyimpan banner baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'     => 'required|string|max:255',
            'subtitle'  => 'nullable|string|max:255',
            'image'     => 'required|string', // URL hasil uploadImage
            'link'      => 'nullable|url',
            'priority'  => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        Banner::create($validated);

        return redirect()->route('banner.index')->with('success', 'Banner Jumbotron berhasil ditambahkan.');
    }

    /**
     * Menampilkan form edit banner.
     */
    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/Banner/Edit', [
            'banner' => $banner,
            'breadcrumbs' => [
                ['title' => 'Banner', 'href' => '/admin/banner'],
                ['title' => 'Edit Banner', 'href' => "/admin/banner/{$banner->id}/edit"],
            ],
        ]);
    }

    /**
     * Memperbarui data banner.
     */
    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title'     => 'required|string|max:255',
            'subtitle'  => 'nullable|string|max:255',
            'image'     => 'required|string',
            'link'      => 'nullable|url',
            'priority'  => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $banner->update($validated);

        return redirect()->route('banner.index')->with('success', 'Banner berhasil diperbarui.');
    }

    /**
     * Menghapus banner (Soft Delete).
     */
    public function destroy(Banner $banner)
    {
        $banner->delete();
        return back()->with('success', 'Banner berhasil dihapus.');
    }

    /**
     * Mengolah upload gambar via AJAX/Inertia request.
     * Digunakan di Tiptap atau input file khusus.
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:3072', // Limit 3MB untuk banner high-res
        ]);
        
        $path = $request->file('image')->store('banner-images', 'public');
        $url = asset('storage/' . $path);

        // Disimpan ke session agar bisa ditangkap oleh form frontend
        return back()->with('uploaded_image_url', $url);
    }
}