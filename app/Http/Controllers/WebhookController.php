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

        Log::info('Mayar Webhook Received', ['data' => $data]); // ← Bantu debug

        if (isset($data['event']) && $data['event'] === 'payment.received') {
            $referenceId = $data['data']['reference_id'] ?? null;

            if (!$referenceId) {
                Log::warning('Mayar webhook: reference_id kosong', ['data' => $data]);
                return response()->json(['message' => 'reference_id missing'], 400);
            }

            $payment = Payment::find($referenceId);

            if ($payment && $payment->status !== 'success') {
                $payment->update(['status' => 'success']);

                Payment::where('mutation_type', 'infaq_sistem')
                    ->where('created_at', $payment->created_at)
                    ->where('atas_nama', $payment->atas_nama)
                    ->where('paymentable_id', $payment->paymentable_id)
                    ->update(['status' => 'success']);

                Log::info('Payment sukses via Mayar', ['payment_id' => $payment->id]);
            }
        }

        return response()->json(['message' => 'Success'], 200);
    }

}