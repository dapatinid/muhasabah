<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChallengeVariant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'challenge_id',
        'name',
        'score',
        'is_manual_input',
        'minimum_value',
        'created_by',
        'updated_by',
    ];
    
    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_manual_input' => 'boolean',
        ];
    }

    /**
     * Relasi: Varian ini dimiliki oleh satu Tantangan.
     */
    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
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
