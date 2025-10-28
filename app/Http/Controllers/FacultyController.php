<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FacultyController extends Controller
{
    // List faculties with pagination and advanced filtering
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $query = Faculty::query();

        // Status filter (active/archived)
        if ($request->status === 'archived') {
            $query->onlyTrashed();
        } else {
            $query->whereNull('deleted_at');
        }

        // Search by name or department (search department name via relation)
        if ($request->search) {
            $term = "%{$request->search}%";
            $query->where(function($q) use ($term) {
                $q->where('name', 'like', $term)
                  ->orWhereHas('department', function($qd) use ($term) {
                      $qd->where('name', 'like', $term);
                  });
            });
        }

        // Department filter (accept name or id)
        if ($request->department) {
            if (is_numeric($request->department)) {
                $query->where('department_id', $request->department);
            } else {
                $query->whereHas('department', function($qd) use ($request) {
                    $qd->where('name', $request->department);
                });
            }
        }

        // Status filter (active/inactive)
        if ($request->employment_status) {
            $query->where('status', $request->employment_status);
        }

        // Sort options
        $sortField = $request->input('sort_field', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $faculties = $query->paginate($perPage);
        
        // Add statistics
        $stats = [
            'total' => Faculty::count(),
            'active' => Faculty::whereNull('deleted_at')->count(),
            'archived' => Faculty::onlyTrashed()->count(),
            'departments' => DB::table('departments')->pluck('name')
        ];

        return response()->json([
            'faculties' => $faculties,
            'stats' => $stats
        ]);
    }

    // Add new faculty
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required', // name or id
        ]);
        // Resolve department id (create if needed)
        if (is_numeric($validated['department'])) {
            $department_id = (int) $validated['department'];
        } else {
            $department = DB::table('departments')->where('name', $validated['department'])->first();
            if (!$department) {
                $department_id = DB::table('departments')->insertGetId(['name' => $validated['department']]);
            } else {
                $department_id = $department->id;
            }
        }

        $faculty = Faculty::create([
            'name' => $validated['name'],
            'department_id' => $department_id,
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json($faculty, 201);
    }

    // Edit faculty
    public function update(Request $request, $id)
    {
        $faculty = Faculty::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required',
        ]);
        // Resolve department id
        if (is_numeric($validated['department'])) {
            $department_id = (int) $validated['department'];
        } else {
            $department = DB::table('departments')->where('name', $validated['department'])->first();
            if (!$department) {
                $department_id = DB::table('departments')->insertGetId(['name' => $validated['department']]);
            } else {
                $department_id = $department->id;
            }
        }

        $faculty->update([
            'name' => $validated['name'],
            'department_id' => $department_id,
            'status' => $validated['status'] ?? $faculty->status,
        ]);

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

    // Permanently delete (force delete) an archived faculty
    public function forceDelete($id)
    {
        $faculty = Faculty::onlyTrashed()->findOrFail($id);
        $faculty->forceDelete();
        return response()->json(['message' => 'Faculty permanently deleted']);
    }

    // Count active faculties (for dashboard)
    public function count()
    {
        $count = Faculty::whereNull('deleted_at')->count();
        return response()->json(['count' => $count]);
    }

    // Count by department (dashboard chart)
    public function byDepartment()
    {
        $data = DB::table('faculties')
            ->join('departments', 'faculties.department_id', '=', 'departments.id')
            ->whereNull('faculties.deleted_at')
            ->select('departments.name as department', DB::raw('COUNT(*) as count'))
            ->groupBy('departments.name')
            ->get();

        return response()->json($data);
    }
}
