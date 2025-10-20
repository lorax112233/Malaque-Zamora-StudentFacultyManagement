<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('course');
            $table->string('department');
            $table->timestamps();
            $table->softDeletes(); // for archiving
        });
    }

    public function down()
    {
        Schema::dropIfExists('students');
    }
}
