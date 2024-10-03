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
        Schema::create('students', function (Blueprint $table) {
            $table->char("nis", 6)->unique()->primary();
            $table->string("name");
            $table->char("contact", 13);
            $table->enum("gender", ["M", "W"]);
            $table->bigInteger("class_id")->unsigned()->index();
            $table->foreign("class_id")->references("id")->on("classrooms")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
