<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TentangSaya extends Model
{
    use HasFactory;

    // Nama tabel didefinisikan secara eksplisit jika diperlukan, walaupun Laravel otomatis mendeteksinya
    protected $table = 'tentang_sayas';

    protected $fillable = [
        'user_id',
        'autobiografi',
    ];

    /**
     * Relasi balik: TentangSaya dimiliki oleh satu User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}