<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Challenge extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Properti yang dapat diisi secara massal (mass assignable).
     *
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'difficulty',
        'image',
        'created_by',
        'updated_by',
    ];

    public function challengevariant()
    {
        return $this->hasMany(ChallengeVariant::class);
    }
    public function progresses()
    {
        return $this->hasMany(ChallengeProgress::class);
    }
    public function userCre(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function userUpd(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

}
