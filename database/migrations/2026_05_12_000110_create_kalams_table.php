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
        Schema::create('kalams', function (Blueprint $table) {
            $table->id();
            // Relasi ke user (penulis)
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Konten Utama
            $table->string('judul');
            $table->string('slug')->unique(); // Untuk URL ramah SEO
            $table->longText('body'); // Kapasitas besar untuk RichEditor (HTML)
            
            // Kategorisasi & Metadata
            $table->string('kategori'); // hikmah, doa, kisah, tips, berita
            $table->string('thumbnail')->nullable(); // Opsional jika ada gambar sampul
            
            // Status & Privasi
            $table->boolean('is_published')->default(true);
            $table->boolean('is_anonymous')->default(false); // Jika user ingin merahasiakan nama

            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            
            $table->timestamps();
            $table->softDeletes(); // Agar jika dihapus tidak langsung hilang permanen
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kalams');
    }
};
