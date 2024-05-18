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
        Schema::create('partner_pic', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->string('name');
            $table->string('number')->nullable();
            $table->string('email')->nullable();
            $table->string('position')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_p_i_c_s');
    }
};
