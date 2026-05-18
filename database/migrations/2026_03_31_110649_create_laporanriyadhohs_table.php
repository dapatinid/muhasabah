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
        Schema::create('laporanriyadhohs', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('no_wa');
            $table->date('tanggal');
            $table->unsignedInteger('hari_ke');
            $table->string('grup');
 
            // 18 ibadah — Sekarang menggunakan string agar fleksibel
            $table->integer('tahajud')->default(0);
            $table->integer('witir')->default(0);
            $table->string('qobliyah_subuh')->nullable();
            $table->string('subuh_jamaah')->nullable();
            $table->integer('dhuha')->default(0);
            $table->string('dhuhur_jamaah')->nullable();
            $table->string('ashar_jamaah')->nullable();
            $table->string('maghrib_jamaah')->nullable();
            $table->string('isya_jamaah')->nullable();
            $table->bigInteger('sedekah_subuh')->default(0);
            $table->string('birrul_walidain')->nullable();
            $table->string('bakti_masjid')->nullable();
            $table->string('dzikir_pagi')->nullable();
            $table->string('dzikir_sore')->nullable();
            $table->integer('istighfar')->default(0);
            $table->integer('sholawat')->default(0);
            $table->string('alquran')->nullable();
            $table->string('puasa_sunnah')->nullable();
 
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporanriyadhohs');
    }
};
