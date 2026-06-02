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

        // 1. PASANG CCTV (Catat semua yang masuk ke storage/logs/laravel.log)
        Log::info('--- MAYAR WEBHOOK MASUK ---');
        Log::info('Signature: ' . $signature);
        Log::info('Payload JSON: ' . $payload);

        if (empty($secret) || empty($signature)) {
            Log::warning('Ditolak: Secret atau Signature kosong');
            return response()->json(['message' => 'Missing Signature'], 403);
        }

        $expectedSignature = hash_hmac('sha256', $payload, $secret);
        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning('Ditolak: Signature Tidak Cocok!');
            return response()->json(['message' => 'Invalid Signature'], 403);
        }

        $data = json_decode($payload, true);
        $event = $data['event'] ?? '';
        $transactionStatus = $data['data']['transactionStatus'] ?? '';

        // 2. TANGANI TEST URL
        if ($event === 'testing') {
            return response()->json(['message' => 'Test Webhook Successful']);
        }

        // 3. IDENTIFIKASI TRANSAKSI
        $productId = $data['data']['productId'] ?? null;
        $referenceId = $data['data']['reference_id'] ?? null;

        $payment = null;

        // Cari berdasarkan Reference ID (jika Mayar mengirimkannya)
        if ($referenceId) {
            $payment = Payment::find($referenceId);
        } 
        // Jika tidak, cari berdasarkan Product ID yang ada di dalam Link
        elseif ($productId) {
            $payment = Payment::where('link', 'LIKE', '%' . $productId . '%')->first();
        }

        // 4. EKSEKUSI PELUNASAN
        if ($payment) {
            // Cek apakah status transaksi dari Mayar menandakan uang benar-benar sudah masuk
            // Mayar biasanya menggunakan: paid, settlement, success, atau completed
            if (in_array($transactionStatus, ['paid', 'settlement', 'success', 'completed']) || $event === 'payment.success') {
                
                if ($payment->status !== 'success') {
                    // Update Donasi Utama
                    $payment->update(['status' => 'success']);
                    
                    // Update Infaq Pasangannya
                    Payment::where('mutation_type', 'infaq_sistem')
                        ->where('created_at', $payment->created_at)
                        ->where('atas_nama', $payment->atas_nama)
                        ->where('paymentable_id', $payment->paymentable_id)
                        ->update(['status' => 'success']);

                    Log::info("BERHASIL: Transaksi Payment ID {$payment->id} telah dilunaskan!");
                }
            } else {
                Log::info("INFO: Transaksi ditemukan, tapi status uang di Mayar masih: {$transactionStatus} (Event: {$event})");
            }
        } else {
            Log::warning("GAGAL MENCARI: Payment tidak ditemukan untuk Product ID: {$productId}");
        }

        return response()->json(['message' => 'Webhook Processed']);
    }
}