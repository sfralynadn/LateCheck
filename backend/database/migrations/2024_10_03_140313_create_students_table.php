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
            $table->id();
            $table->char("nis", 6)->unique();
            $table->string("name");
            $table->char("contact", 13);
            $table->enum("gender", ["M", "W"]);
            $table->bigInteger("classroom_id")->unsigned()->index();
            $table->string("address");
            $table->foreign("classroom_id")->references("id")->on("classrooms")->onDelete("cascade");
            $table->timestamps();;
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
