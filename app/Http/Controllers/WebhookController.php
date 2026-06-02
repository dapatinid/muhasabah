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
            
            if (isset($data['event']) && $data['event'] === 'payment.received') {
                $transactionId = $data['data']['transactionId'] ?? null;

                if ($transactionId) {
                    // CARI BERDASARKAN ID YANG KITA SIMPAN TADI
                    $payment = Payment::where('transaction_id', $transactionId)->first();

                    if ($payment && $payment->status !== 'success') {
                        $payment->update(['status' => 'success']);
                        
                        // Update Infaq Pasangan
                        Payment::where('mutation_type', 'infaq_sistem')
                            ->where('created_at', $payment->created_at)
                            ->where('atas_nama', $payment->atas_nama)
                            ->where('paymentable_id', $payment->paymentable_id)
                            ->update(['status' => 'success']);
                    }
                }
            }
            
            return response()->json(['message' => 'Success'], 200);
        }   
}