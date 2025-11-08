<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\DashboardController;


// ========== AUTH ROUTES ==========
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// ========== STUDENTS ==========
Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);
Route::patch('/students/{id}/restore', [StudentController::class, 'restore']);
Route::get('/students-count', [StudentController::class, 'count']);
Route::get('/students-dept', [StudentController::class, 'byDepartment']);

// ========== FACULTIES ==========
Route::get('/faculties', [FacultyController::class, 'index']);
Route::post('/faculties', [FacultyController::class, 'store']);
Route::put('/faculties/{id}', [FacultyController::class, 'update']);
Route::delete('/faculties/{id}', [FacultyController::class, 'destroy']);
Route::patch('/faculties/{id}/restore', [FacultyController::class, 'restore']);
Route::get('/faculties-count', [FacultyController::class, 'count']);

// ========== DEPARTMENTS ==========
Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
Route::patch('/departments/{id}/restore', [DepartmentController::class, 'restore']);
Route::get('/departments-count', [DepartmentController::class, 'count']);

// ========== COURSES ==========
Route::get('/courses', [CourseController::class, 'index']);
Route::post('/courses', [CourseController::class, 'store']);
Route::put('/courses/{id}', [CourseController::class, 'update']);
Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
Route::patch('/courses/{id}/restore', [CourseController::class, 'restore']);
Route::get('/courses-count', [CourseController::class, 'count']);

// ========== ACADEMIC YEARS ==========
Route::get('/academic-years', [AcademicYearController::class, 'index']);
Route::post('/academic-years', [AcademicYearController::class, 'store']);
Route::put('/academic-years/{id}', [AcademicYearController::class, 'update']);
Route::delete('/academic-years/{id}', [AcademicYearController::class, 'destroy']);
Route::patch('/academic-years/{id}/restore', [AcademicYearController::class, 'restore']);
Route::get('/academic-years-count', [AcademicYearController::class, 'count']);

// ========== DASHBOARD ==========
Route::get('/students/count', [DashboardController::class, 'studentCount']);
Route::get('/faculties/count', [DashboardController::class, 'facultyCount']);
Route::get('/departments/count', [DashboardController::class, 'departmentCount']);
Route::get('/students/by-department', [DashboardController::class, 'studentsByDepartment']);
Route::get('/faculties/by-department', [DashboardController::class, 'facultyByDepartment']);
