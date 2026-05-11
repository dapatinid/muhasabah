<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Komentar extends Model
{
    protected $fillable = ['user_id', 'body', 'commentable_id', 'commentable_type', 'parent_id'];

    // Relasi balik ke model asal (Kalam, dll)
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Mendapatkan semua balasan (anak) dari komentar ini
     */
    public function replies()
    {
        return $this->hasMany(Komentar::class, 'parent_id')->orderBy('created_at', 'asc');
    }

    /**
     * Mendapatkan induk dari komentar ini (jika ada)
     */
    public function parent()
    {
        return $this->belongsTo(Komentar::class, 'parent_id');
    }    
}