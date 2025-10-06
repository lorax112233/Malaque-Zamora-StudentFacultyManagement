
<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\AuthController; // ✅ added semicolon

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider within the "api"
| middleware group. Build your API here.
|
*/

Route::post('/login', [AuthController::class, 'login']); // ✅ use controller method

Route::apiResource('students', StudentController::class);
Route::apiResource('faculties', FacultyController::class);
Route::post('/logout', [AuthController::class, 'logout']);
