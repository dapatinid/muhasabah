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

        // 1. Validasi Keamanan Dasar
        if (empty($secret) || empty($signature)) {
            Log::warning('Mayar Webhook: Secret atau Signature kosong');
            return response()->json(['message' => 'Missing Signature or Secret'], 403);
        }

        // 2. Verifikasi HMAC SHA256
        $expectedSignature = hash_hmac('sha256', $payload, $secret);
        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Mayar Webhook Gagal: Invalid Signature');
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        $data = json_decode($payload, true);

        // 3. Tangani Test Webhook dari Dashboard Mayar
        if (isset($data['event']) && $data['event'] === 'testing') {
            return response()->json(['message' => 'Test Webhook Successful']);
        }

        // 4. Tangani Pembayaran Sukses
        if (isset($data['event']) && $data['event'] === 'payment.success') {
            $paymentId = $data['data']['reference_id'] ?? null;
            
            if ($paymentId) {
                // Cari Donasi Utama
                $payment = Payment::find($paymentId);

                if ($payment && $payment->status !== 'success') {
                    // A. Update Status Donasi Utama menjadi 'success' (Bukan 'paid')
                    $payment->update([
                        'status' => 'success',
                    ]);
                    
                    // B. Cari dan Update Infaq Sistem pasangannya (Jika ada)
                    Payment::where('mutation_type', 'infaq_sistem')
                        ->where('created_at', $payment->created_at)
                        ->where('atas_nama', $payment->atas_nama)
                        ->where('paymentable_id', $payment->paymentable_id)
                        ->update(['status' => 'success']);

                    Log::info("Webhook Mayar: Pembayaran ID {$paymentId} & Infaq berhasil dilunaskan.");
                }
            }
        }

        return response()->json(['message' => 'Webhook Processed']);
    }
}