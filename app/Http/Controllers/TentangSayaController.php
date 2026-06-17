<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TentangSayaController extends Controller
{
    public function storeOrUpdate(Request $request)
    {
        $request->validate([
            'autobiografi' => 'required|string',
        ]);

        // Mengupdate jika sudah ada, membuat baru jika belum ada berdasarkan user_id
        auth()->user()->tentangSaya()->updateOrCreate(
            ['user_id' => auth()->id()],
            ['autobiografi' => $request->autobiografi]
        );

        return back()->with('success', 'Autobiografi berhasil disimpan.');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            // Maksimal 2MB (2048 KB). Jika gambar Anda > 2MB, proses akan gagal ke alert onError di atas.
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048', 
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $path = $file->store('tentang-saya/images', 'public');

            $url = asset('storage/' . $path);

            // 🌟 KITA KIRIM DALAM 2 FORMAT AGAR PASTI DITANGKAP OLEH INERTIA
            return back()
                ->with('uploaded_image_url', $url) 
                ->with('flash', [
                    'uploaded_image_url' => $url
                ]);
        }

        return back()->withErrors(['image' => 'Gagal mengunggah gambar, file tidak terbaca.']);
    }
}