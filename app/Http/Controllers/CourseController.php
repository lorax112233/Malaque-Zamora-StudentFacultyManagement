<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    // ✅ List courses (active/archived)
    public function index(Request $request)
    {
        $query = Course::with('department');

        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        if ($request->search) {
            $query->where('course_name', 'like', "%{$request->search}%");
        }

        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // ✅ Create new course
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_name' => 'required|string|max:255',
            'department_id' => 'required|integer|exists:departments,id',
        ]);

        $course = Course::create($validated);
        return response()->json($course, 201);
    }

    // ✅ Update course
    public function update(Request $request, $id)
    {
        $course = Course::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'course_name' => 'required|string|max:255',
            'department_id' => 'required|integer|exists:departments,id',
        ]);

        $course->update($validated);
        return response()->json($course);
    }

    // ✅ Archive course
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Course archived successfully']);
    }

    // ✅ Restore archived course
    public function restore($id)
    {
        $course = Course::onlyTrashed()->findOrFail($id);
        $course->restore();
        return response()->json(['message' => 'Course restored successfully']);
    }

    // ✅ Count active courses
    public function count()
    {
        $count = Course::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }
}
