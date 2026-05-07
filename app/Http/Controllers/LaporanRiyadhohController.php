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

        return Inertia::render('LaporanLog', ['logs' => $logs]);
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

        $entries = $query
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(50)
            ->through(function ($item) {
                // Sertakan computed attributes
                $item->skor         = $item->skor;
                $item->skor_gabung  = $item->skor_gabung;
                $item->sedekah_subuh = $item->sedekah_subuh;
                return $item;
            });

        return Inertia::render('LogRiyadhoh', [
            'entries' => $entries->items(),
            'filters' => $request->only(['search', 'date_from', 'date_to']),
            'meta'    => [
                'total'        => $entries->total(),
                'current_page' => $entries->currentPage(),
                'last_page'    => $entries->lastPage(),
                'per_page'     => $entries->perPage(),
            ],
        ]);
    }

    public function raportRiyadhoh(Request $request)
    {
        $noWa = $request->input('no_wa');

        if (!$noWa) {
            return Inertia::render('RaportRiyadhoh', [
                'no_wa'   => null,
                'entries' => null,
                'peserta' => null,
            ]);
        }

        $allEntries = LaporanRiyadhoh::query()
            ->where('no_wa', $noWa)
            ->orderBy('hari_ke', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($allEntries->isEmpty()) {
            return Inertia::render('RaportRiyadhoh', [
                'no_wa'   => $noWa,
                'entries' => [],
                'peserta' => null,
            ]);
        }

        // Deduplikasi: per hari_ke, ambil yang created_at paling baru
        $deduplicated = $allEntries
            ->groupBy('hari_ke')
            ->map(fn($group) => $group->sortByDesc('created_at')->first())
            ->sortKeys()
            ->values()
            ->map(function ($entry) {
                // Append computed attributes untuk dikirim ke Vue
                $entry->skor            = $entry->skor;
                $entry->skor_gabung     = $entry->skor_gabung;
                $entry->sedekah_subuh = $entry->sedekah_subuh;
                return $entry;
            });

        $first        = $allEntries->first();
        $totalSkor    = $deduplicated->sum('skor');
        $totalSedekah = $deduplicated->sum('sedekah_subuh');
        $totalHari    = $deduplicated->count();
        $skorRata     = $totalHari > 0 ? round($totalSkor / $totalHari, 0) : 0;

        // Format total skor gabungan
        $totalSkorGabung = number_format($totalSkor, 0, ',', '.');
        if ($totalSedekah > 0) {
            $totalSkorGabung .= ' + Rp' . number_format($totalSedekah, 0, ',', '.');
        }

        return Inertia::render('RaportRiyadhoh', [
            'no_wa'   => $noWa,
            'entries' => $deduplicated->values(),
            'peserta' => [
                'nama'              => $first->nama,
                'no_wa'             => $first->no_wa,
                'grup'              => $first->grup,
                'tanggal_mulai'     => $deduplicated->min('tanggal'),
                'tanggal_selesai'   => $deduplicated->max('tanggal'),
                'total_hari'        => $totalHari,
                'skor_total'        => $totalSkor,
                'skor_total_gabung' => $totalSkorGabung,
                'total_sedekah'     => $totalSedekah,
                'skor_rata'         => $skorRata,
            ],
        ]);
    }
}