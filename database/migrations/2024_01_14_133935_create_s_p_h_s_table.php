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
            $table->foreignId('partner_id')->constrained('partners', 'id')->onDelete('cascade');
            $table->string('code');
            $table->string('partner_name');
            $table->string('partner_pic');
            $table->string('partner_address');
            $table->string('sales_name');
            $table->string('sales_wa');
            $table->string('sales_email');
            $table->string('signature_name');
            $table->string('signature_position');
            $table->string('signature_image');
            $table->string('sph_doc');
            $table->foreignId('created_by')->constrained('users', 'id')->onDelete('cascade');
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
