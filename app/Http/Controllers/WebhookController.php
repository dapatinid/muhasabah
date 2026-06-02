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

        // Verifikasi keaslian webhook
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Mayar Webhook Gagal: Invalid Signature');
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        $data = json_decode($payload, true);
        Log::info('Webhook Mayar Berhasil Masuk', ['id' => $data['data']['id'] ?? '']);

        if ($data['event'] === 'payment.success') {
            // Reference ID ini adalah ID Payment Anda yang dikirim di Step 2
            $paymentId = $data['data']['reference_id'];
            
            $payment = Payment::find($paymentId);

            if ($payment && $payment->status !== 'paid') {
                $payment->update([
                    'status' => 'paid',
                    // Optional: 'image' => $data['data']['receipt_url'] jika ingin nyimpan setruk dari Mayar
                ]);
            }
        }

        return response()->json(['message' => 'Webhook Processed']);
    }
}