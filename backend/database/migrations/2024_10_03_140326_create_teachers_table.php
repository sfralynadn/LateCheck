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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->char("nip")->unique();
            $table->string("name");
            $table->string("email");
            $table->string("password");
            $table->char("contact", 13);
            $table->enum("role", [1, 2]);
            $table->timestamp("last_logged_in");
            $table->bigInteger("classroom_id")->unsigned();
            $table->foreign("classroom_id")->references("id")->on("classrooms")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
