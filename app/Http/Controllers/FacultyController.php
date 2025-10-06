<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Faculty;

class FacultyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
    * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $query = Faculty::query();
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->has('department')) {
            $query->where('department', $request->department);
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
        $faculty = Faculty::create($request->only(['name', 'department', 'status']));
        return response()->json($faculty, 201);
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
        $faculty = Faculty::findOrFail($id);
        $faculty->update($request->only(['name', 'department', 'status']));
        return response()->json($faculty);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->status = 'archived';
        $faculty->save();
        return response()->json(['message' => 'Faculty archived']);
    }
}
