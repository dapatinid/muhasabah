<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $guarded = ['id'];

    /**
     * MorphTo mengindikasikan bahwa rating ini bisa dimiliki oleh lebih dari satu model (Masjid atau Lingkaran)
     */
    public function rateable()
    {
        return $this->morphTo();
    }

    /**
     * Relasi balik ke User (Siapa yang memberi rating)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}