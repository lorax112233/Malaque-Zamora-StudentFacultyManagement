<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;


class FacultyController extends Controller
{
    // List faculties
    public function index(Request $request)
    {
        $query = Faculty::query();

        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->department) {
            $query->where('department', $request->department);
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // Add new faculty
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
        ]);

        $faculty = Faculty::create($validated);

        return response()->json($faculty, 201);
    }

    // Edit faculty
    public function update(Request $request, $id)
    {
        $faculty = Faculty::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
        ]);

        $faculty->update($validated);

        return response()->json($faculty);
    }

    // Archive faculty
    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete(); // soft delete
        return response()->json(['message' => 'Faculty archived successfully']);
    }

    // Restore faculty
    public function restore($id)
    {
        $faculty = Faculty::onlyTrashed()->findOrFail($id);
        $faculty->restore();
        return response()->json(['message' => 'Faculty restored successfully']);
    }

    // Count active faculties (for dashboard)
    public function count()
    {
        $count = Faculty::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }
}
