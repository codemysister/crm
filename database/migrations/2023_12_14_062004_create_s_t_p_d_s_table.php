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
            $table->string('code');
            $table->string('institution');
            $table->string('location');
            $table->date('departure_date');
            $table->date('return_date');
            $table->string('transportation');
            $table->string('accommodation');
            $table->json('signature');
            $table->string('stpd_doc');
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
