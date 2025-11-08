<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFacultiesTable extends Migration
{
    public function up()
    {
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('department')->nullable(); // for backward compatibility
            $table->string('status')->default('active'); // active / archived

            // ✅ Properly defined foreign key relationship
            $table->unsignedBigInteger('department_id')->nullable();
            $table->foreign('department_id')
                  ->references('id')
                  ->on('departments')
                  ->onDelete('set null');

            $table->softDeletes(); // enables archiving
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('faculties');
    }
}
