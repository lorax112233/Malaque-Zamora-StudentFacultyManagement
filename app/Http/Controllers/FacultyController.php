<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $query = Faculty::withTrashed()->with('department');

        if ($request->filled('filter')) {
            if ($request->filter === 'archived') {
                $query->onlyTrashed();
            } elseif ($request->filter === 'active') {
                $query->whereNull('deleted_at');
            }
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('f_name', 'like', "%{$request->search}%")
                  ->orWhere('l_name', 'like', "%{$request->search}%")
                  ->orWhere('email_address', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->filled('status')) {
            $query->where('status', ucfirst($request->status));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'f_name' => 'required|string',
            'm_name' => 'nullable|string',
            'l_name' => 'required|string',
            'suffix' => 'nullable|string',
            'date_of_birth' => 'required|date',
            'sex' => ['required', Rule::in(['Male', 'Female'])],
            'phone_number' => 'nullable|string',
            'email_address' => 'required|email|unique:faculties,email_address',
            'address' => 'nullable|string',
            'position' => 'required|string',
            'status' => ['required', Rule::in(['Active', 'Inactive'])],
            'department_id' => 'nullable|exists:departments,id'
        ]);

        $faculty = Faculty::create($validated);
        return response()->json($faculty, 201);
    }

    public function update(Request $request, $id)
    {
        $faculty = Faculty::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'f_name' => 'sometimes|required|string',
            'm_name' => 'nullable|string',
            'l_name' => 'sometimes|required|string',
            'suffix' => 'nullable|string',
            'date_of_birth' => 'sometimes|required|date',
            'sex' => ['sometimes', 'required', Rule::in(['Male', 'Female'])],
            'phone_number' => 'nullable|string',
            'email_address' => ['sometimes', 'required', 'email', Rule::unique('faculties')->ignore($faculty->id)],
            'address' => 'nullable|string',
            'position' => 'sometimes|required|string',
            'status' => ['sometimes', 'required', Rule::in(['Active', 'Inactive'])],
            'department_id' => 'nullable|exists:departments,id'
        ]);

        $faculty->update($validated);
        return response()->json($faculty);
    }

    // ARCHIVE (Soft delete)
    public function archive($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();
        return response()->json(['message' => 'Faculty archived']);
    }

    // RESTORE (Unarchive)
    public function restore($id)
    {
        $faculty = Faculty::onlyTrashed()->findOrFail($id);
        $faculty->restore();
        return response()->json(['message' => 'Faculty restored']);
    }

    // PERMANENT DELETE
    public function destroy($id)
    {
        $faculty = Faculty::withTrashed()->findOrFail($id);
        $faculty->forceDelete();
        return response()->json(['message' => 'Faculty permanently deleted']);
    }
}
  