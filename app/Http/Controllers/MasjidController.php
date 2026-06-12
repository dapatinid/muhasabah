<?php

namespace App\Http\Controllers;

use App\Models\Masjid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MasjidController extends Controller
{
    /**
     * Halaman Utama: Daftar Masjid
     */
    public function index(Request $request)
    {
        $query = Masjid::query();

        // Fitur Pencarian
        if ($search = $request->input('search')) {
            $query->where('nama', 'like', "%{$search}%")
                  ->orWhere('jenis', 'like', "%{$search}%");
        }

        // Ambil data dengan paginasi 10 data per halaman
        $masjids = $query->withAvg('ratings', 'score')
                            ->withCount('ratings')
                            ->latest()
                            ->paginate(10)
                            ->withQueryString();

        return Inertia::render('Admin/Masjid/Index', [
            'masjids' => $masjids,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Halaman Form Tambah Masjid
     */
    public function create()
    {
        return Inertia::render('Admin/Masjid/Create');
    }

    /**
     * Proses Simpan Data Masjid Baru
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
            $validated['logo'] = $request->file('logo')->store('masjid/logo', 'public');
        }

        if ($request->hasFile('sampul')) {
            $validated['sampul'] = $request->file('sampul')->store('masjid/sampul', 'public');
        }

        Masjid::create($validated);

        return redirect('/admin/masjid')->with('success', 'Masjid berhasil dibuat.');
    }

    /**
     * Halaman Form Edit Masjid
     */
    public function edit(Masjid $masjid)
    {
        // Ambil semua data user untuk ditampilkan di pilihan
        $users = \App\Models\User::select('id', 'name')->orderBy('name')->get();
        
        // Ambil array ID dari user yang sudah tergabung di masjid ini
        $attachedUsers = $masjid->users()->pluck('users.id');

        return Inertia::render('Admin/Masjid/Edit', [
            'masjid' => $masjid,
            'users' => $users,
            'attachedUsers' => $attachedUsers,
        ]);
    }

    /**
     * Proses Perbarui Data Masjid
     */
public function update(Request $request, Masjid $masjid)
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

    // Hapus parameter file dan users sebelum update data utama masjid
    unset($validated['logo'], $validated['sampul'], $validated['users']);

    if ($request->hasFile('logo')) {
        if ($masjid->logo) { \Illuminate\Support\Facades\Storage::disk('public')->delete($masjid->logo); }
        $validated['logo'] = $request->file('logo')->store('masjid/logo', 'public');
    }

    if ($request->hasFile('sampul')) {
        if ($masjid->sampul) { \Illuminate\Support\Facades\Storage::disk('public')->delete($masjid->sampul); }
        $validated['sampul'] = $request->file('sampul')->store('masjid/sampul', 'public');
    }

    $masjid->update($validated);

    // 🌟 SINKRONISASI RELASI MANY-TO-MANY 
    if ($request->has('users')) {
        $masjid->users()->sync($request->users);
    } else {
        $masjid->users()->sync([]); // Kosongkan jika tidak ada user yang dicentang
    }

    return redirect('/admin/masjid')->with('success', 'Masjid berhasil diperbarui.');
}   

    /**
     * Proses Hapus Masjid (Soft Delete)
     */
    public function destroy(Masjid $masjid)
    {
        // (Opsional) Hapus file fisik jika dihapus. 
        // Karena pakai SoftDeletes, file biarkan saja. Tapi jika ingin dihapus, buka komentar di bawah:
        
        if ($masjid->logo) Storage::disk('public')->delete($masjid->logo);
        if ($masjid->sampul) Storage::disk('public')->delete($masjid->sampul);
        
        
        $masjid->delete();

        return redirect('/admin/masjid')->with('success', 'Masjid berhasil dihapus.');
    }

/**
     * Handle upload gambar dari Rich Text Editor (Tiptap)
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        // Simpan gambar ke dalam folder public/masjid/editor
        $path = $request->file('image')->store('masjid/editor', 'public');
        
        // Kembalikan response JSON berisi URL gambar untuk dirender oleh Tiptap
        return response()->json([
            'url' => asset('storage/' . $path)
        ]);
    }    
}