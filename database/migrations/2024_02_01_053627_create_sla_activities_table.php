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
        Schema::create('sla_activities', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('sla_id')->constrained('slas', 'id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->string('cazh_pic');
            $table->string('activity');
            $table->string('duration');
            $table->date('estimation_date');
            $table->date('realization_date')->nullable()->default(null);
            $table->text('realization')->nullable()->default(null);
            $table->text('information')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sla_activities');
    }
};
