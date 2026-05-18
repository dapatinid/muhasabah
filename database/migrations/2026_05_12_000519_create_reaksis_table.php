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
Schema::create('reaksis', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
        $table->string('ip_address', 45)->nullable();
        
        // Jenis reaksi: 'like', 'love', 'aamiin', 'masyaallah', dll
        $table->string('type'); 
        
        // Kolom Polymorphic: reaktiable_id dan reaktiable_type
        $table->morphs('reaktiable'); 
        
        // Constraint agar 1 user cuma bisa kasih 1 reaksi per item
        $table->unique(['user_id', 'reaktiable_id', 'reaktiable_type'], 'user_reaksi_unique');

        $table->timestamps();
        $table->softDeletes();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reaksis');
    }
};
