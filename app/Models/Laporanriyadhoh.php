<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LaporanRiyadhoh extends Model
{
    use SoftDeletes;

    protected $table = 'laporanriyadhohs';

    // Otomatis disertakan saat model di-serialize ke JSON / Inertia
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

    // ----------------------------------------------------------------
    // Definisi kolom per kategori
    // ----------------------------------------------------------------

    public static array $ibadahKeys = [
        'tahajud', 'witir', 'qobliyah_subuh', 'subuh_jamaah',
        'dhuha', 'dhuhur_jamaah', 'ashar_jamaah', 'maghrib_jamaah',
        'isya_jamaah', 'sedekah_subuh', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'istighfar', 'sholawat',
        'alquran', 'puasa_sunnah',
    ];

    /** Rakaat → skor = nilai × 100 */
    public static array $rakaatKeys = ['tahajud', 'witir', 'dhuha'];

    /** Ucapan → skor = nilai × 1 */
    public static array $hitunganKeys = ['istighfar', 'sholawat'];

    /**
     * Pilihan string → sempurna/ya/jamaah=1000, sebagian/sendiri=500, lainnya=0
     * (sedekah_subuh dikecualikan — punya logika tersendiri)
     */
    public static array $pilihanKeys = [
        'qobliyah_subuh', 'subuh_jamaah', 'dhuhur_jamaah', 'ashar_jamaah',
        'maghrib_jamaah', 'isya_jamaah', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'alquran', 'puasa_sunnah',
    ];

    // ----------------------------------------------------------------
    // Accessor: skor  (integer murni, TIDAK termasuk sedekah)
    // ----------------------------------------------------------------

    protected function skor(): Attribute
    {
        return Attribute::make(
            get: function () {
                $skor = 0;

                // Rakaat × 100
                foreach (self::$rakaatKeys as $key) {
                    $skor += ((int) ($this->attributes[$key] ?? 0)) * 100;
                }

                // Ucapan × 1
                foreach (self::$hitunganKeys as $key) {
                    $skor += (int) ($this->attributes[$key] ?? 0);
                }

                // Pilihan string
                foreach (self::$pilihanKeys as $key) {
                    $val = strtolower((string) ($this->attributes[$key] ?? ''));
                    $skor += match ($val) {
                        'sempurna', 'ya', 'jamaah' => 1000,
                        'sebagian', 'sendiri'      => 500,
                        default                    => 0,
                    };
                }

                return $skor;
            },
        );
    }

    // ----------------------------------------------------------------
    // Accessor: skor_gabung  (string, misal "11.200 + Rp30.000")
    // ----------------------------------------------------------------

    protected function skorGabung(): Attribute
    {
        return Attribute::make(
            get: function () {
                $skorMurni = $this->skor;
                $sedekah   = (int) ($this->attributes['sedekah_subuh'] ?? 0);

                $skorStr = number_format($skorMurni, 0, ',', '.');

                if ($sedekah > 0) {
                    return $skorStr . ' + Rp' . number_format($sedekah, 0, ',', '.');
                }

                return $skorStr;
            },
        );
    }
}