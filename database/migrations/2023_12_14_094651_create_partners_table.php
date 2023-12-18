<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('sales_id')->constrained('users', 'id')->onDelete('restrict');
            $table->foreignId('account_manager_id')->constrained('users', 'id')->onDelete('restrict');
            $table->string('name');
            $table->text('address');
            $table->date('register_date');
            $table->date('live_date');
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
