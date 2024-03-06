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
        Schema::create('invoice_subscription_transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('invoice_id')->constrained('invoice_subscriptions', 'id')->onDelete('cascade');
            $table->foreignId('partner_id')->constrained('partners', 'id')->onDelete('cascade');
            $table->string('code')->default("KW/0001/XI/2024");
            $table->string('partner_name');
            $table->date('date');
            $table->bigInteger('nominal');
            $table->text('money');
            $table->string('metode');
            $table->string('payment_for');
            $table->string('signature_name');
            $table->string('signature_image');
            $table->string('receipt_doc')->nullable()->default(null);
            $table->foreignId('created_by')->constrained('users', 'id')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_subscription_transactions');
    }
};
