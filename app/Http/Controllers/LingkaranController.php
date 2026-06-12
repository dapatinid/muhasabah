<?php

namespace App\Http\Controllers;

use App\Models\Lingkaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LingkaranController extends Controller
{
    /**
     * Halaman Utama: Daftar Lingkaran
     */
    public function index(Request $request)
    {
        $query = Lingkaran::query();

        // Fitur Pencarian
        if ($search = $request->input('search')) {
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('jenis', 'like', "%{$search}%");
        }

        // Ambil data dengan paginasi 10 data per halaman
        $lingkarans = $query->withAvg('ratings', 'score')
                            ->withCount('ratings')
                            ->latest()
                            ->paginate(10)
                            ->withQueryString();

        return Inertia::render('Admin/Lingkaran/Index', [
            'lingkarans' => $lingkarans,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Halaman Form Tambah Lingkaran
     */
    public function create()
    {
        return Inertia::render('Admin/Lingkaran/Create');
    }

    /**
     * Proses Simpan Data Lingkaran Baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'jenis' => 'required|string',
            'kontak' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'deskripsi' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // Validasi file
            'sampul' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // Validasi file
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('lingkaran/logo', 'public');
        }

        if ($request->hasFile('sampul')) {
            $validated['sampul'] = $request->file('sampul')->store('lingkaran/sampul', 'public');
        }

        Lingkaran::create($validated);

        return redirect('/admin/lingkaran')->with('success', 'Lingkaran berhasil dibuat.');
    }

    /**
     * Halaman Form Edit Lingkaran
     */
    public function edit(Lingkaran $lingkaran)
    {
        // Ambil semua data user untuk ditampilkan di pilihan
        $users = \App\Models\User::select('id', 'name')->orderBy('name')->get();
        
        // Ambil array ID dari user yang sudah tergabung di lingkaran ini
        $attachedUsers = $lingkaran->users()->pluck('users.id');

        return Inertia::render('Admin/Lingkaran/Edit', [
            'lingkaran' => $lingkaran,
            'users' => $users,
            'attachedUsers' => $attachedUsers,
        ]);
    }

    /**
     * Proses Perbarui Data Lingkaran
     */
public function update(Request $request, Lingkaran $lingkaran)
{
    $validated = $request->validate([
        'nama' => 'required|string|max:255',
        'jenis' => 'required|string',
        'kontak' => 'nullable|string|max:255',
        'alamat' => 'nullable|string',
        'deskripsi' => 'nullable|string',
        'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'sampul' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'users' => 'nullable|array', // Validasi input users sebagai array
        'users.*' => 'exists:users,id', // Pastikan ID valid
    ]);

    // Hapus parameter file dan users sebelum update data utama lingkaran
    unset($validated['logo'], $validated['sampul'], $validated['users']);

    if ($request->hasFile('logo')) {
        if ($lingkaran->logo) { \Illuminate\Support\Facades\Storage::disk('public')->delete($lingkaran->logo); }
        $validated['logo'] = $request->file('logo')->store('lingkaran/logo', 'public');
    }

    if ($request->hasFile('sampul')) {
        if ($lingkaran->sampul) { \Illuminate\Support\Facades\Storage::disk('public')->delete($lingkaran->sampul); }
        $validated['sampul'] = $request->file('sampul')->store('lingkaran/sampul', 'public');
    }

    $lingkaran->update($validated);

    // 🌟 SINKRONISASI RELASI MANY-TO-MANY 
    if ($request->has('users')) {
        $lingkaran->users()->sync($request->users);
    } else {
        $lingkaran->users()->sync([]); // Kosongkan jika tidak ada user yang dicentang
    }

    return redirect('/admin/lingkaran')->with('success', 'Lingkaran berhasil diperbarui.');
}   

    /**
     * Proses Hapus Lingkaran (Soft Delete)
     */
    public function destroy(Lingkaran $lingkaran)
    {
        // (Opsional) Hapus file fisik jika dihapus. 
        // Karena pakai SoftDeletes, file biarkan saja. Tapi jika ingin dihapus, buka komentar di bawah:
        
        if ($lingkaran->logo) Storage::disk('public')->delete($lingkaran->logo);
        if ($lingkaran->sampul) Storage::disk('public')->delete($lingkaran->sampul);
        
        
        $lingkaran->delete();

        return redirect('/admin/lingkaran')->with('success', 'Lingkaran berhasil dihapus.');
    }

/**
     * Handle upload gambar dari Rich Text Editor (Tiptap)
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        // Simpan gambar ke dalam folder public/lingkaran/editor
        $path = $request->file('image')->store('lingkaran/editor', 'public');
        
        // Kembalikan response JSON berisi URL gambar untuk dirender oleh Tiptap
        return response()->json([
            'url' => asset('storage/' . $path)
        ]);
    }    
}