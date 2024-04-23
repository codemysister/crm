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
        Schema::create('sphs', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->morphs('sphable');
            $table->string('code');
            $table->date('date');
            $table->string('partner_name');
            $table->string('partner_pic');
            $table->json('partner_province');
            $table->json('partner_regency');
            $table->string('sales_name');
            $table->string('sales_wa');
            $table->string('sales_email');
            $table->string('signature_name')->nullable();
            $table->string('signature_position')->nullable();
            $table->string('signature_image')->nullable();
            $table->string('sph_doc');
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
        Schema::dropIfExists('sphs');
    }
};
