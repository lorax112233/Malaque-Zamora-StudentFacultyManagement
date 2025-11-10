<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $view = $request->query('view', 'active');
        $query = AcademicYear::query();

        if ($view === 'archived') {
            $query = $query->onlyTrashed();
        }

        return response()->json($query->orderBy('start_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'school_year' => 'required|string|unique:academic_years,school_year',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        if (!empty($validated['is_active'])) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        $year = AcademicYear::create($validated);
        return response()->json($year, 201);
    }

    public function update(Request $request, $id)
    {
        $year = AcademicYear::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'school_year' => 'required|string|unique:academic_years,school_year,' . $year->id,
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        if (!empty($validated['is_active'])) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        $year->update($validated);
        return response()->json($year);
    }

    public function destroy($id)
    {
        $year = AcademicYear::findOrFail($id);
        $year->delete();
        return response()->json(['message' => 'Academic year archived']);
    }

    public function restore($id)
    {
        $year = AcademicYear::onlyTrashed()->findOrFail($id);
        $year->restore();
        return response()->json(['message' => 'Academic year restored']);
    }

    public function forceDelete($id)
    {
        $year = AcademicYear::withTrashed()->findOrFail($id);
        $year->forceDelete();
        return response()->json(['message' => 'Academic year permanently deleted']);
    }
}
