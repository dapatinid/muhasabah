<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            // Konten
            $table->string('judul');
            $table->string('slug')->unique();
            $table->text('panduan_donasi')->nullable();
            $table->longText('body'); 
            $table->string('kategori'); 
            $table->string('subkategori'); 
            $table->string('thumbnail')->nullable();
            
            // Finansial
            $table->decimal('target_dana', 15, 0)->default(0);
            $table->decimal('saldo', 15, 0)->default(0); 
            $table->dateTime('tgl_mulai')->nullable(); // Baru
            $table->dateTime('tgl_selesai')->nullable(); // Baru
            
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
        Schema::dropIfExists('donasis');
    }
};