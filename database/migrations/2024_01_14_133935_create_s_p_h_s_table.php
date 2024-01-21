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
            $table->json('partner'); // {name:'', pic: '', address:''}
            $table->json('sales');  // {name:'', wa: '', email:''}
            $table->json('signature'); // {name:'', position: '', signature:'path'}
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
