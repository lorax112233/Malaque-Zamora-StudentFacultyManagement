<?php

namespace App\Http\Controllers;

use App\Models\StudentProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(StudentController::with(['department', 'course', 'academicYear'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'f_name' => 'required|string|max:255',
            'm_name' => 'nullable|string|max:255',
            'l_name' => 'required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'date_of_birth' => 'required|date',
            'sex' => ['required', Rule::in(['Male', 'Female'])],
            'phone_number' => 'nullable|string|max:20',
            'email_address' => 'required|email|unique:student_profiles,email_address',
            'address' => 'nullable|string',
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
            'department_id' => 'required|exists:departments,id',
            'course_id' => 'required|exists:courses,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'year_level' => 'required|string|max:20'
        ]);

        $student = StudentController::create($validated);
        return response()->json($student, 201);
    }

    public function show($id)
    {
        return response()->json(StudentController::with(['department', 'course', 'academicYear'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $student = StudentController::findOrFail($id);
        $validated = $request->validate([
            'f_name' => 'sometimes|required|string|max:255',
            'm_name' => 'nullable|string|max:255',
            'l_name' => 'sometimes|required|string|max:255',
            'suffix' => 'nullable|string|max:50',
            'date_of_birth' => 'sometimes|required|date',
            'sex' => ['sometimes', 'required', Rule::in(['Male', 'Female'])],
            'phone_number' => 'nullable|string|max:20',
            'email_address' => ['sometimes', 'required', 'email', Rule::unique('student_profiles')->ignore($student->id)],
            'address' => 'nullable|string',
            'status' => ['sometimes', 'required', Rule::in(['Active', 'Inactive'])],
            'department_id' => 'sometimes|required|exists:departments,id',
            'course_id' => 'sometimes|required|exists:courses,id',
            'academic_year_id' => 'sometimes|required|exists:academic_years,id',
            'year_level' => 'sometimes|required|string|max:20'
        ]);

        $student->update($validated);
        return response()->json($student);
    }

    public function destroy($id)
    {
        StudentController::findOrFail($id)->delete();
        return response()->json(['message' => 'Student deleted']);
    }
}
