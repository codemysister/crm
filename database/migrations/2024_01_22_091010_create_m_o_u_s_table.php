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
        Schema::create('mous', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->string('code');
            $table->string('day');
            $table->date('date');
            $table->morphs('mouable');
            $table->string('partner_name');
            $table->string('partner_pic');
            $table->string('partner_pic_position');
            $table->string('partner_pic_signature')->nullable()->default(null);
            $table->json('partner_province');
            $table->json('partner_regency');
            $table->string('url_subdomain');
            $table->bigInteger('price_card');
            $table->bigInteger('price_lanyard');
            $table->bigInteger('price_subscription_system');
            $table->string('period_subscription');
            $table->bigInteger('price_training_offline');
            $table->bigInteger('price_training_online');
            $table->string('fee_qris');
            $table->integer('fee_purchase_cazhpoin');
            $table->integer('fee_bill_cazhpoin');
            $table->integer('fee_topup_cazhpos');
            $table->integer('fee_withdraw_cazhpos');
            $table->integer('fee_bill_saldokartu');
            $table->string('bank');
            $table->string('account_bank_number');
            $table->string('account_bank_name');
            $table->date('expired_date');
            $table->boolean('profit_sharing');
            $table->text('profit_sharing_detail')->nullable();
            // $table->boolean('referral');
            // $table->string('referral_name')->nullable();
            // $table->string('referral_signature')->nullable()->default(null);
            $table->string('signature_name');
            $table->string('signature_position');
            $table->string('signature_image');
            $table->string('mou_doc');
            $table->string('mou_doc_word')->nullable()->default(null);
            $table->foreignId('created_by')->constrained('users', 'id')->onDelete('cascade');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mous');
    }
};
