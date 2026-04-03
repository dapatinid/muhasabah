<?php

namespace App\Http\Controllers;

use App\Models\LaporanRiyadhoh;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanRiyadhohController extends Controller
{
    use SoftDeletes;

    public function store(Request $request)
    {
        // List key yang bertipe angka (Quantity)
        $numberKeys = ['tahajud', 'witir', 'dhuha', 'sedekah_subuh', 'istighfar', 'sholawat'];
        
        // Ambil semua key ibadah (asumsi Anda punya array $ibadahKeys di Model)
        $allIbadahKeys = LaporanRiyadhoh::$ibadahKeys;

        $rules = [
            'nama'     => 'required|string|max:100',
            'no_wa'    => 'required|string|max:20',
            'tanggal'  => 'required|date',
            'hari_ke'  => 'required|integer|min:1',
            'grup'     => 'required|string|max:100',
        ];

        // Tambahkan rules secara dinamis untuk setiap ibadah
        foreach ($allIbadahKeys as $key) {
            if (in_array($key, $numberKeys)) {
                $rules[$key] = 'required|numeric|min:0'; // Untuk yang quantity
            } else {
                $rules[$key] = 'required|in:sempurna,sebagian,tidak'; // Untuk yang radio
            }
        }

        $validated = $request->validate($rules);

        // Langsung simpan karena data sudah flat (tidak perlu unset 'ibadah')
        \App\Models\LaporanRiyadhoh::create($validated);

        return redirect()->back();
    }
}