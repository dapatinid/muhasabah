<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UjiKelayakan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UjiKelayakanController extends Controller
{
    /**
     * Menampilkan daftar data hasil Uji Kelayakan ke komponen Index.vue
     * Sekaligus mengoper data ke komponen pembantu Preview.vue melalui state Vue.
     */
    public function index(Request $request)
    {
        // 1. Ambil query pencarian dan filter dari frontend
        $search = $request->input('search');
        $classFilter = $request->input('class');

        // 2. Bangun query dengan memuat relasi 'user' (agar nama/email pendaftar muncul)
        $query = UjiKelayakan::with(['user' => function($q) {
            $q->select('id', 'name', 'email');
        }]);

        // 3. Terapkan filter pencarian berdasarkan nama user atau id user jika diisi
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('class', 'like', "%{$search}%")
                  ->orWhere('kategori', 'like', "%{$search}%")
                  ->orWhere('user_id', $search)
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // 4. Terapkan filter berdasarkan kolom 'class' jika dipilih
        if ($classFilter) {
            $query->where('class', $classFilter);
        }

        // 5. Urutkan dari data yang paling baru disubmit
        $paginator = $query->latest()->paginate(15)->withQueryString();

        // 6. Lempar data terstruktur menggunakan Laravel Inertia ke frontend
        return Inertia::render('Admin/UjiKelayakan/Index', [
            'items' => $paginator->items(),
            'filters' => [
                'search' => $search ?? '',
                'class' => $classFilter ?? '',
            ],
            'pagination' => [
                'total' => $paginator->total(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
            ]
        ]);
    }


  public function store(Request $request)
    {
        $validated = $request->validate([
            'class' => 'required|string',
            'kategori' => 'required|string',
            'jawaban' => 'required|array',
            'jawaban.*.question_id' => 'required|integer',
            'jawaban.*.question_text' => 'required|string',
            'jawaban.*.choice' => 'required|string',
            'jawaban.*.reason' => 'required|string|max:200', // Validasi alasan maks 200 karakter
        ]);

        $request->user()->ujiKelayakans()->create([
            'class' => $validated['class'],
            'kategori' => $validated['kategori'],
            'jawaban' => $validated['jawaban'],
        ]);

        return back()->with('success', 'Jawaban kategori ini berhasil disimpan!');
    }


}