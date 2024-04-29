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
        Schema::create('memos', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('code');
            $table->foreignId('partner_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->nullable()->constrained('leads')->onDelete('cascade');
            $table->string('partner_name');
            $table->string('price_card');
            $table->string('price_e_card');
            $table->string('price_subscription');
            $table->text('consideration');
            $table->date('date');
            $table->string('signature_applicant_name')->nullable();
            $table->string('signature_applicant_image')->nullable();
            $table->string('signature_acknowledges_name')->nullable();
            $table->string('signature_acknowledges_image')->nullable();
            $table->string('signature_agrees_name')->nullable();
            $table->string('signature_agrees_image')->nullable();
            $table->string('memo_doc')->nullable();
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
        Schema::dropIfExists('memos');
    }
};
