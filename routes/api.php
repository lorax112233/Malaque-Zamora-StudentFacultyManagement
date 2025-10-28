<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SettingsController;

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Dashboard
Route::get('/students/count', [StudentController::class, 'count']);
Route::get('/students/by-department', [StudentController::class, 'byDepartment']);
Route::get('/faculties/count', [FacultyController::class, 'count']);
Route::get('/faculties/by-department', [FacultyController::class, 'byDepartment']);

// Student & Faculty APIs
Route::apiResource('students', StudentController::class);
Route::put('/students/{id}/restore', [StudentController::class, 'restore']);
// Permanently remove archived student
Route::delete('/students/{id}/force', [StudentController::class, 'forceDelete']);
Route::apiResource('faculties', FacultyController::class);
Route::put('/faculties/{id}/restore', [FacultyController::class, 'restore']);
// Permanently remove archived faculty
Route::delete('/faculties/{id}/force', [FacultyController::class, 'forceDelete']);

// Settings Management
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/departments', [SettingsController::class, 'getDepartments']);
    Route::get('/departments/{department}/courses', [SettingsController::class, 'getCourses']);
    Route::post('/departments', [SettingsController::class, 'addDepartment']);
    Route::post('/departments/{department}/courses', [SettingsController::class, 'addCourse']);
    Route::delete('/departments/{department}', [SettingsController::class, 'removeDepartment']);
    Route::delete('/departments/{department}/courses/{course}', [SettingsController::class, 'removeCourse']);
    Route::put('/departments/{department}', [SettingsController::class, 'updateDepartment']);
    Route::put('/departments/{department}/courses/{course}', [SettingsController::class, 'updateCourse']);
});

