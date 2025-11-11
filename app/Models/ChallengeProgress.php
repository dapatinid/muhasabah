<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChallengeProgress extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'date',
        'user_id',
        'challenge_id',
        'challenge_variant_id',
        'submitted_value',
        'earned_score',
        'note',
    ];

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }
        public function challengeVariant()
    {
        return $this->belongsTo(ChallengeVariant::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
