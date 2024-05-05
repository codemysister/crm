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
        Schema::create('partner_price_lists', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('partner_id')->constrained('partners', 'id')->onDelete('cascade');
            $table->json('price_card')->nullable();
            $table->bigInteger('price_lanyard')->nullable();
            $table->bigInteger('price_subscription_system')->nullable();
            $table->bigInteger('price_training_offline')->nullable();
            $table->bigInteger('price_training_online')->nullable();
            $table->bigInteger('fee_qris')->nullable();
            $table->bigInteger('fee_purchase_cazhpoin')->nullable();
            $table->bigInteger('fee_bill_cazhpoin')->nullable();
            $table->bigInteger('fee_topup_cazhpos')->nullable();
            $table->bigInteger('fee_withdraw_cazhpos')->nullable();
            $table->bigInteger('fee_bill_saldokartu')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_price_lists');
    }
};
