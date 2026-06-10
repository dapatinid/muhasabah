<?php

namespace App\Http\Controllers;

use App\Models\LaporanRiyadhoh;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanRiyadhohController extends Controller
{

    public function store(Request $request)
    {
        $numberKeys = ['tahajud', 'witir', 'dhuha', 'sedekah_subuh', 'istighfar', 'sholawat'];
        $allIbadahKeys = LaporanRiyadhoh::$ibadahKeys;

        $rules = [
            'nama'    => 'required|string|max:100',
            'no_wa'   => 'required|string|max:20',
            'tanggal' => 'required|date',
            'hari_ke' => 'required|integer|min:1',
            'grup'    => 'required|string|max:100',
        ];

        foreach ($allIbadahKeys as $key) {
            if (in_array($key, $numberKeys)) {
                $rules[$key] = 'required|numeric|min:0';
            } else {
                $rules[$key] = 'required|in:sempurna,sebagian,tidak,ya,jamaah,sendiri';
            }
        }

        $validated = $request->validate($rules);

        LaporanRiyadhoh::create($validated);

        return redirect()->back();
    }

    public function log()
    {
        $logs = LaporanRiyadhoh::query()
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy(fn($item) => $item->tanggal->format('Y-m-d'))
            ->map(function ($items, $date) {
                $formattedDate = Carbon::parse($date)->isoFormat('YYYY MM DD ~ dddd');
                $formattedDate = str_replace('Minggu', 'Ahad', $formattedDate);
                return [
                    'formatted_date' => $formattedDate,
                    'entries' => $items->map(fn($e) => "{$e->nama} ({$e->grup}) ... Hari ke {$e->hari_ke}"),
                ];
            })
            ->values();

        return Inertia::render('LaporanRiyadhohLog', ['logs' => $logs]);
    }

public function logRiyadhoh(Request $request)
{
    $query = LaporanRiyadhoh::query();

    if ($search = $request->input('search')) {
        $query->where(function ($q) use ($search) {
            $q->where('nama', 'like', "%{$search}%")
              ->orWhere('no_wa', 'like', "%{$search}%");
        });
    }

    if ($dateFrom = $request->input('date_from')) {
        $query->whereDate('tanggal', '>=', $dateFrom);
    }

    if ($dateTo = $request->input('date_to')) {
        $query->whereDate('tanggal', '<=', $dateTo);
    }

    // Gunakan paginate secara standar. 
    // Karena sudah ada $appends di model, skor otomatis ikut.
    $entries = $query->orderBy('tanggal', 'desc')
                     ->orderBy('created_at', 'desc')
                     ->paginate(50)
                     ->withQueryString();

    return Inertia::render('Admin/Riyadhoh/LogRiyadhoh', [
        'entries' => $entries->items(), // Kembali gunakan items() jika ingin memisahkan meta
        'filters' => $request->only(['search', 'date_from', 'date_to']),
        
        // Ganti nama key untuk paginasi agar tidak tabrakan dengan Meta SEO
        'pagination' => [
            'total'        => $entries->total(),
            'current_page' => $entries->currentPage(),
            'last_page'    => $entries->lastPage(),
            'per_page'     => $entries->perPage(),
        ],
        
        // Kirim meta title asli untuk app.blade.php publik
        'meta'    => [
                    'title'       => 'Log Riyadhoh',
                    'description' => 'Data laporan ibadah harian peserta riyadhoh Muhasabah ID.',
                    'image'       => asset('favicon.png'),
                    'url'         => url()->current(),
                ],
    ]);
}

// Tambahkan di Controller Anda
public function updateLog(Request $request, $id)
{
    $entry = LaporanRiyadhoh::findOrFail($id);

    // Validasi dinamis: ambil key yang dikirim (misal: 'tahajud' atau 'nama')
    $data = $request->validate([
        'column' => 'required|string',
        'value'  => 'nullable', // Sesuaikan jika ingin validasi lebih ketat
    ]);

    $column = $data['column'];
    $value = $data['value'];

    // Update kolom spesifik
    $entry->$column = $value;
    $entry->save();

    return back()->with('success', 'Data berhasil diperbarui');
}

// Hapus data laporan
public function deleteLog($id)
{
    $entry = LaporanRiyadhoh::findOrFail($id);
    $entry->delete();   
    return back()->with('success', 'Data berhasil dihapus');
}

public function raporRiyadhoh(Request $request)
{
    $noWa = $request->input('no_wa');

    // 1. Ambil data semua peserta (SELALU AMBIL INI)
    // Gunakan distinct atau groupBy agar tidak duplikat di dropdown
    $allParticipants = LaporanRiyadhoh::select('nama', 'no_wa')
        ->groupBy('no_wa', 'nama')
        ->orderBy('nama', 'asc')
        ->get();

    // 2. Jika tidak ada input no_wa, tampilkan halaman kosong tapi bawa data list peserta
    if (!$noWa) {
        return Inertia::render('Admin/Riyadhoh/RaporRiyadhoh', [
            'no_wa' => null,
            'entries' => null,
            'peserta' => null,
            'all_participants' => $allParticipants
        ]);
    }

    // 3. Cari data entri berdasarkan no_wa
    $allEntries = LaporanRiyadhoh::where('no_wa', $noWa)
        ->orderBy('hari_ke', 'asc')
        ->get();

    // Jika no_wa ada tapi data laporan tidak ada
    if ($allEntries->isEmpty()) {
        return Inertia::render('Admin/Riyadhoh/RaporRiyadhoh', [
            'no_wa' => $noWa,
            'entries' => [],
            'peserta' => null,
            'all_participants' => $allParticipants
        ]);
    }

    // 4. Logic Deduplikasi
    $deduplicated = $allEntries->groupBy('hari_ke')
        ->map(fn($group) => $group->sortByDesc('created_at')->first())
        ->values();

    $totalSkor    = $deduplicated->sum('skor');
    $totalSedekah = $deduplicated->sum('sedekah_subuh');
    $totalHari    = $deduplicated->count();

    $tanggalMulai = $deduplicated->first()->tanggal;
    $tanggalSelesai = $deduplicated->last()->tanggal;

    return Inertia::render('Admin/Riyadhoh/RaporRiyadhoh', [
        'no_wa'   => $noWa,
        'entries' => $deduplicated,
        'all_participants' => $allParticipants,
        'peserta' => [
            'nama'              => $allEntries->first()->nama,
            'no_wa'             => $noWa,
            'grup'              => $allEntries->first()->grup,
            'total_hari'        => $totalHari,
            'skor_total'        => $totalSkor,
            'skor_total_gabung' => number_format($totalSkor, 0, ',', '.') . ($totalSedekah > 0 ? ' + Rp' . number_format($totalSedekah, 0, ',', '.') : ''),
            'skor_rata'         => $totalHari > 0 ? round($totalSkor / $totalHari) : 0,
            'tanggal_mulai'     => $tanggalMulai,
            'tanggal_selesai'   => $tanggalSelesai,            
        ],
    ]);
}
}