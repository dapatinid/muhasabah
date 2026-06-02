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

        // 1. Proteksi Error 500: Cek apakah secret & signature ada
        if (empty($secret) || empty($signature)) {
            Log::warning('Mayar Webhook: Secret atau Signature kosong (Cek .env)');
            return response()->json(['message' => 'Missing Signature or Secret'], 403);
        }

        // 2. Verifikasi keaslian webhook
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Mayar Webhook Gagal: Invalid Signature');
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        $data = json_decode($payload, true);

        // 3. Tangani event "testing" dari tombol "Test URL" Mayar
        if (isset($data['event']) && $data['event'] === 'testing') {
            Log::info('Webhook Mayar: Test koneksi berhasil diterima.');
            return response()->json(['message' => 'Test Webhook Successful']);
        }

        // 4. Tangani event pembayaran sukses
        if (isset($data['event']) && $data['event'] === 'payment.success') {
            $paymentId = $data['data']['reference_id'] ?? null;
            
            if ($paymentId) {
                $payment = Payment::find($paymentId);

                if ($payment && $payment->status !== 'paid') {
                    $payment->update([
                        'status' => 'paid',
                    ]);
                    Log::info("Webhook Mayar: Pembayaran ID {$paymentId} Lunas.");
                }
            }
        }

        return response()->json(['message' => 'Webhook Processed']);
    }
}