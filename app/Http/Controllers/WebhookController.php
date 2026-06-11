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
                $mayarStatus = $mayarData['status'] ?? '';
                
                // Ambil ID yang tepat dari Payload Mayar
                $transactionId = $mayarData['transactionId'] ?? null;
                $referenceId   = $mayarData['reference_id'] ?? null;

                if ($mayarStatus === 'SUCCESS') {
                    $payment = null;

                    // PRIORITAS 1: Cari menggunakan reference_id (ID asli tabel Payment kita)
                    if ($referenceId) {
                        $payment = Payment::find($referenceId);
                    } 
                    // PRIORITAS 2: Fallback mencari menggunakan transaction_id Mayar
                    if (!$payment && $transactionId) {
                        $payment = Payment::where('transaction_id', $transactionId)->first();
                    }

                    // Jika Transaksi Ditemukan dan Belum Lunas
                    if ($payment && $payment->status !== 'success') {
                        
                        // Parse format ISO Mayar ke format standard MySQL
                        $waktuPembayaran = isset($mayarData['createdAt']) 
                            ? Carbon::parse($mayarData['createdAt'])->format('Y-m-d H:i:s') 
                            : now();
                        
                        // Nama metode pembayaran dari Mayar (misal: QRIS, VA Mandiri)
                        $metodeMayar = $mayarData['paymentMethod'] ?? 'Otomatis';

                        // A. LUNASKAN TRANSAKSI UTAMA (Berlaku untuk Donasi, Tiket Acara, & Sponsor)
                        $payment->update([
                            'status'         => 'success',
                            'payment_method' => 'transfer',
                            'rekening'       => 'Mayar - ' . $metodeMayar,
                            'updated_at'     => $waktuPembayaran,
                        ]);

                        // B. LUNASKAN INFAQ PASANGAN (Eksklusif hanya untuk Donasi)
                        if ($payment->mutation_type === 'donasi_utama') {
                            Payment::where('mutation_type', 'infaq_sistem')
                                ->where('paymentable_type', $payment->paymentable_type) // Kunci polimorfik
                                ->where('paymentable_id', $payment->paymentable_id)
                                ->where('created_at', $payment->created_at)
                                ->where('atas_nama', $payment->atas_nama)
                                ->update([
                                    'status'         => 'success',
                                    'payment_method' => 'transfer',
                                    'rekening'       => 'Mayar - ' . $metodeMayar,
                                    'updated_at'     => $waktuPembayaran,
                                ]);
                        }

                        Log::info("Webhook Mayar SUKSES: Transaksi ID {$payment->id} berhasil dilunaskan.", [
                            'transaction_id' => $transactionId,
                            'customer'       => $mayarData['customerName'] ?? '-',
                            'amount'         => $mayarData['amount'] ?? 0,
                            'method'         => $metodeMayar
                        ]);

                        return response()->json(['message' => 'Success'], 200);

                    } else {
                        Log::warning('Webhook Mayar: Transaksi tidak ditemukan di database atau sudah berstatus success.', [
                            'reference_id'   => $referenceId,
                            'transaction_id' => $transactionId
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