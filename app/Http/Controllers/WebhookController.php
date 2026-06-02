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
            if (empty($secret)) {
                Log::error('WEBHOOK GAGAL: MAYAR_WEBHOOK_SECRET di .env kosong!');
                // Tetap kembalikan 200 OK sementara agar Mayar tidak spam error, tapi kita tahu salahnya di .env
                return response()->json(['message' => 'Secret empty but ignored for debug'], 200); 
            }

            if ($signature) {
                $expectedSignature = hash_hmac('sha256', $payload, $secret);
                if (!hash_equals($expectedSignature, $signature)) {
                    Log::error('WEBHOOK DITOLAK: Signature tidak cocok! Pastikan secret sama dengan di Dashboard Mayar.');
                    return response()->json(['message' => 'Invalid signature'], 403);
                }
            }

            $data = json_decode($payload, true);
            $event = $data['event'] ?? '';
            $mayarStatus = $data['data']['status'] ?? '';
            $productId = $data['data']['productId'] ?? null;

            // 2. Tangani Test URL
            if ($event === 'testing') {
                return response()->json(['message' => 'Test Webhook Successful'], 200);
            }

            // 3. Tangani Pembayaran Sukses (PERBAIKAN LOGIKA DISINI)
            if ($event === 'payment.received' && $mayarStatus === 'SUCCESS') {
                if ($productId) {
                    // Cari transaksi yang link-nya mengandung ProductID ini
                    $payment = Payment::where('link', 'LIKE', '%' . $productId . '%')->first();

                    if ($payment) {
                        // LUNASKAN DONASI UTAMA
                        $payment->update(['status' => 'success']);
                        
                        // LUNASKAN INFAQ PASANGANNYA
                        Payment::where('mutation_type', 'infaq_sistem')
                            ->where('created_at', $payment->created_at)
                            ->where('atas_nama', $payment->atas_nama)
                            ->where('paymentable_id', $payment->paymentable_id)
                            ->update(['status' => 'success']);

                        Log::info("WEBHOOK SUKSES: Transaksi dengan ProductID {$productId} berhasil Lunas.");
                        return response()->json(['message' => 'Payment updated successfully'], 200);
                    } else {
                        Log::error("WEBHOOK GAGAL: Tidak menemukan transaksi dengan ProductID {$productId}");
                        return response()->json(['message' => 'Payment not found in database'], 200);
                    }
                }
            }

            return response()->json(['message' => 'Event ignored'], 200);

        } catch (\Exception $e) {
            Log::error('WEBHOOK FATAL ERROR: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}