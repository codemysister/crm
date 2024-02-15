<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoice_general_products', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('invoice_general_id')->constrained('invoice_generals', 'id')->onDelete('cascade');
            $table->string('name');
            $table->integer('quantity');
            $table->text('description');
            $table->bigInteger('price');
            $table->bigInteger('total');
            $table->bigInteger('total_ppn');
            $table->bigInteger('ppn');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_general_products');
    }
};
