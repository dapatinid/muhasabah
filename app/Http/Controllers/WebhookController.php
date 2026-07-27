<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class WebhookController extends Controller
{
    public function handleMayar(Request $request)
    {
        try {
            $payload = $request->getContent();
            $data    = json_decode($payload, true);

            // 1. Verifikasi Keamanan & Signature
            $secret    = env('MAYAR_WEBHOOK_SECRET');
            $signature = $request->header('X-Mayar-Signature');

            if (!$secret || !$signature) {
                Log::warning('Mayar Webhook Ditolak: Secret atau Signature tidak ditemukan.');
                return response()->json(['message' => 'Missing Auth'], 200); 
            }

            if (!hash_equals(hash_hmac('sha256', $payload, $secret), $signature)) {
                Log::warning('Mayar Webhook Ditolak: Signature tidak valid!');
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            // 2. Tangani Uji Coba dari Dashboard Mayar
            if (isset($data['event']) && $data['event'] === 'testing') {
                return response()->json(['message' => 'Test Webhook Successful'], 200);
            }

            // 3. Tangani Event Pembayaran Diterima
            if (isset($data['event']) && $data['event'] === 'payment.received') {
                
                $mayarData   = $data['data'] ?? [];
                $mayarStatus = strtoupper($mayarData['status'] ?? '');

                if ($mayarStatus === 'SUCCESS' || $mayarStatus === 'PAID') {
                    
                    // 1. Ambil ID Link Mayar (di DB tersimpan di kolom transaction_id)
                    // Pada webhook Mayar, ID ini berada pada field 'productId' atau 'paymentLinkId'
                    $linkId = $mayarData['productId'] ?? $mayarData['paymentLinkId'] ?? $mayarData['invoiceId'] ?? null;

                    // 2. Ambil Transaction ID asli dari pembayaran Mayar
                    $transactionId = $mayarData['transactionId'] ?? $mayarData['id'] ?? null;

                    // 3. CADANGAN AKURAT: Ekstrak ID Payment dari customerEmail (contoh: donatur_4@muhasabah.id -> angka 4)
                    $paymentIdFromEmail = null;
                    if (isset($mayarData['customerEmail']) && preg_match('/^donatur_(\d+)@/', $mayarData['customerEmail'], $matches)) {
                        $paymentIdFromEmail = $matches[1];
                    }

                    // 4. Cari transaksi di Database
                    $payment = Payment::where(function ($query) use ($linkId, $transactionId, $paymentIdFromEmail) {
                            if ($linkId) {
                                $query->orWhere('transaction_id', $linkId);
                            }
                            if ($transactionId) {
                                $query->orWhere('transaction_id', $transactionId);
                            }
                            if ($paymentIdFromEmail) {
                                $query->orWhere('id', $paymentIdFromEmail);
                            }
                        })
                        ->where(function ($q) {
                            $q->whereNull('status')->orWhere('status', '!=', 'success');
                        })
                        ->first();

                    if ($payment) {
                        $waktuPembayaran = isset($mayarData['updatedAt']) 
                            ? Carbon::parse($mayarData['updatedAt'])->setTimezone('Asia/Jakarta') 
                            : now();
                        
                        $metodeMayar = $mayarData['paymentMethod'] ?? 'QRIS';

                        // A. Update Status Payment Utama (Donasi/Tiket/Sponsor)
                        $payment->update([
                            'status'         => 'success',
                            'transaction_id' => $transactionId ?? $payment->transaction_id, // Timpa dengan ID transaksi asli Mayar
                            'payment_method' => 'transfer',
                            'rekening'       => 'Mayar - ' . $metodeMayar,
                            'updated_at'     => $waktuPembayaran,
                        ]);

                        // B. 🔥 UPDATE JUGA INFAQ SISTEM PASANGANNYA (Jika Ada)
                        // Karena saat generateMayarLink infaq digabungkan ke total tagihan,
                        // maka saat lunas, baris infaq pasangannya juga harus di-success-kan!
                        Payment::where('mutation_type', 'infaq_sistem')
                            ->where('paymentable_type', $payment->paymentable_type)
                            ->where('paymentable_id', $payment->paymentable_id)
                            ->where('created_at', $payment->created_at)
                            ->where('atas_nama', $payment->atas_nama)
                            ->where(function($q) {
                                $q->whereNull('status')->orWhere('status', '!=', 'success');
                            })
                            ->update([
                                'status'         => 'success',
                                'transaction_id' => $transactionId ?? $payment->transaction_id,
                                'payment_method' => 'transfer',
                                'rekening'       => 'Mayar - ' . $metodeMayar,
                                'updated_at'     => $waktuPembayaran,
                            ]);

                        Log::info("Webhook Mayar SUKSES: Transaksi ID {$payment->id} (dan infaq pasangannya) berhasil dilunaskan.", [
                            'transaction_id' => $transactionId,
                            'product_id'     => $linkId,
                            'customer'       => $mayarData['customerName'] ?? '-',
                            'amount'         => $mayarData['amount'] ?? 0,
                            'method'         => $metodeMayar
                        ]);

                        return response()->json(['message' => 'Success'], 200);

                    } else {
                        Log::warning('Webhook Mayar: Transaksi tidak ditemukan di database atau sudah berstatus success.', [
                            'product_id'     => $linkId,
                            'transaction_id' => $transactionId,
                            'email_id'       => $paymentIdFromEmail
                        ]);
                    }
                }
            }           

            return response()->json(['message' => 'Event ignored'], 200);

        } catch (\Exception $e) {
            // Blok ini menyelamatkan Anda dari pesan error 500 yang ambigu jika ada typo/salah data di masa depan
            Log::error('Webhook Mayar ERROR FATAL: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}