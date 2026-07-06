<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kalam extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'judul',
        'slug',
        'body',
        'kategori',
        'thumbnail',
        'is_published',
        'is_anonymous',
        'created_by', // Tambahkan ke fillable
        'updated_by', // Tambahkan ke fillable
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_anonymous' => 'boolean',
    ];   

    /**
     * Boot function untuk menangani logic otomatis
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($kalam) {
            if (auth()->check()) {
                $kalam->user_id = auth()->id();
                $kalam->created_by = auth()->id();
                $kalam->updated_by = auth()->id();
            }
        });      

        static::updating(function ($kalam) {
            if (auth()->check()) {
                $kalam->updated_by = auth()->id();
            }
        });     

        static::saving(function ($kalam) {
            // 1. Auto-generate slug jika kosong
            if (empty($kalam->slug)) {
                $kalam->slug = Str::slug($kalam->judul) . '-' . Str::random(12);
            }

            // 2. Ekstrak gambar pertama dari body untuk thumbnail
            preg_match('/<img.+?src=["\'](.+?)["\'].*?>/i', $kalam->body, $matches);
            $kalam->thumbnail = $matches[1] ?? null;
        });    
        
        static::saved(function ($kalam) {
            if ($kalam->user_id) {
                // Dipaksa masuk kembali ke tabel pivot polymorph jika tidak sengaja terhapus oleh sync() controller
                $kalam->authors()->syncWithoutDetaching([$kalam->user_id]);
            }
        });
    } 

    /**
     * Relasi ke penulis asli (User)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function users()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
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

    public function komentars()
    {
        return $this->morphMany(Komentar::class, 'commentable');
    }

    public function reaksis()
    {
        return $this->morphMany(Reaksi::class, 'reaktiable');
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