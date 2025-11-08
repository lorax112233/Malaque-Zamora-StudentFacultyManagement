<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'department_name',
        'department_head_id',
    ];

    /**
     * Relationship: Department Head (Faculty)
     */
    public function head()
    {
        return $this->belongsTo(Faculty::class, 'department_head_id');
    }

    /**
     * Relationship: Courses under this Department
     */
    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
