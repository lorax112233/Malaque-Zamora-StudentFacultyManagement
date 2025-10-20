<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\AuthController;

// Authentication
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Dashboard
Route::get('/students/count', [StudentController::class, 'count']);
Route::get('/students/by-department', [StudentController::class, 'byDepartment']);
Route::get('/faculty/count', [FacultyController::class, 'count']);
Route::get('/departments/count', [FacultyController::class, 'departments']);

// Student & Faculty APIs
Route::apiResource('students', StudentController::class);
Route::put('/students/{id}/restore', [StudentController::class, 'restore']);
Route::apiResource('faculties', FacultyController::class);
Route::put('/faculties/{id}/restore', [FacultyController::class, 'restore']);

