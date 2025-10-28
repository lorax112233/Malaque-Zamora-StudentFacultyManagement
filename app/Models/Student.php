<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'course_id',
        'department_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Scopes for common queries
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at');
    }

    public function scopeByDepartment($query, $department)
    {
        return $query->where('department_id', $department);
    }

    public function scopeByCourse($query, $course)
    {
        return $query->where('course_id', $course);
    }

    // Statistics methods
    public static function getDepartmentCounts()
    {
        return self::active()
            ->select('department_id', \DB::raw('count(*) as count'))
            ->groupBy('department_id')
            ->orderBy('department_id')
            ->get();
    }

    public static function getCourseCounts()
    {
        return self::active()
            ->select('course_id', \DB::raw('count(*) as count'))
            ->groupBy('course_id')
            ->orderBy('course_id')
            ->get();
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
