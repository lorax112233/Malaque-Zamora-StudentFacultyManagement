<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $view = $request->query('view', 'active');
        $query = Course::with('department');

        if ($view === 'archived') {
            $query = $query->onlyTrashed();
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_name' => 'required|string|unique:courses,course_name',
            'department_id' => 'required|exists:departments,id'
        ]);

        $course = Course::create($validated);
        return response()->json($course, 201);
    }

    public function show($id)
    {
        return response()->json(Course::with('department')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $validated = $request->validate([
            'course_name' => 'sometimes|required|string|unique:courses,course_name,' . $course->id,
            'department_id' => 'sometimes|required|exists:departments,id'
        ]);

        $course->update($validated);
        return response()->json($course);
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Course archived']);
    }

    public function restore($id)
    {
        $course = Course::onlyTrashed()->findOrFail($id);
        $course->restore();
        return response()->json(['message' => 'Course restored']);
    }

    public function forceDelete($id)
    {
        $course = Course::withTrashed()->findOrFail($id);
        $course->forceDelete();
        return response()->json(['message' => 'Course permanently deleted']);
    }
}
