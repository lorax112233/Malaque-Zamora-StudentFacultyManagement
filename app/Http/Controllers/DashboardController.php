<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Faculty;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function getStats()
    {
        // Basic counts
        $activeStudents = Student::count();
        $archivedStudents = Student::onlyTrashed()->count();
        $activeFaculty = Faculty::count();
        $archivedFaculty = Faculty::onlyTrashed()->count();

        // Get unique departments
        $departments = Student::select('department')
            ->distinct()
            ->pluck('department');

        // Get unique courses
        $courses = Student::select('course')
            ->distinct()
            ->pluck('course');

        return response()->json([
            'counts' => [
                'students' => [
                    'active' => $activeStudents,
                    'archived' => $archivedStudents,
                    'total' => $activeStudents + $archivedStudents
                ],
                'faculty' => [
                    'active' => $activeFaculty,
                    'archived' => $archivedFaculty,
                    'total' => $activeFaculty + $archivedFaculty
                ],
                'departments' => $departments->count(),
                'courses' => $courses->count()
            ]
        ]);
    }

    public function getDistributions()
    {
        // Students per department
        $studentsByDept = Student::select('department')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('department')
            ->get();

        // Students per course
        $studentsByCourse = Student::select('course')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('course')
            ->get();

        // Faculty per department
        $facultyByDept = Faculty::select('department')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('department')
            ->get();

        // Department-Course Matrix
        $deptCourseMatrix = Student::select('department', 'course')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('department', 'course')
            ->get()
            ->groupBy('department')
            ->map(function ($items) {
                return $items->pluck('count', 'course');
            });

        return response()->json([
            'studentsByDepartment' => $studentsByDept,
            'studentsByCourse' => $studentsByCourse,
            'facultyByDepartment' => $facultyByDept,
            'departmentCourseMatrix' => $deptCourseMatrix
        ]);
    }

    public function getTrends()
    {
        $now = Carbon::now();
        $startOfYear = $now->copy()->startOfYear();
        $months = [];

        // Generate last 12 months
        for ($i = 0; $i < 12; $i++) {
            $month = $now->copy()->subMonths($i);
            $months[] = [
                'month' => $month->format('M Y'),
                'start' => $month->startOfMonth()->toDateString(),
                'end' => $month->endOfMonth()->toDateString()
            ];
        }

        // Get monthly registrations
        $studentTrends = collect($months)->map(function ($month) {
            return [
                'month' => $month['month'],
                'count' => Student::whereBetween('created_at', [$month['start'], $month['end']])->count()
            ];
        });

        $facultyTrends = collect($months)->map(function ($month) {
            return [
                'month' => $month['month'],
                'count' => Faculty::whereBetween('created_at', [$month['start'], $month['end']])->count()
            ];
        });

        return response()->json([
            'students' => $studentTrends,
            'faculty' => $facultyTrends
        ]);
    }

    public function getActivitySummary()
    {
        $today = Carbon::today();
        $lastWeek = Carbon::now()->subWeek();

        // Recent activity
        $recentStudents = Student::where('created_at', '>=', $lastWeek)
            ->orWhere('updated_at', '>=', $lastWeek)
            ->orWhere('deleted_at', '>=', $lastWeek)
            ->with(['deleted_at' => null])
            ->get()
            ->map(function ($student) {
                return [
                    'type' => 'student',
                    'id' => $student->id,
                    'name' => $student->name,
                    'action' => $student->deleted_at ? 'archived' : 
                        ($student->created_at->gt($student->updated_at) ? 'added' : 'updated'),
                    'date' => $student->deleted_at ?? 
                        ($student->created_at->gt($student->updated_at) ? 
                            $student->created_at : $student->updated_at)
                ];
            });

        $recentFaculty = Faculty::where('created_at', '>=', $lastWeek)
            ->orWhere('updated_at', '>=', $lastWeek)
            ->orWhere('deleted_at', '>=', $lastWeek)
            ->with(['deleted_at' => null])
            ->get()
            ->map(function ($faculty) {
                return [
                    'type' => 'faculty',
                    'id' => $faculty->id,
                    'name' => $faculty->name,
                    'action' => $faculty->deleted_at ? 'archived' : 
                        ($faculty->created_at->gt($faculty->updated_at) ? 'added' : 'updated'),
                    'date' => $faculty->deleted_at ?? 
                        ($faculty->created_at->gt($faculty->updated_at) ? 
                            $faculty->created_at : $faculty->updated_at)
                ];
            });

        // Combine and sort by date
        $recentActivity = $recentStudents->concat($recentFaculty)
            ->sortByDesc('date')
            ->values();

        return response()->json([
            'recentActivity' => $recentActivity
        ]);
    }
}