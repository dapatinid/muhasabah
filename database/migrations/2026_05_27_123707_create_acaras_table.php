<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('acaras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Konten Acara
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('panduan_acara')->nullable(); // Instuksi untuk tiket/donasi
            $table->longText('body'); 
            $table->longText('progress')->nullable(); // Update berkala jalannya acara
            $table->string('kategori'); 
            $table->string('subkategori'); 
            $table->string('thumbnail')->nullable();
            $table->string('lokasi')->nullable(); // Bisa diisi "Online" atau Alamat Fisik
            
            // Fitur Toggle (Menentukan apakah acara buka tiket, donasi, atau keduanya)
            $table->boolean('accept_tiket')->default(true);
            $table->boolean('accept_donasi')->default(false);
            
            // Finansial & Kuota Tiket
            $table->decimal('harga_tiket', 15, 0)->default(0); // 0 jika gratis
            $table->integer('kuota_tiket')->default(0); // Kuota maksimal peserta
            $table->integer('tiket_terjual')->default(0);
            
            // Finansial Donasi / Sponsorship
            $table->decimal('target_donasi', 15, 0)->default(0);
            $table->decimal('saldo_donasi', 15, 0)->default(0); 
            
            // Waktu Acara & Batas Registrasi
            $table->dateTime('tgl_mulai')->nullable(); // Mulai Acara
            $table->dateTime('tgl_selesai')->nullable(); // Selesai Acara
            $table->dateTime('batas_registrasi')->nullable(); // Batas akhir beli tiket/donasi
            
            // Status & Audit
            $table->boolean('is_published')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('acaras');
    }
};