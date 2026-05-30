<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('provinsi', 'province_code');
            $table->renameColumn('kabupaten', 'city_code');
            $table->renameColumn('kecamatan', 'district_code');
            $table->renameColumn('desa', 'village_code');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('province_code', 'provinsi');
            $table->renameColumn('city_code', 'kabupaten');
            $table->renameColumn('district_code', 'kecamatan');
            $table->renameColumn('village_code', 'desa');
        });
    }
};