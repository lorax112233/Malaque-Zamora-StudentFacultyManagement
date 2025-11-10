<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('f_name');
            $table->string('m_name')->nullable();
            $table->string('l_name');
            $table->string('suffix')->nullable();
            $table->date('date_of_birth');
            $table->enum('sex', ['Male','Female']);
            $table->string('phone_number')->nullable();
            $table->string('email_address')->unique();
            $table->text('address')->nullable();
            $table->string('position');
            $table->enum('status', ['Active','Inactive']);
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });

        // Add foreign key for department_head_id in departments AFTER faculties table exists
        Schema::table('departments', function (Blueprint $table) {
            $table->foreign('department_head_id')->references('id')->on('faculties')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['department_head_id']);
        });
        Schema::dropIfExists('faculties');
    }
};
