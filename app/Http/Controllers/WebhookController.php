<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleMayar(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('X-Mayar-Signature');
        $secret = env('MAYAR_WEBHOOK_SECRET');

        // 1. Validasi Keamanan
        if (empty($secret) || empty($signature)) {
            return response()->json(['message' => 'Missing Signature or Secret'], 403);
        }

        $expectedSignature = hash_hmac('sha256', $payload, $secret);
        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Mayar Webhook Gagal: Invalid Signature');
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        $data = json_decode($payload, true);

        // 2. Tangani Test Webhook
        if (isset($data['event']) && $data['event'] === 'testing') {
            return response()->json(['message' => 'Test Webhook Successful']);
        }

        // 3. TANGANI PEMBAYARAN MASUK ("payment.received")
        if (isset($data['event']) && $data['event'] === 'payment.received') {
            
            // Ambil Product ID dari Mayar
            $productId = $data['data']['productId'] ?? null;
            
            if ($productId) {
                // TRIK CERDAS: Cari transaksi yang kolom 'link'-nya mengandung Product ID ini
                $payment = Payment::where('link', 'LIKE', '%' . $productId . '%')->first();

                if ($payment && $payment->status !== 'success') {
                    
                    // A. Update Status Donasi Utama menjadi Lunas ('success')
                    $payment->update([
                        'status' => 'success',
                    ]);
                    
                    // B. Cari dan Update Infaq Sistem pasangannya
                    Payment::where('mutation_type', 'infaq_sistem')
                        ->where('created_at', $payment->created_at)
                        ->where('atas_nama', $payment->atas_nama)
                        ->where('paymentable_id', $payment->paymentable_id)
                        ->update(['status' => 'success']);

                    Log::info("Webhook Mayar: Pembayaran untuk Product ID {$productId} BERHASIL dilunaskan.");
                }
            }
        }

        // Selalu kembalikan 200 OK agar Mayar tahu kita sudah menerimanya
        return response()->json(['message' => 'Webhook Processed']);
    }
}