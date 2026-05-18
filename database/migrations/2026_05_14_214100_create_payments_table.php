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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->integer('paymentable_id');
            $table->string('paymentable_type');
            
            $table->string('image')->nullable();
            $table->text('notes')->nullable();

            $table->string('mutation_type')->nullable();
            $table->string('debit_akun')->nullable();
            $table->string('kredit_akun')->nullable();

            $table->string('payment_method')->nullable();
            $table->string('currency')->nullable()->default('IDR');
            $table->decimal('nominal_plus', 12, 0)->default(0);
            $table->decimal('nominal_mins', 12, 0)->default(0);
            $table->decimal('nominal', 12, 0)->default(0);
            $table->string('rekening')->nullable();
            $table->string('no_wa')->nullable(); // Baru
            $table->string('sapaan')->nullable(); // Baru
            $table->string('atas_nama')->nullable(); // Baru

            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->foreign('deleted_by')->references('id')->on('users');
            $table->datetime('date')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
