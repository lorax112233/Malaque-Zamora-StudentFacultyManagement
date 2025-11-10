<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::withTrashed()->with(['department','course','academicYear']);

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('f_name','like',"%{$request->search}%")
                  ->orWhere('l_name','like',"%{$request->search}%")
                  ->orWhere('email_address','like',"%{$request->search}%");
            });
        }

        if ($request->filled('department_id')) $query->where('department_id', $request->department_id);
        if ($request->filled('course_id')) $query->where('course_id', $request->course_id);
        if ($request->filled('status')) $query->where('status', ucfirst($request->status));
        if ($request->filled('view')) {
            if ($request->view == 'archived') $query->onlyTrashed();
            if ($request->view == 'active') $query->whereNull('deleted_at');
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'f_name'=>'required|string',
            'm_name'=>'nullable|string',
            'l_name'=>'required|string',
            'suffix'=>'nullable|string',
            'date_of_birth'=>'required|date',
            'sex'=>['required', Rule::in(['Male','Female'])],
            'phone_number'=>'nullable|string',
            'email_address'=>'required|email|unique:students,email_address',
            'address'=>'nullable|string',
            'status'=>['required', Rule::in(['Active','Inactive'])],
            'department_id'=>'required|exists:departments,id',
            'course_id'=>'required|exists:courses,id',
            'academic_year_id'=>'required|exists:academic_years,id',
            'year_level'=>'required|integer|min:1'
        ]);

        $student = Student::create($validated);
        return response()->json($student,201);
    }

    public function update(Request $request,$id)
    {
        $student = Student::withTrashed()->findOrFail($id);
        $validated = $request->validate([
            'f_name'=>'sometimes|required|string',
            'm_name'=>'nullable|string',
            'l_name'=>'sometimes|required|string',
            'suffix'=>'nullable|string',
            'date_of_birth'=>'sometimes|required|date',
            'sex'=>['sometimes','required', Rule::in(['Male','Female'])],
            'phone_number'=>'nullable|string',
            'email_address'=>['sometimes','required','email', Rule::unique('students')->ignore($student->id)],
            'address'=>'nullable|string',
            'status'=>['sometimes','required', Rule::in(['Active','Inactive'])],
            'department_id'=>'sometimes|required|exists:departments,id',
            'course_id'=>'sometimes|required|exists:courses,id',
            'academic_year_id'=>'sometimes|required|exists:academic_years,id',
            'year_level'=>'sometimes|required|integer|min:1'
        ]);

        $student->update($validated);
        return response()->json($student);
    }

    public function archive($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['message'=>'Student archived']);
    }

    public function restore($id)
    {
        $student = Student::onlyTrashed()->findOrFail($id);
        $student->restore();
        return response()->json(['message'=>'Student restored']);
    }

    public function destroy($id)
    {
        $student = Student::withTrashed()->findOrFail($id);
        $student->forceDelete();
        return response()->json(['message'=>'Student permanently deleted']);
    }
}
