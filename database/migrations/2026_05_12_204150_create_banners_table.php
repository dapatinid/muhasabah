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
        Schema::create('banners', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('subtitle')->nullable();
                $table->string('image'); // URL atau Path gambar
                $table->string('link')->nullable(); // Jika banner bisa diklik ke halaman tertentu
                $table->integer('priority')->default(0); // Untuk urutan tampilan
                $table->boolean('is_active')->default(true);
                $table->unsignedBigInteger('created_by')->nullable(); // ID pengguna yang membuat banner
                $table->unsignedBigInteger('updated_by')->nullable(); // ID pengguna yang terakhir meng
                $table->timestamps();
                $table->softDeletes(); // Menambahkan kolom deleted_at untuk soft delete
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
