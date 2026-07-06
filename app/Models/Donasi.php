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
        'user_id', 'judul', 'slug', 'panduan_donasi', 'body', 'progress', 'kategori', 'subkategori',
        'thumbnail', 'target_dana', 'saldo', 'tgl_mulai', 'tgl_selesai', 'is_published', 
        'created_by', 'updated_by'
    ];

    protected $casts = [
        'tgl_mulai' => 'datetime',
        'tgl_selesai' => 'datetime',
        'is_published' => 'boolean',
    ];    

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($donasi) {
            if (auth()->check()) {
                $donasi->user_id = auth()->id();
                $donasi->created_by = auth()->id();
                $donasi->updated_by = auth()->id();
            }
        });

        static::created(function ($donasi) {
            if ($donasi->user_id) {
                // syncWithoutDetaching agar user_id masuk ke tabel pivot polymorphic 
                // tanpa menghapus user lain yang mungkin juga di-attach via controller
                $donasi->authors()->syncWithoutDetaching([$donasi->user_id]);
            }
        });        

        static::updating(function ($donasi) {
            if (auth()->check()) {
                $donasi->updated_by = auth()->id();
            }
        });

        static::updated(function ($donasi) {
            if ($donasi->user_id) {
                // Memastikan user_id pemilik Donasi tetap tercentang/ada di tabel pivot
                $donasi->authors()->syncWithoutDetaching([$donasi->user_id]);
            }
        });    

        static::saving(function ($donasi) {
            if (empty($donasi->slug)) {
                $donasi->slug = $donasi->kategori . '-' . Str::slug($donasi->judul) . '-' . Str::random(12);
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

    /**
     * Tambahkan Relasi Komentar (Polimorfik)
     */
    public function komentars(): MorphMany
    {
        // Sesuaikan 'commentable' dengan nama prefix kolom di migrasi komentar Anda (misal: commentable_id, commentable_type)
        return $this->morphMany(Komentar::class, 'commentable');
    }

    /**
     * Tambahkan Relasi Reaksi (Polimorfik)
     */
    public function reaksis(): MorphMany
    {
        // Sesuaikan 'reactable' atau 'reaksiable' dengan prefix kolom di migrasi reaksi Anda
        return $this->morphMany(Reaksi::class, 'reaktiable');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }    
    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

public function resolveRouteBinding($value, $field = null)
{
    return $this->withoutGlobalScope('owner')
        ->where($field ?? $this->getRouteKeyName(), $value)
        ->firstOrFail();
}    

}