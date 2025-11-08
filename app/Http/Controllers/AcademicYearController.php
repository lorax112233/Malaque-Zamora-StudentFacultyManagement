<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    // ✅ List all academic years
    public function index(Request $request)
    {
        $query = AcademicYear::query();

        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    // ✅ Create academic year
    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_year' => 'required|string|max:20',
        ]);

        $academicYear = AcademicYear::create($validated);
        return response()->json($academicYear, 201);
    }

    // ✅ Update academic year
    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'school_year' => 'required|string|max:20',
        ]);

        $academicYear->update($validated);
        return response()->json($academicYear);
    }

    // ✅ Archive
    public function destroy($id)
    {
        $academicYear = AcademicYear::findOrFail($id);
        $academicYear->delete();
        return response()->json(['message' => 'Academic year archived successfully']);
    }

    // ✅ Restore
    public function restore($id)
    {
        $academicYear = AcademicYear::onlyTrashed()->findOrFail($id);
        $academicYear->restore();
        return response()->json(['message' => 'Academic year restored successfully']);
    }

    // ✅ Count
    public function count()
    {
        $count = AcademicYear::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }
}
