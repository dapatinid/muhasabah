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
        Schema::create('komentars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete(); 
            $table->string('nama_publik')->nullable();
            $table->text('body');
            
            // Kolom Polymorphic: menciptakan commentable_id dan commentable_type
            $table->morphs('commentable'); 
            
            // Opsional: Untuk fitur reply (balas komentar)
            $table->foreignId('parent_id')->nullable()->constrained('komentars')->cascadeOnDelete();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('komentars');
    }
};
