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
        Schema::create('slas', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->string('code');
            $table->foreignId('lead_id')->constrained('leads', 'id')->onDelete('cascade');
            $table->string('logo');
            $table->string('lead_name');
            $table->string('lead_province');
            $table->string('lead_regency');
            $table->string('lead_phone_number');
            $table->string('lead_pic');
            $table->string('lead_pic_email')->nullable();
            $table->string('lead_pic_number')->nullable();
            $table->string('lead_pic_signature')->nullable()->default(null);
            $table->string('signature_image')->nullable();
            $table->string('signature_name')->nullable();
            $table->boolean('referral');
            $table->string('referral_name')->nullable();
            $table->string('referral_institution')->nullable();
            $table->string('referral_logo')->nullable();
            $table->string('referral_signature')->nullable()->default(null);
            $table->foreignId('created_by')->constrained('users', 'id')->onDelete('cascade');
            $table->string('sla_doc');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('s_l_a_s');
    }
};
