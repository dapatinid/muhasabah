<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MessageController extends Controller
{
    use SoftDeletes;

    public function store(Request $request, Conversation $conversation)
    {
        $request->validate([
            'body' => 'required|string',
        ]);

        $sender = auth()->user();
        
        // 1. Simpan pesan ke database Laravel
        $message = $conversation->messages()->create([
            'sender_id' => $sender->id,
            'body' => $request->body,
        ]);

        // Menentukan siapa penerima pesan (Audience)
        $receiverId = $conversation->user_one_id === $sender->id 
            ? $conversation->user_two_id 
            : $conversation->user_one_id;

        // 2. Push ke Supabase (Integrasi dengan skema tabel Anda)
        $this->pushToSupabaseNotification($message, $sender, $receiverId);

        return back();
    }

    private function pushToSupabaseNotification($message, $sender, $receiverId)
    {
        // 1. Ambil kredensial dari .env
        $supabaseUrl = env('SUPABASE_URL') . '/rest/v1/notifications';
        $supabaseKey = env('SUPABASE_SERVICE_KEY'); // Gunakan Service Key untuk backend
        $appId = env('SUPABASE_APP_ID', 'muhasabahid_notif'); // Ambil App ID dari .env

        $payload = [
            'app_id' => $appId, // Akan berisi: muhasabahid_notif
            'branch_id' => null, 
            'actor_id' => $sender->id,
            'audience' => (string) $receiverId,
            'type' => 'message.new',
            'notifiable_type' => 'App\Models\Message',
            'notifiable_id' => $message->id,
            'data' => [
                'conversation_id' => $message->conversation_id,
                'sender_name' => $sender->name,
                'body_preview' => \Illuminate\Support\Str::limit($message->body, 50),
            ]
        ];

        // 2. Tembak ke API Supabase
        \Illuminate\Support\Facades\Http::withHeaders([
            'apikey' => $supabaseKey,
            'Authorization' => 'Bearer ' . $supabaseKey,
            'Content-Type' => 'application/json',
            'Prefer' => 'return=minimal' // Supabase tidak perlu mengembalikan data full setelah insert
        ])->post($supabaseUrl, $payload);
    }
}