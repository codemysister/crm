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
        Schema::create('stpd', function (Blueprint $table) {
            $table->id();
            $table->uuid();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('partner_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('lead_id')->nullable()->constrained('leads')->onDelete('cascade');
            $table->string('code');
            $table->string('institution_name');
            $table->json('institution_province');
            $table->json('institution_regency');
            $table->date('departure_date');
            $table->date('return_date');
            $table->string('transportation');
            $table->string('accommodation');
            $table->string('signature_name')->nullable();
            $table->string('signature_image')->nullable();
            $table->string('signature_position')->nullable();
            $table->string('stpd_doc');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('s_p_d_s');
    }
};
