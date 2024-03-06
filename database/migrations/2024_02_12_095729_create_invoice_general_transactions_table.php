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
        Schema::create('invoice_general_transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('invoice_general_id')->constrained('invoice_generals', 'id')->onDelete('cascade');
            $table->foreignId('partner_id')->constrained('partners', 'id')->onDelete('cascade');
            $table->string('code')->default("KW/0104/XI/2023");
            $table->string('partner_name');
            $table->date('date');
            $table->bigInteger('nominal');
            $table->text('money');
            $table->string('metode');
            $table->string('payment_for');
            $table->string('signature_name');
            $table->string('signature_image');
            $table->string('receipt_doc');
            $table->foreignId('created_by')->constrained('users', 'id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_general_transactions');
    }
};
