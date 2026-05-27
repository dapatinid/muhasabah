<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AcaraVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'acara_id',
        'nama_varian',
        'harga',
        'jumlah_kursi',
    ];

    /**
     * Relasi balik ke Acara Utama
     */
    public function acara(): BelongsTo
    {
        return $this->belongsTo(Acara::class);
    }
}