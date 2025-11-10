<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdminController;

// ========== AUTH ROUTES =========;
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/me', [AuthController::class, 'me'])->middleware('auth:sanctum');
Route::put('/me', [AuthController::class, 'update'])->middleware('auth:sanctum');
Route::put('/me/password', [AuthController::class, 'updatePassword'])->middleware('auth:sanctum');



// ========== STUDENTS ==========
Route::get('/students',[StudentController::class,'index']);
Route::post('/students',[StudentController::class,'store']);
Route::put('/students/{id}',[StudentController::class,'update']);
Route::delete('/students/{id}',[StudentController::class,'destroy']);
Route::patch('/students/{id}/archive',[StudentController::class,'archive']);
Route::patch('/students/{id}/restore',[StudentController::class,'restore']);
Route::get('/students/count', [StudentController::class, 'count']);


// Extra endpoints for counts and filtering
Route::get('/students/by-department', [StudentController::class, 'byDepartment']);

// ========== FACULTIES ==========
Route::get('/faculties', [FacultyController::class, 'index']);
Route::post('/faculties', [FacultyController::class, 'store']);
Route::get('/faculties/{id}', [FacultyController::class, 'show']); // optional single faculty
Route::put('/faculties/{id}', [FacultyController::class, 'update']);
Route::delete('/faculties/{id}', [FacultyController::class, 'destroy']);
Route::patch('/faculties/{id}/restore', [FacultyController::class, 'restore']);
Route::patch('/faculties/{id}/archive', [FacultyController::class, 'archive']);
Route::get('/faculties/count', [FacultyController::class, 'count']);

// ========== DEPARTMENTS ==========
Route::get('/departments', [DepartmentController::class, 'index']);
Route::post('/departments', [DepartmentController::class, 'store']);
Route::get('/departments/{id}', [DepartmentController::class, 'show']);
Route::put('/departments/{id}', [DepartmentController::class, 'update']);
Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
Route::patch('/departments/{id}/restore', [DepartmentController::class, 'restore']);
Route::delete('/departments/{id}/force', [DepartmentController::class, 'forceDelete']);


// ========== COURSES ==========
Route::get('/courses', [CourseController::class, 'index']);
Route::post('/courses', [CourseController::class, 'store']);
Route::get('/courses/{id}', [CourseController::class, 'show']);
Route::put('/courses/{id}', [CourseController::class, 'update']);
Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
Route::patch('/courses/{id}/restore', [CourseController::class, 'restore']);
Route::delete('/courses/{id}/force', [CourseController::class, 'forceDelete']);

// ========== ACADEMIC YEARS ==========

Route::get('/academic-years', [AcademicYearController::class, 'index']);
Route::post('/academic-years', [AcademicYearController::class, 'store']);
Route::put('/academic-years/{id}', [AcademicYearController::class, 'update']);
Route::delete('/academic-years/{id}', [AcademicYearController::class, 'destroy']); // archive
Route::patch('/academic-years/{id}/restore', [AcademicYearController::class, 'restore']);
Route::delete('/academic-years/{id}/force', [AcademicYearController::class, 'forceDelete']); // permanent delete


// ========== DASHBOARD ==========
Route::get('/dashboard/students/count', [DashboardController::class, 'studentCount']);
Route::get('/dashboard/faculties/count', [DashboardController::class, 'facultyCount']);
Route::get('/dashboard/departments/count', [DashboardController::class, 'departmentCount']);
Route::get('/dashboard/students/by-department', [DashboardController::class, 'studentsByDepartment']);
Route::get('/dashboard/faculties/by-department', [DashboardController::class, 'facultyByDepartment']);

