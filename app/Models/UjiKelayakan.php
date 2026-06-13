<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UjiKelayakan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'class',
        'kategori',
        'jawaban',
    ];

    // Mengubah JSON otomatis menjadi Array di PHP saat diakses
    protected $casts = [
        'jawaban' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}