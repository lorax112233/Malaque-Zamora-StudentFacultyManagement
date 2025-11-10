<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $view = $request->query('view', 'active');
        $query = Department::with('head:id,f_name,l_name');

        if ($view === 'archived') {
            $query = $query->onlyTrashed();
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_name' => 'required|string|unique:departments,department_name',
            'department_head_id' => 'nullable|exists:faculties,id'
        ]);

        $department = Department::create($validated);
        return response()->json($department, 201);
    }

    public function show($id)
    {
        return response()->json(Department::with('head')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $validated = $request->validate([
            'department_name' => 'sometimes|required|string|unique:departments,department_name,' . $department->id,
            'department_head_id' => 'nullable|exists:faculties,id'
        ]);

        $department->update($validated);
        return response()->json($department);
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return response()->json(['message' => 'Department archived']);
    }

    public function restore($id)
    {
        $department = Department::onlyTrashed()->findOrFail($id);
        $department->restore();
        return response()->json(['message' => 'Department restored']);
    }

    public function forceDelete($id)
    {
        $department = Department::withTrashed()->findOrFail($id);
        $department->forceDelete();
        return response()->json(['message' => 'Department permanently deleted']);
    }
}
