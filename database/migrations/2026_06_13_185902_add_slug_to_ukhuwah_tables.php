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
        // Tambah slug di tabel users
        Schema::table('users', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('name');
        });

        // Tambah slug di tabel masjids
        Schema::table('masjids', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('nama');
        });

        // Tambah slug di tabel lingkarans
        Schema::table('lingkarans', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('nama');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('slug');
        });

        Schema::table('masjids', function (Blueprint $table) {
            $table->dropColumn('slug');
        });

        Schema::table('lingkarans', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};