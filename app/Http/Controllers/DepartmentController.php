<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // ✅ List all departments (active or archived)
    public function index(Request $request)
    {
        $query = Department::query();

        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // ✅ Create new department
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_head_id' => 'nullable|integer|exists:faculties,id',
        ]);

        $department = Department::create($validated);
        return response()->json($department, 201);
    }

    // ✅ Update department info
    public function update(Request $request, $id)
    {
        $department = Department::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_head_id' => 'nullable|integer|exists:faculties,id',
        ]);

        $department->update($validated);
        return response()->json($department);
    }

    // ✅ Archive (soft delete)
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return response()->json(['message' => 'Department archived successfully']);
    }

    // ✅ Restore archived department
    public function restore($id)
    {
        $department = Department::onlyTrashed()->findOrFail($id);
        $department->restore();
        return response()->json(['message' => 'Department restored successfully']);
    }

    // ✅ Count active departments
    public function count()
    {
        $count = Department::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }
}
