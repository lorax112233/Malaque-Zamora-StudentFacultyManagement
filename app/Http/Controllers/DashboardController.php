<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use App\Models\Department;

class DashboardController extends Controller
{
    public function studentCount()
    {
        return response()->json(['count' => Student::count()]);
    }

    public function facultyCount()
    {
        return response()->json(['count' => Faculty::count()]);
    }

    public function departmentCount()
    {
        return response()->json(['count' => Department::count()]);
    }

    public function studentsByDepartment()
    {
        $data = Department::withCount('students')
            ->get()
            ->map(fn($d) => [
                'department' => $d->department_name,
                'count' => $d->students_count,
            ]);

        return response()->json($data);
    }

    public function facultyByDepartment()
    {
        $data = Department::withCount('faculties')
            ->get()
            ->map(fn($d) => [
                'department' => $d->department_name,
                'count' => $d->faculties_count,
            ]);

        return response()->json($data);
    }
}
