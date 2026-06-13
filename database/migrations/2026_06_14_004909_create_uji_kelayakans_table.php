<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uji_kelayakans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('class'); // misal: 'relawan-donatur'
            $table->string('kategori'); // nama atau ID kategori yang disubmit
            
            // Menyimpan seluruh array pertanyaan, pilihan jawaban, dan alasan dalam bentuk JSON
            $table->json('jawaban'); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uji_kelayakans');
    }
};