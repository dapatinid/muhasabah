<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Donasi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'judul', 'slug', 'body', 'kategori', 'subkategori',
        'thumbnail', 'target_dana', 'saldo', 'tgl_mulai', 'tgl_selesai', 'is_published', 
        'created_by', 'updated_by'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($donasi) {
            if (auth()->check()) {
                $donasi->created_by = auth()->id();
                $donasi->updated_by = auth()->id();
            }
        });

        static::updating(function ($donasi) {
            if (auth()->check()) {
                $donasi->updated_by = auth()->id();
            }
        });

        static::saving(function ($donasi) {
            if (empty($donasi->slug)) {
                $donasi->slug = $donasi->kategori . '-' . Str::slug($donasi->judul) . '-' . Str::random(7);
            }

            // Ekstrak thumbnail dari body (TipTap)
            preg_match('/<img.+?src=["\'](.+?)["\'].*?>/i', $donasi->body, $matches);
            $donasi->thumbnail = $matches[1] ?? null;
        });
    }

    public function payments(): MorphMany
    {
        // Parameter kedua harus sesuai dengan nama kolom di migrasi (paymentable)
        return $this->morphMany(Payment::class, 'paymentable');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

}