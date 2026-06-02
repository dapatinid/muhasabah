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

            // 1. Verifikasi Keamanan
            if (empty($secret) || empty($signature)) {
                return response()->json(['message' => 'Missing Signature or Secret'], 200); 
            }

            $expectedSignature = hash_hmac('sha256', $payload, $secret);
            if (!hash_equals($expectedSignature, $signature)) {
                Log::error('WEBHOOK DITOLAK: Signature tidak cocok!');
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            $data = json_decode($payload, true);
            $event = $data['event'] ?? '';
            $mayarStatus = $data['data']['status'] ?? '';

            if ($event === 'testing') {
                return response()->json(['message' => 'Test Webhook Successful'], 200);
            }

            // 3. TANGANI PEMBAYARAN MASUK
            if ($event === 'payment.received' && $mayarStatus === 'SUCCESS') {
                
                // Ambil deskripsi yang sudah kita selipkan ID
                $description = $data['data']['productDescription'] ?? '';
                
                // EKSTRAK ID menggunakan Regex (Mencari angka setelah teks "REF-")
                preg_match('/REF-(\d+)/', $description, $matches);
                
                if (isset($matches[1])) {
                    $paymentId = $matches[1];
                    $payment = Payment::find($paymentId);

                    if ($payment) {
                        // LUNASKAN DONASI UTAMA
                        $payment->update(['status' => 'success']);
                        
                        // LUNASKAN INFAQ PASANGANNYA
                        Payment::where('mutation_type', 'infaq_sistem')
                            ->where('created_at', $payment->created_at)
                            ->where('atas_nama', $payment->atas_nama)
                            ->where('paymentable_id', $payment->paymentable_id)
                            ->update(['status' => 'success']);

                        Log::info("WEBHOOK SUKSES: Transaksi REF-{$paymentId} berhasil Lunas.");
                        return response()->json(['message' => 'Payment updated successfully'], 200);
                    } else {
                        Log::error("WEBHOOK GAGAL: Payment ID {$paymentId} tidak ditemukan di database.");
                    }
                } else {
                    Log::error("WEBHOOK GAGAL: Tidak menemukan kode REF- pada deskripsi: {$description}");
                }
            }

            return response()->json(['message' => 'Event ignored'], 200);

        } catch (\Exception $e) {
            Log::error('WEBHOOK FATAL ERROR: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}