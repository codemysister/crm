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
        Schema::create('invoice_generals', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('code');
            $table->foreignId('partner_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->nullable()->constrained('leads')->onDelete('cascade');
            $table->foreignId('status_id')->constrained('statuses', 'id')->onDelete('cascade');
            $table->string('institution_name');
            $table->string('institution_npwp')->nullable();
            $table->json('institution_province');
            $table->json('institution_regency');
            $table->string('institution_phone_number');
            $table->date('date');
            $table->date('due_date');
            $table->string('invoice_age');
            $table->date('bill_date')->nullable();
            $table->bigInteger('total');
            $table->bigInteger('total_all_ppn');
            $table->bigInteger('total_final_with_ppn');
            $table->bigInteger('paid_off');
            $table->bigInteger('rest_of_bill')->nullable();
            $table->bigInteger('rest_of_bill_locked')->nullable();
            $table->string('signature_name')->nullable();
            $table->string('signature_image')->nullable();
            $table->string('payment_metode');
            $table->string('xendit_link')->nullable();
            $table->text('reason_late')->nullable();
            $table->string('invoice_general_doc')->nullable();
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
        Schema::dropIfExists('invoice_generals');
    }
};
