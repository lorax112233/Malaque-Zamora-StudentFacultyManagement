<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicYear extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['school_year', 'start_date', 'end_date', 'is_active'];

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
