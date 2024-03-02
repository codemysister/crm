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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('sales_id')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('account_manager_id')->nullable()->constrained('users', 'id')->onDelete('cascade');
            $table->string('name');
            $table->string('logo')->nullable();
            $table->string('phone_number')->nullable();
            $table->json('province')->nullable();
            $table->json('regency')->nullable();
            $table->json('subdistrict')->nullable();
            $table->string('address')->nullable();
            $table->date('onboarding_date')->nullable();
            $table->date('live_date')->nullable()->default(null);
            $table->integer('onboarding_age')->nullable();
            $table->integer('live_age')->nullable();
            $table->date('monitoring_date_after_3_month_live')->nullable();
            $table->string('period')->nullable();
            $table->string('payment_metode')->default('payment link');
            $table->enum('status', ['Proses', 'Aktif', 'Non Aktif', 'Cancel', 'CLBK']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
