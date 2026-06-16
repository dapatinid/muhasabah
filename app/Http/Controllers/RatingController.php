<?php

namespace App\Http\Controllers;

use App\Models\Lingkaran;
use App\Models\Masjid;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * Simpan atau Update Rating untuk Lingkaran
     */
    public function storeLingkaran(Request $request, Lingkaran $lingkaran)
    {
        // Validasi input dari frontend
        $validated = $request->validate([
            'score' => 'required|integer|min:1|max:5',
            'ulasan' => 'nullable|string|max:1000', // Di form Vue kita menggunakan 'ulasan'
        ]);

        // Simpan menggunakan updateOrCreate
        // Cari berdasarkan user_id. Jika ada, update. Jika tidak, buat baru.
        $lingkaran->ratings()->updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'score'  => $validated['score'],
                'ulasan' => $validated['ulasan'], // Kita mapping 'ulasan' ke field 'ulasan' di DB
            ]
        );

        // Kembalikan ke halaman sebelumnya dengan pesan sukses (akan ditangkap oleh toast Vue)
        return back()->with('success', 'Ulasan dan penilaian Anda berhasil disimpan!');
    }

    /**
     * Simpan atau Update Rating untuk Masjid (Persiapan masa depan)
     */
    public function storeMasjid(Request $request, Masjid $masjid)
    {
        $validated = $request->validate([
            'score' => 'required|integer|min:1|max:5',
            'ulasan' => 'nullable|string|max:1000',
        ]);

        $masjid->ratings()->updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'score'  => $validated['score'],
                'ulasan' => $validated['ulasan'],
            ]
        );

        return back()->with('success', 'Ulasan dan penilaian Anda berhasil disimpan!');
    }
}