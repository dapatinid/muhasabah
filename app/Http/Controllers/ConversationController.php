<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConversationController extends Controller
{
    // Membuka halaman list chat (Inbox)
    public function index(Request $request)
    {
        $userId = auth()->id();
        
        // 1. JIKA CHAT DIBUKA, UPDATE DATABASE DI AWAL 
        // Ini memastikan saat kueri list inbox berjalan di bawah, statusnya sudah murni "terbaca" (0)
        if ($request->has('chat')) {
            $chatId = $request->query('chat');
            Message::where('conversation_id', $chatId)
                ->where('sender_id', '!=', $userId)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        // 2. Ambil semua obrolan yang melibatkan user ini
        $conversations = Conversation::where('user_one_id', $userId)
            ->orWhere('user_two_id', $userId)
            ->with(['userOne', 'userTwo', 'messages' => function($q) {
                $q->latest()->limit(1); // Preview pesan terakhir
            }])
            ->get()
            ->map(function($conv) use ($userId) {
                $otherUser = $conv->user_one_id == $userId ? $conv->userTwo : $conv->userOne;
                
                // Hitung pesan masuk yang belum dibaca (Otomatis bernilai 0 jika room ini sedang dibuka)
                $unreadCount = $conv->messages()
                    ->where('sender_id', '!=', $userId)
                    ->whereNull('read_at')
                    ->count();

                $lastMessageTime = $conv->messages->first() 
                    ? $conv->messages->first()->created_at 
                    : $conv->created_at;

                return [
                    'id' => $conv->id,
                    'user' => $otherUser->only(['id', 'name', 'avatar', 'gender', 'last_seen_at']),
                    'last_message' => $conv->messages->first(),
                    'unread_count' => $unreadCount,
                    'last_message_time' => $lastMessageTime,
                ];
            })
            // Urutkan cerdas: ada unread naik, lalu urutkan berdasarkan pesan paling baru
            ->sort(function ($a, $b) {
                if ($a['unread_count'] !== $b['unread_count']) {
                    return $b['unread_count'] <=> $a['unread_count'];
                }
                return $b['last_message_time'] <=> $a['last_message_time'];
            })
            ->values();

        $activeChat = null;
        $messages = [];

        // 3. Ambil riwayat data pesan untuk Drawer
        if ($request->has('chat')) {
            $chatId = $request->query('chat');
            $activeChat = $conversations->firstWhere('id', $chatId);
            
            if ($activeChat) {
                $messages = Conversation::find($chatId)->messages()->with('sender:id,name')->get();
            }
        }

        return Inertia::render('Obrolan', [
            'conversations' => $conversations,
            'activeChat' => $activeChat,
            'messages' => $messages
        ]);
    }

    // Memulai chat baru atau membuka chat lama (dari tombol Kirim Pesan)
    public function getOrCreate(Request $request)
    {
        $request->validate(['user_id' => 'required|exists:users,id']);
        $userId = auth()->id();
        $otherUserId = $request->user_id;

        if ($userId == $otherUserId) {
            return back()->with('error', 'Tidak bisa mengirim pesan ke diri sendiri.');
        }

        // Cari ruang obrolan (karena ID terkecil selalu di user_one_id, pencarian lebih mudah jika Anda setel begitu, atau pakai query ganda)
        $conversation = Conversation::where(function($q) use ($userId, $otherUserId) {
            $q->where('user_one_id', $userId)->where('user_two_id', $otherUserId);
        })->orWhere(function($q) use ($userId, $otherUserId) {
            $q->where('user_one_id', $otherUserId)->where('user_two_id', $userId);
        })->first();

        // Jika belum ada, buat baru
        if (!$conversation) {
            $conversation = Conversation::create([
                'user_one_id' => min($userId, $otherUserId),
                'user_two_id' => max($userId, $otherUserId)
            ]);
        }

        // Arahkan ke halaman Obrolan dan langsung buka drawer chat tersebut
        return redirect()->route('obrolan.index', ['chat' => $conversation->id]);
    }

    // Fetch isi pesan untuk drawer
    public function messages(Conversation $conversation)
    {
        // Pastikan user adalah bagian dari obrolan
        if ($conversation->user_one_id !== auth()->id() && $conversation->user_two_id !== auth()->id()) {
            abort(403);
        }

        return response()->json(
            $conversation->messages()->with('sender:id,name')->get()
        );
    }
}