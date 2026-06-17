<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tentang_sayas', function (Blueprint $table) {
            $table->id();
            
            // Menghubungkan ke tabel users dengan cascading delete
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
                  
            // Field autobiografi menggunakan longText untuk menampung data RichEditor (HTML)
            $table->longText('autobiografi');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tentang_sayas');
    }
};