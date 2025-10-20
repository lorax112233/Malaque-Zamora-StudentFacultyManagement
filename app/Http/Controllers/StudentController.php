<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // Get students (active or archived)
    public function index(Request $request)
    {
        $query = Student::query();

        // Status filter
        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        // Search and filters
        if ($request->search) $query->where('name', 'like', "%{$request->search}%");
        if ($request->course) $query->where('course', $request->course);
        if ($request->department) $query->where('department', $request->department);

        return response()->json($query->orderBy('id','desc')->get());
    }

    // Add new student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'department' => 'required|string|max:255',
        ]);

        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    // Update student
    public function update(Request $request, $id)
    {
        $student = Student::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'department' => 'required|string|max:255',
        ]);

        $student->update($validated);

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

    // Count active students (dashboard)
    public function count()
    {
        $count = Student::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }

    // Count by department (dashboard chart)
    public function byDepartment()
    {
        $data = Student::select('department')
            ->selectRaw('COUNT(*) as count')
            ->whereNull('deleted_at')
            ->groupBy('department')
            ->get();

        return response()->json($data);
    }
}
