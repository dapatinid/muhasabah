<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LaporanRiyadhoh extends Model
{
    use SoftDeletes;
    protected $table = 'laporanriyadhohs';
    protected $appends = ['skor', 'skor_gabung'];

    public static array $ibadahKeys = [
        'tahajud', 'witir', 'qobliyah_subuh', 'subuh_jamaah',
        'dhuha', 'dhuhur_jamaah', 'ashar_jamaah', 'maghrib_jamaah',
        'isya_jamaah', 'sedekah_subuh', 'birrul_walidain', 'bakti_masjid',
        'dzikir_pagi', 'dzikir_sore', 'istighfar', 'sholawat',
        'alquran', 'puasa_sunnah',
    ];

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

protected function skor(): Attribute
{
    return Attribute::make(
        get: function () {
            $skor = 0;
            foreach (self::$rakaatKeys as $key) {
                $skor += ((int) $this->$key) * 100;
            }
            foreach (self::$hitunganKeys as $key) {
                $skor += (int) $this->$key;
            }
            foreach (self::$pilihanKeys as $key) {
                $val = strtolower($this->$key ?? '');
                $skor += match ($val) {
                    'sempurna', 'ya', 'jamaah' => 1000,
                    'sebagian'                => 500,
                    default                   => 0,
                };
            }
            return $skor;
        },
    );
}

protected function skorGabung(): Attribute
{
    return Attribute::make(
        get: function () {
            $skorMurni = number_format($this->skor, 0, ',', '.');
            $sedekah = $this->sedekah_subuh ?? 0;
            return "{$skorMurni} + Rp" . number_format($sedekah, 0, ',', '.');
        },
    );
}    
}