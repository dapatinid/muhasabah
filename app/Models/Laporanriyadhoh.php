<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LaporanRiyadhoh extends Model
{
    use SoftDeletes;

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

}