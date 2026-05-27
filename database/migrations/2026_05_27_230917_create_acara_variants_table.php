<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('acara_variants', function (Blueprint $table) {
            $table->id();
            // Menghubungkan ke tabel acaras, jika acara dihapus maka varian tiket otomatis ikut terhapus
            $table->foreignId('acara_id')->constrained()->cascadeOnDelete();
            
            $table->string('nama_varian');      // Contoh: 'Single', 'Couple', 'Paket 4 Kursi'
            $table->decimal('harga', 15, 0);    // Contoh: 100000, 175000, 300000
            $table->integer('jumlah_kursi')->default(1); // Jumlah kapasitas kursi yang berkurang (1, 2, atau 4)
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('acara_variants');
    }
};