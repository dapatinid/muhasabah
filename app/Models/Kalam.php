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
    ];

    /**
     * Boot function untuk auto-generate slug dari judul
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($kalam) {
            if (empty($kalam->slug)) {
                $kalam->slug = Str::slug($kalam->judul) . '-' . Str::random(5);
            }
        });
    }

    /**
     * Relasi ke penulis (User)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
}