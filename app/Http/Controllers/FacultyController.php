<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    // ✅ List all faculties (with filters)
    public function index(Request $request)
    {
        $query = Faculty::with(['department']);

        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->department_id) {
            $query->where('department_id', $request->department_id);
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // ✅ Create new faculty
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $faculty = Faculty::create($validated);

        return response()->json($faculty, 201);
    }

    // ✅ Update faculty info
    public function update(Request $request, $id)
    {
        $faculty = Faculty::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $faculty->update($validated);

        return response()->json($faculty);
    }

    // ✅ Archive (soft delete)
    public function destroy($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->delete();

        return response()->json(['message' => 'Faculty archived successfully']);
    }

    // ✅ Restore archived faculty
    public function restore($id)
    {
        $faculty = Faculty::onlyTrashed()->findOrFail($id);
        $faculty->restore();

        return response()->json(['message' => 'Faculty restored successfully']);
    }

    // ✅ Count active faculties
    public function count()
    {
        $count = Faculty::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }
}
