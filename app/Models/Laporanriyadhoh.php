<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LaporanRiyadhoh extends Model
{
    use SoftDeletes;

    protected $table = 'laporanriyadhohs';

    protected $appends = ['skor', 'skor_gabung'];

    protected $fillable = [
        'nama', 'no_wa', 'tanggal', 'hari_ke', 'grup',
        'tahajud', 'witir', 'qobliyah_subuh', 'subuh_jamaah',
        'dhuha', 'dhuhur_jamaah', 'ashar_jamaah', 'maghrib_jamaah',
        'isya_jamaah', 'sedekah_subuh', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'istighfar', 'sholawat',
        'alquran', 'puasa_sunnah',
    ];

    protected $casts = [
        'tanggal'       => 'date',
        'hari_ke'       => 'integer',
        'tahajud'       => 'integer',
        'witir'         => 'integer',
        'dhuha'         => 'integer',
        'istighfar'     => 'integer',
        'sholawat'      => 'integer',
        'sedekah_subuh' => 'integer',
    ];

    public static array $ibadahKeys = [
        'tahajud', 'witir', 'qobliyah_subuh', 'subuh_jamaah',
        'dhuha', 'dhuhur_jamaah', 'ashar_jamaah', 'maghrib_jamaah',
        'isya_jamaah', 'sedekah_subuh', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'istighfar', 'sholawat',
        'alquran', 'puasa_sunnah',
    ];

    public static array $rakaatKeys = ['tahajud', 'witir', 'dhuha'];
    public static array $hitunganKeys = ['istighfar', 'sholawat'];
    public static array $pilihanKeys = [
        'qobliyah_subuh', 'subuh_jamaah', 'dhuhur_jamaah', 'ashar_jamaah',
        'maghrib_jamaah', 'isya_jamaah', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'alquran', 'puasa_sunnah',
    ];

    // Accessor Skor (Gaya Lama)
    public function getSkorAttribute(): int
    {
        $skor = 0;
        foreach (self::$rakaatKeys as $key) {
            $skor += ((int) $this->getAttribute($key)) * 100;
        }
        foreach (self::$hitunganKeys as $key) {
            $skor += (int) $this->getAttribute($key);
        }
        foreach (self::$pilihanKeys as $key) {
            $val = strtolower((string) $this->getAttribute($key));
            $skor += match ($val) {
                'sempurna', 'ya', 'jamaah' => 1000,
                'sebagian', 'sendiri'      => 500,
                default                    => 0,
            };
        }
        return $skor;
    }

    // Accessor Skor Gabung (Gaya Lama)
    public function getSkorGabungAttribute(): string
    {
        $skorMurni = $this->skor; // Memanggil accessor di atas
        $sedekah   = (int) $this->sedekah_subuh;
        $skorStr   = number_format($skorMurni, 0, ',', '.');

        if ($sedekah > 0) {
            return $skorStr . ' + Rp' . number_format($sedekah, 0, ',', '.');
        }
        return $skorStr;
    }
}