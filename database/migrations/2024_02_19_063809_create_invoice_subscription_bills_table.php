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
        Schema::create('invoice_subscription_bills', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('invoice_subscription_id')->constrained('invoice_subscriptions', 'id')->onDelete('cascade');
            $table->string('bill');
            $table->bigInteger('nominal');
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
        Schema::dropIfExists('invoice_subscription_bills');
    }
};
