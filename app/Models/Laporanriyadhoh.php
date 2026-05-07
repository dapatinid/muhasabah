<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanRiyadhoh extends Model
{
    protected $table = 'laporanriyadhohs';

    protected $fillable = [
        'nama', 'no_wa', 'tanggal', 'hari_ke', 'grup',
        'tahajud', 'witir', 'qobliyah_subuh', 'subuh_jamaah',
        'dhuha', 'dhuhur_jamaah', 'ashar_jamaah', 'maghrib_jamaah',
        'isya_jamaah', 'sedekah_subuh', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'istighfar', 'sholawat',
        'alquran', 'puasa_sunnah',
    ];

    protected $casts = [
        'tanggal'      => 'date',
        'hari_ke'      => 'integer',
        'tahajud'      => 'integer',
        'witir'        => 'integer',
        'dhuha'        => 'integer',
        'istighfar'    => 'integer',
        'sholawat'     => 'integer',
        'sedekah_subuh'=> 'integer',
    ];

    public static array $rakaatKeys = ['tahajud', 'witir', 'dhuha'];
    public static array $hitunganKeys = ['istighfar', 'sholawat'];
    public static array $pilihanKeys = [
        'qobliyah_subuh', 'subuh_jamaah', 'dhuhur_jamaah', 'ashar_jamaah',
        'maghrib_jamaah', 'isya_jamaah', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'alquran', 'puasa_sunnah',
    ];

    /**
     * Hitung skor murni (tanpa sedekah)
     */
    public function getSkorAttribute(): int
    {
        $skor = 0;

        // A. Rakaat x 100
        foreach (self::$rakaatKeys as $key) {
            $skor += ((int) $this->$key) * 100;
        }

        // B. Istighfar & Sholawat x 1
        foreach (self::$hitunganKeys as $key) {
            $skor += (int) $this->$key;
        }

        // Skor 1000, 500, 0
        foreach (self::$pilihanKeys as $key) {
            $val = strtolower($this->$key);
            $skor += match ($val) {
                'sempurna', 'ya', 'jamaah' => 1000,
                'sebagian'                => 500,
                default                   => 0,
            };
        }

        return $skor;
    }

    /**
     * Format tampilan: 11.200 + Rp30.000
     */
    public function getSkorGabungAttribute(): string
    {
        $skorMurni = number_format($this->skor, 0, ',', '.');
        $sedekah = $this->sedekah_subuh ?? 0;
        
        return "{$skorMurni} + Rp" . number_format($sedekah, 0, ',', '.');
    }
}