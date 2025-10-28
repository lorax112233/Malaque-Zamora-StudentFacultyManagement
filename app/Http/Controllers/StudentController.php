<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    // Get students with pagination, advanced filtering, and statistics
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $query = Student::query();

        // Status filter (active/archived)
        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        // Advanced search: search name, course name, or department name
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $term = "%{$request->search}%";
                $q->where('name', 'like', $term)
                  ->orWhereHas('course', function($qc) use ($term) {
                      $qc->where('name', 'like', $term);
                  })
                  ->orWhereHas('department', function($qd) use ($term) {
                      $qd->where('name', 'like', $term);
                  });
            });
        }

        // Course and Department filters (accept names or ids)
        if ($request->course) {
            if (is_numeric($request->course)) {
                $query->where('course_id', $request->course);
            } else {
                $query->whereHas('course', function($qc) use ($request) {
                    $qc->where('name', $request->course);
                });
            }
        }
        if ($request->department) {
            if (is_numeric($request->department)) {
                $query->where('department_id', $request->department);
            } else {
                $query->whereHas('department', function($qd) use ($request) {
                    $qd->where('name', $request->department);
                });
            }
        }

        // Sort options
        $sortField = $request->input('sort_field', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $students = $query->paginate($perPage);

        // Add statistics and metadata
        // Build stats using departments and courses tables so names are returned
        $stats = [
            'total' => Student::count(),
            'active' => Student::whereNull('deleted_at')->count(),
            'archived' => Student::onlyTrashed()->count(),
            'departments' => DB::table('departments')->pluck('name'),
            'courses' => DB::table('courses')->pluck('name'),
            'by_department' => DB::table('students')
                ->join('departments', 'students.department_id', '=', 'departments.id')
                ->whereNull('students.deleted_at')
                ->select('departments.name as department', DB::raw('count(*) as count'))
                ->groupBy('departments.name')
                ->get(),
            'by_course' => DB::table('students')
                ->join('courses', 'students.course_id', '=', 'courses.id')
                ->whereNull('students.deleted_at')
                ->select('courses.name as course', DB::raw('count(*) as count'))
                ->groupBy('courses.name')
                ->get()
        ];

        return response()->json([
            'students' => $students,
            'stats' => $stats
        ]);
    }

    // Add new student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course' => 'required', // name or id
            'department' => 'required', // name or id
        ]);

        // Resolve department id (create if needed)
        if (is_numeric($validated['department'])) {
            $department_id = (int) $validated['department'];
        } else {
            $department = DB::table('departments')->where('name', $validated['department'])->first();
            if (!$department) {
                $department_id = DB::table('departments')->insertGetId(['name' => $validated['department']]);
            } else {
                $department_id = $department->id;
            }
        }

        // Resolve course id (create if needed)
        if (is_numeric($validated['course'])) {
            $course_id = (int) $validated['course'];
        } else {
            $course = DB::table('courses')
                ->where('name', $validated['course'])
                ->where('department_id', $department_id)
                ->first();
            if (!$course) {
                $course_id = DB::table('courses')->insertGetId(['name' => $validated['course'], 'department_id' => $department_id]);
            } else {
                $course_id = $course->id;
            }
        }

        $student = Student::create([
            'name' => $validated['name'],
            'department_id' => $department_id,
            'course_id' => $course_id,
        ]);

        return response()->json($student, 201);
    }

    // Update student
    public function update(Request $request, $id)
    {
        $student = Student::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course' => 'required',
            'department' => 'required',
        ]);

        // Resolve department
        if (is_numeric($validated['department'])) {
            $department_id = (int) $validated['department'];
        } else {
            $department = DB::table('departments')->where('name', $validated['department'])->first();
            if (!$department) {
                $department_id = DB::table('departments')->insertGetId(['name' => $validated['department']]);
            } else {
                $department_id = $department->id;
            }
        }

        // Resolve course
        if (is_numeric($validated['course'])) {
            $course_id = (int) $validated['course'];
        } else {
            $course = DB::table('courses')
                ->where('name', $validated['course'])
                ->where('department_id', $department_id)
                ->first();
            if (!$course) {
                $course_id = DB::table('courses')->insertGetId(['name' => $validated['course'], 'department_id' => $department_id]);
            } else {
                $course_id = $course->id;
            }
        }

        $student->update([
            'name' => $validated['name'],
            'department_id' => $department_id,
            'course_id' => $course_id,
        ]);

        return response()->json($student);
    }

    // Archive student
    public function destroy($id)
    {
        Student::findOrFail($id)->delete();
        return response()->json(['message' => 'Student archived successfully']);
    }

    // Restore archived student
    public function restore($id)
    {
        Student::onlyTrashed()->findOrFail($id)->restore();
        return response()->json(['message' => 'Student restored successfully']);
    }

    // Permanently delete (force delete) an archived student
    public function forceDelete($id)
    {
        $student = Student::onlyTrashed()->findOrFail($id);
        $student->forceDelete();
        return response()->json(['message' => 'Student permanently deleted']);
    }

    // Count active students (dashboard)
    public function count()
    {
        $count = Student::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }

    // Count by department (dashboard chart)
    public function byDepartment()
    {
        $data = DB::table('students')
            ->join('departments', 'students.department_id', '=', 'departments.id')
            ->whereNull('students.deleted_at')
            ->select('departments.name as department', DB::raw('COUNT(*) as count'))
            ->groupBy('departments.name')
            ->get();

        return response()->json($data);
    }
}
