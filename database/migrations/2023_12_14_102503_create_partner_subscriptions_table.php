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
        Schema::create('partner_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('partner_id')->constrained('partners', 'id')->onDelete('cascade');
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->string('bill')->nullable();
            $table->bigInteger('nominal')->nullable()->default(0);
            $table->integer('ppn')->nullable()->default(0);
            $table->integer('total_ppn')->nullable()->default(0);
            $table->bigInteger('total_bill');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_subscriptions');
    }
};
