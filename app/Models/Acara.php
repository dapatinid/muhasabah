<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Acara extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'judul', 'slug', 'panduan_acara', 'body', 'progress', 'kategori', 'subkategori',
        'thumbnail', 'lokasi', 'accept_tiket', 'accept_donasi', 'harga_tiket', 'kuota_tiket', 
        'tiket_terjual', 'target_donasi', 'saldo_donasi', 'tgl_mulai', 'tgl_selesai', 
        'batas_registrasi', 'is_published', 'created_by', 'updated_by'
    ];

    protected $casts = [
        'tgl_mulai' => 'datetime',
        'tgl_selesai' => 'datetime',
        'batas_registrasi' => 'datetime',
        'accept_tiket' => 'boolean',
        'accept_donasi' => 'boolean',
        'is_published' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($acara) {
            if (auth()->check()) {
                $acara->user_id = auth()->id();
                $acara->created_by = auth()->id();
                $acara->updated_by = auth()->id();
            }
        });     

        static::updating(function ($acara) {
            if (auth()->check()) {
                $acara->updated_by = auth()->id();
            }
        });  

        static::saving(function ($acara) {
            if (empty($acara->slug)) {
                $acara->slug = $acara->kategori . '-' . Str::slug($acara->judul) . '-' . Str::random(12);
            }

            // Ekstrak thumbnail dari body (TipTap)
            preg_match('/<img.+?src=["\'](.+?)["\'].*?>/i', $acara->body, $matches);
            $acara->thumbnail = $matches[1] ?? null;
        });

        static::saved(function ($acara) {
            if ($acara->user_id) {
                // Dipaksa masuk kembali ke tabel pivot polymorph jika tidak sengaja terhapus oleh sync() controller
                $acara->users()->syncWithoutDetaching([$acara->user_id]);
            }
        });        
    }

    /**
     * Relasi ke Payment (Polimorfik)
     * Pada sistem Payment Anda, pastikan menyimpan `type` transaksi (misal: 'tiket' atau 'donasi') 
     * di tabel payments agar mempermudah tracking di sisi public/admin.
     */
    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'paymentable');
    }

    /**
     * Relasi Komentar (Polimorfik)
     */
    public function komentars(): MorphMany
    {
        return $this->morphMany(Komentar::class, 'commentable');
    }

    /**
     * Relasi Reaksi (Polimorfik)
     */
    public function reaksis(): MorphMany
    {
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


    /**
     * Relasi ke Varian / Jenis Paket Tiket Acara
     */
    public function variants(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(AcaraVariant::class);
    }

public function resolveRouteBinding($value, $field = null)
{
    return $this->withoutGlobalScope('owner')
        ->where($field ?? $this->getRouteKeyName(), $value)
        ->firstOrFail();
}   

public function syncUsersSecure(array $ids)
{
    // Pastikan user_id pemilik SELALU ada di dalam array sebelum disinkronkan ke DB
    if ($this->user_id && !in_array($this->user_id, $ids)) {
        $ids[] = $this->user_id;
    }

    return $this->users()->sync($ids);
}
}