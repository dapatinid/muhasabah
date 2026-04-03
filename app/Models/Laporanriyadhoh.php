<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanRiyadhoh extends Model
{
    protected $table = 'laporanriyadhohs';

    protected $fillable = [
        'nama',
        'no_wa',
        'tanggal',
        'hari_ke',
        'grup',
        'tahajud',
        'witir',
        'qobliyah_subuh',
        'subuh_jamaah',
        'dhuha',
        'dhuhur_jamaah',
        'ashar_jamaah',
        'maghrib_jamaah',
        'isya_jamaah',
        'sedekah_subuh',
        'birrul_walidain',
        'bakti_masjid',
        'dzikir_pagi',
        'dzikir_sore',
        'istighfar',
        'sholawat',
        'alquran',
        'puasa_sunnah',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'hari_ke' => 'integer',
    ];

    /**
     * Kolom-kolom ibadah untuk iterasi mudah
     */
    public static array $ibadahKeys = [
        'tahajud', 'witir', 'qobliyah_subuh', 'subuh_jamaah',
        'dhuha', 'dhuhur_jamaah', 'ashar_jamaah', 'maghrib_jamaah',
        'isya_jamaah', 'sedekah_subuh', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'istighfar', 'sholawat',
        'alquran', 'puasa_sunnah',
    ];

    /**
     * Hitung skor sempurna
     */
    public function getSkorAttribute(): int
    {
        return collect(self::$ibadahKeys)
            ->filter(fn($key) => $this->$key === 'sempurna')
            ->count();
    }

    #coba rename file ini jadi LaporanRiyadhoh.php
}