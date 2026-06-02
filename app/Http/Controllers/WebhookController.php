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
    $data    = json_decode($payload, true);

    Log::info('Mayar Webhook Received', ['data' => $data]);

    // Verifikasi signature jika secret diset
    $secret    = env('MAYAR_WEBHOOK_SECRET');
    $signature = $request->header('X-Mayar-Signature');
    if ($secret && $signature) {
        if (!hash_equals(hash_hmac('sha256', $payload, $secret), $signature)) {
            Log::warning('Mayar webhook: signature tidak valid');
            return response()->json(['message' => 'Invalid signature'], 401);
        }
    }

    if (isset($data['event']) && $data['event'] === 'payment.received') {

        $mayarData     = $data['data'] ?? [];
        $mayarProductId = $mayarData['productId'] ?? null;

        if (!$mayarProductId) {
            Log::warning('Mayar webhook: productId kosong', ['data' => $data]);
            return response()->json(['message' => 'productId missing'], 400);
        }

        $payment = Payment::where('transaction_id', $mayarProductId)->first();

        if ($payment && $payment->status !== 'success') {
            $payment->update([
                'status'         => 'success',
                'payment_method' => 'transfer',
                'rekening'       => 'mayar',
                'updated_at'        => $mayarData['createdAt'] ?? now(),
            ]);

            Payment::where('mutation_type', 'infaq_sistem')
                ->where('created_at', $payment->created_at)
                ->where('atas_nama', $payment->atas_nama)
                ->where('paymentable_id', $payment->paymentable_id)
                ->update([
                    'status' => 'success',
                    'payment_method' => 'transfer',
                    'rekening'       => 'mayar',
                    'updated_at'        => $mayarData['createdAt'] ?? now(),
                    ]);

            Log::info('Payment sukses via Mayar', [
                'payment_id'        => $payment->id,
                'mayar_product_id'  => $mayarProductId,
                'payment_method'    => $mayarData['paymentMethod'] ?? '-',
                'customer_name'     => $mayarData['customerName'] ?? '-',
                'amount'            => $mayarData['amount'] ?? 0,
            ]);
        } else {
            Log::warning('Mayar webhook: payment tidak ditemukan atau sudah success', [
                'mayar_product_id' => $mayarProductId,
            ]);
        }
    }

    return response()->json(['message' => 'Success'], 200);
}   

}