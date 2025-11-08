<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'f_name',
        'm_name',
        'l_name',
        'suffix',
        'date_of_birth',
        'sex',
        'phone_number',
        'email_address',
        'address',
        'status',
        'department_id',
        'course_id',
        'academic_year_id',
        'year_level'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->f_name} {$this->m_name} {$this->l_name}";
    }
}