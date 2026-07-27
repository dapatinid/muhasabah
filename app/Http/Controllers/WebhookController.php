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

            // 1. AMBIL SECRET DARI .ENV ATAU CONFIG
            $secret = env('MAYAR_WEBHOOK_SECRET') ?? config('services.mayar.webhook_secret');

            // 2. CEK MULTI-HEADER SIGNATURE (Antisipasi perbedaan nama header dari Mayar)
            $signature = $request->header('X-Mayar-Signature')
                      ?? $request->header('X-Callback-Signature')
                      ?? $request->header('X-Mayar-Token')
                      ?? $request->header('X-Callback-Token');

            // Jika secret atau signature tidak ditemukan, log seluruh header untuk bahan debug
            if (!$secret || !$signature) {
                Log::warning('Mayar Webhook Ditolak: Secret atau Signature tidak ditemukan.', [
                    'secret_exists'    => !empty($secret),
                    'signature_exists' => !empty($signature),
                    'received_headers' => $request->headers->all() // 🔥 Log semua header agar tahu apa yang dikirim Mayar
                ]);
                return response()->json(['message' => 'Missing Auth'], 200); 
            }

            // 3. VERIFIKASI SIGNATURE
            if (!hash_equals(hash_hmac('sha256', $payload, $secret), $signature)) {
                Log::warning('Mayar Webhook Ditolak: Signature tidak valid!');
                return response()->json(['message' => 'Invalid signature'], 403);
            }

            // 4. TANGANI EVENT TESTING DARI DASHBOARD MAYAR
            if (isset($data['event']) && $data['event'] === 'testing') {
                return response()->json(['message' => 'Test Webhook Successful'], 200);
            }

            // 5. TANGANI EVENT PEMBAYARAN DITERIMA
            if (isset($data['event']) && $data['event'] === 'payment.received') {
                
                $mayarData   = $data['data'] ?? [];
                $mayarStatus = strtoupper($mayarData['status'] ?? '');

                if ($mayarStatus === 'SUCCESS' || $mayarStatus === 'PAID') {
                    
                    // A. Ambil ID Link (di Mayar disebut productId / paymentLinkId)
                    $linkId = $mayarData['productId'] ?? $mayarData['paymentLinkId'] ?? $mayarData['invoiceId'] ?? null;

                    // B. Ambil ID Transaksi Asli Mayar
                    $transactionId = $mayarData['transactionId'] ?? $mayarData['id'] ?? null;

                    // C. Ekstrak ID Payment Anda dari customerEmail (contoh: donatur_8@muhasabah.id -> angka 8)
                    $paymentIdFromEmail = null;
                    if (isset($mayarData['customerEmail']) && preg_match('/^donatur_(\d+)@/', $mayarData['customerEmail'], $matches)) {
                        $paymentIdFromEmail = $matches[1];
                    }

                    // D. Cari Transaksi Utama di Database
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

                        // E. Update Transaksi Utama
                        $payment->update([
                            'status'         => 'success',
                            'transaction_id' => $transactionId ?? $payment->transaction_id,
                            'payment_method' => 'transfer',
                            'rekening'       => 'Mayar - ' . $metodeMayar,
                            'updated_at'     => $waktuPembayaran,
                        ]);

                        // F. 🔥 Update Juga Infaq Sistem Pasangannya (Jika Ada)
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

                        Log::info("Webhook Mayar SUKSES: Transaksi ID {$payment->id} berhasil dilunaskan.", [
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
            Log::error('Webhook Mayar ERROR FATAL: ' . $e->getMessage());
            return response()->json(['error' => 'Server error'], 500);
        }
    }
}