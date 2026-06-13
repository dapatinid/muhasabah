<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UjiKelayakan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UjiKelayakanController extends Controller
{
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