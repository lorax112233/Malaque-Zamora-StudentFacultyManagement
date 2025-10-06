<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
    * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Student::query();
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->has('department')) {
            $query->where('department', $request->department);
        }
        if ($request->has('course')) {
            $query->where('course', $request->course);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        return response()->json($query->get());
    }

    /**
     * Show the form for creating a new resource.
     *
    * @return \Illuminate\Http\JsonResponse
     */
    public function create()
    {
        return response()->json();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $student = Student::create($request->only(['name', 'course', 'department', 'status']));
        return response()->json($student, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        return response()->json();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function edit($id)
    {
        return response()->json();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
    * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);
        $student->update($request->only(['name', 'course', 'department', 'status']));
        return response()->json($student);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->status = 'archived';
        $student->save();
        return response()->json(['message' => 'Student archived']);
    }
}
