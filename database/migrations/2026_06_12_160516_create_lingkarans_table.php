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
        Schema::create('lingkarans', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('jenis'); // ['komunitas', 'yayasan', 'grup', 'instansi', 'lembaga', 'csr', 'jamaah']
            $table->string('kontak')->nullable();
            $table->text('alamat')->nullable();
            $table->longText('deskripsi')->nullable();
            $table->string('logo')->nullable();
            $table->string('sampul')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lingkarans');
    }
};
