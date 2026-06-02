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
        $data = json_decode($payload, true);

        Log::info('Mayar Webhook Received', ['data' => $data]);

        if (isset($data['event']) && $data['event'] === 'payment.received') {
            
            $mayarProductId = $data['data']['productId'] ?? null;

            if (!$mayarProductId) {
                Log::warning('Mayar webhook: productId kosong', ['data' => $data]);
                return response()->json(['message' => 'productId missing'], 400);
            }

            // Match via transaction_id yang kita simpan saat generateMayarLink
            $payment = Payment::where('transaction_id', $mayarProductId)->first();

            if ($payment && $payment->status !== 'success') {
                $payment->update(['status' => 'success']);

                Payment::where('mutation_type', 'infaq_sistem')
                    ->where('created_at', $payment->created_at)
                    ->where('atas_nama', $payment->atas_nama)
                    ->where('paymentable_id', $payment->paymentable_id)
                    ->update(['status' => 'success']);

                Log::info('Payment sukses via Mayar', [
                    'payment_id'   => $payment->id,
                    'mayar_product_id' => $mayarProductId,
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