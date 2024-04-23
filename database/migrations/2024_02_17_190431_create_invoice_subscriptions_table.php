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
        Schema::create('invoice_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->foreignId('status_id')->constrained('statuses', 'id')->onDelete('cascade');
            $table->string('code');
            $table->string('period');
            $table->date('date');
            $table->date('due_date');
            $table->date('bill_date')->nullable();
            $table->integer('invoice_age');
            $table->string('partner_name');
            $table->string('partner_npwp')->nullable();
            $table->string('partner_province');
            $table->string('partner_regency');
            $table->string('signature_name')->nullable();
            $table->string('signature_image')->nullable();
            $table->string('partner_pic_signature')->nullable()->default(null);
            $table->bigInteger('total_nominal');
            $table->bigInteger('total_ppn');
            $table->bigInteger('total_bill');
            $table->bigInteger('rest_of_bill');
            $table->bigInteger('rest_of_bill_locked');
            $table->string('paid_off');
            $table->string('payment_metode');
            $table->string('xendit_link')->nullable()->default(null);
            $table->string('invoice_subscription_doc')->nullable()->default(null);
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
        Schema::dropIfExists('invoice_subscriptions');
    }
};
