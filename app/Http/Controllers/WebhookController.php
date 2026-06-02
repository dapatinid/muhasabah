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

        // LOG KESELURUHAN UNTUK ANALISIS
        Log::info('MAYAR WEBHOOK DATA: ', $data);

        // Ambil data penting
        $productId = $data['data']['productId'] ?? null;
        $status = $data['data']['status'] ?? null;

        // CARI PEMBAYARAN - KITA GUNAKAN CARA PALING GAMPANG
        // Kita cari pembayaran yang link-nya mengandung productId
        $payment = Payment::where('link', 'LIKE', '%' . $productId . '%')->first();

        if (!$payment) {
            Log::error("WEBHOOK ERROR: Tidak ada Payment dengan Product ID: " . $productId);
            return response()->json(['message' => 'Payment not found'], 200);
        }

        // JIKA KETEMU, PAKSA JADI SUCCESS TANPA BANYAK SYARAT
        $payment->update(['status' => 'success']);
        
        // Update Infaq Pasangan
        Payment::where('mutation_type', 'infaq_sistem')
            ->where('created_at', $payment->created_at)
            ->where('atas_nama', $payment->atas_nama)
            ->where('paymentable_id', $payment->paymentable_id)
            ->update(['status' => 'success']);

        Log::info("WEBHOOK BERHASIL: Transaksi ID {$payment->id} diubah ke success.");
        return response()->json(['message' => 'Success'], 200);
    }
}