<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SettingsController extends Controller
{
    private $departments = [];
    private $courses = [];

    public function __construct()
    {
        // Load from storage/app/departments.json if exists
        if (file_exists(storage_path('app/departments.json'))) {
            $this->departments = json_decode(file_get_contents(storage_path('app/departments.json')), true) ?? [];
        }
        if (file_exists(storage_path('app/courses.json'))) {
            $this->courses = json_decode(file_get_contents(storage_path('app/courses.json')), true) ?? [];
        }
    }

    private function saveDepartments()
    {
        file_put_contents(storage_path('app/departments.json'), json_encode($this->departments));
    }

    private function saveCourses()
    {
        file_put_contents(storage_path('app/courses.json'), json_encode($this->courses));
    }

    // Get all departments
    public function getDepartments()
    {
        return response()->json($this->departments);
    }

    // Get courses for a department
    public function getCourses($department)
    {
        return response()->json($this->courses[$department] ?? []);
    }

    // Add new department
    public function addDepartment(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:departments'
        ]);

        $department = $request->name;
        if (!in_array($department, $this->departments)) {
            $this->departments[] = $department;
            $this->courses[$department] = [];
            $this->saveDepartments();
            $this->saveCourses();
            return response()->json(['message' => 'Department added successfully']);
        }

        return response()->json(['message' => 'Department already exists'], 400);
    }

    // Add course to department
    public function addCourse(Request $request)
    {
        $request->validate([
            'department' => 'required|string',
            'name' => 'required|string'
        ]);

        $department = $request->department;
        $course = $request->name;

        if (!in_array($department, $this->departments)) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        if (!in_array($course, $this->courses[$department])) {
            $this->courses[$department][] = $course;
            $this->saveCourses();
            return response()->json(['message' => 'Course added successfully']);
        }

        return response()->json(['message' => 'Course already exists in this department'], 400);
    }

    // Remove department
    public function removeDepartment($department)
    {
        $key = array_search($department, $this->departments);
        if ($key !== false) {
            unset($this->departments[$key]);
            unset($this->courses[$department]);
            $this->departments = array_values($this->departments);
            $this->saveDepartments();
            $this->saveCourses();
            return response()->json(['message' => 'Department removed successfully']);
        }

        return response()->json(['message' => 'Department not found'], 404);
    }

    // Remove course from department
    public function removeCourse($department, $course)
    {
        if (isset($this->courses[$department])) {
            $key = array_search($course, $this->courses[$department]);
            if ($key !== false) {
                unset($this->courses[$department][$key]);
                $this->courses[$department] = array_values($this->courses[$department]);
                $this->saveCourses();
                return response()->json(['message' => 'Course removed successfully']);
            }
        }

        return response()->json(['message' => 'Course or department not found'], 404);
    }

    // Update department name
    public function updateDepartment(Request $request, $oldName)
    {
        $request->validate([
            'name' => 'required|string'
        ]);

        $newName = $request->name;
        $key = array_search($oldName, $this->departments);

        if ($key !== false) {
            $this->departments[$key] = $newName;
            $this->courses[$newName] = $this->courses[$oldName] ?? [];
            unset($this->courses[$oldName]);
            $this->saveDepartments();
            $this->saveCourses();
            return response()->json(['message' => 'Department updated successfully']);
        }

        return response()->json(['message' => 'Department not found'], 404);
    }

    // Update course name
    public function updateCourse(Request $request, $department, $oldName)
    {
        $request->validate([
            'name' => 'required|string'
        ]);

        $newName = $request->name;

        if (isset($this->courses[$department])) {
            $key = array_search($oldName, $this->courses[$department]);
            if ($key !== false) {
                $this->courses[$department][$key] = $newName;
                $this->saveCourses();
                return response()->json(['message' => 'Course updated successfully']);
            }
        }

        return response()->json(['message' => 'Course or department not found'], 404);
    }
}