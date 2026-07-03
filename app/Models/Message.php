<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    // 1. Izinkan Mass Assignment
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'body',
        'read_at',
    ];

    // 2. Relasi balik ke Conversation
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    // 3. Relasi ke User (Pengirim)
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}