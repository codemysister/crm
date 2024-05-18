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
            $table->foreignId('partner_id')->constrained('partners', 'id')->onDelete('cascade');
            $table->string('logo');
            $table->string('partner_name');
            $table->string('partner_province');
            $table->string('partner_regency');
            $table->string('partner_phone_number');
            $table->string('partner_pic');
            $table->string('partner_pic_email')->nullable();
            $table->string('partner_pic_number')->nullable();
            $table->string('partner_pic_signature')->nullable()->default(null);
            $table->string('signature_image')->nullable();
            $table->string('signature_name')->nullable();
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
