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
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('created_by')->constrained('users', 'id')->onDelete('cascade');
            $table->foreignId('partner_id')->constrained()->onDelete('cascade');
            $table->foreignId('status_id')->constrained('statuses', 'id')->onDelete('cascade');
            $table->integer('pcs');
            $table->integer('price');
            $table->bigInteger('total');
            $table->string('revision_detail')->nullable();
            $table->text('google_drive_link');
            $table->string('address');
            $table->enum('type', ['cetak', 'digital']);
            $table->dateTime('approval_date')->nullable();
            $table->dateTime('design_date')->nullable();
            $table->dateTime('print_date')->nullable();
            $table->dateTime('delivery_date')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
