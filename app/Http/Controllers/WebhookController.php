<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleMayar(Request $request)
    {
        try {
            $payload = $request->getContent();
            $signature = $request->header('X-Mayar-Signature');
            $secret = env('MAYAR_WEBHOOK_SECRET');

            if (empty($secret) || empty($signature)) {
                return response()->json(['message' => 'Missing Auth'], 200); 
            }

            if (!hash_equals(hash_hmac('sha256', $payload, $secret), $signature)) {
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            $data = json_decode($payload, true);
            $event = $data['event'] ?? '';
            $mayarStatus = $data['data']['status'] ?? '';

            if ($event === 'testing') {
                return response()->json(['message' => 'Test Webhook Successful'], 200);
            }

            // TANGANI PEMBAYARAN MASUK
            if ($event === 'payment.received' && $mayarStatus === 'SUCCESS') {
                $productId = $data['data']['productId'] ?? null;
                $payment = null;

                if ($productId) {
                    // PERBAIKAN: Gunakan pencocokan string yang lebih bersih
                    // Kita cari pembayaran yang link-nya memiliki suffix #productId
                    $payment = Payment::where('link', 'LIKE', '%' . $productId)->first();
                    
                    // Jika masih tidak ketemu, kita coba cari berdasarkan link mengandung string tersebut (tanpa #)
                    if (!$payment) {
                        $payment = Payment::where('link', 'LIKE', '%' . $productId . '%')->first();
                    }
                }

                // Lapis Keamanan ke-2: Jika Cara 1 tetap gagal, cari lewat Deskripsi (REF-ID)
                if (!$payment) {
                    $description = $data['data']['productDescription'] ?? '';
                    preg_match('/REF-(\d+)/', $description, $matches);
                    if (isset($matches[1])) {
                        $payment = Payment::find($matches[1]);
                    }
                }

                // EKSEKUSI UPDATE DATABASE
                if ($payment && $payment->status !== 'success') {
                    // Update Donasi Utama
                    $payment->update(['status' => 'success']);
                    
                    // Update Infaq Pasangannya
                    Payment::where('mutation_type', 'infaq_sistem')
                        ->where('created_at', $payment->created_at)
                        ->where('atas_nama', $payment->atas_nama)
                        ->where('paymentable_id', $payment->paymentable_id)
                        ->update(['status' => 'success']);

                    Log::info("WEBHOOK SUKSES: Transaksi ID {$payment->id} otomatis LUNAS.");
                    return response()->json(['message' => 'Success'], 200);
                }
            }

            return response()->json(['message' => 'Event ignored'], 200);

        } catch (\Exception $e) {
            Log::error('WEBHOOK ERROR: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}