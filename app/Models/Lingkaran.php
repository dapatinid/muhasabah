<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes; // Import trait SoftDeletes

class Lingkaran extends Model
{
    use SoftDeletes; // Aktifkan Soft Deletes

    // Daripada menulis $fillable panjang-panjang, $guarded = ['id'] berarti semua kolom boleh diisi KECUALI id
    protected $guarded = ['id'];

    /**
     * Boot function untuk menangani logic otomatis
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($lingkaran) {
            if (auth()->check()) {
                $lingkaran->created_by = auth()->id();
                $lingkaran->updated_by = auth()->id();
            }
        });

        static::updating(function ($lingkaran) {
            if (auth()->check()) {
                $lingkaran->updated_by = auth()->id();
            }
        });

        static::deleting(function ($lingkaran) {
            if (auth()->check()) {
                $lingkaran->deleted_by = auth()->id();
                // 🌟 PAKSA SIMPAN KE DATABASE SEBELUM SOFT DELETE BERJALAN
                // saveQuietly() digunakan agar tidak memicu event 'updating' secara tidak sengaja
                $lingkaran->saveQuietly(); 
            }
        });        
    }    

    /**
     * Relasi Many-to-Many ke User (Anggota Lingkaran)
     */
    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    /**
     * Relasi Polymorphic One-to-Many ke Rating
     */
    public function ratings()
    {
        return $this->morphMany(Rating::class, 'rateable');
    }

    /**
     * Relasi ke pembuat record (Audit)
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke pengubah terakhir (Audit)
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Relasi ke penghapus record (Audit)
     */
    public function deleter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}