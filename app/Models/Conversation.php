<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    // 1. Izinkan Mass Assignment
    protected $fillable = [
        'user_one_id',
        'user_two_id',
    ];

    // 2. Relasi ke User Pertama
    public function userOne()
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    // 3. Relasi ke User Kedua
    public function userTwo()
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    // 4. Relasi ke tabel Messages
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}