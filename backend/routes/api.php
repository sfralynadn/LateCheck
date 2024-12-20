<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('login', [AuthController::class, 'authenticate']);
    Route::get('me', [AuthController::class, 'getCurrentAuth']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::group(['middleware' => 'api'], function () {
    Route::get('student/search', [StudentController::class, 'search']);
    Route::apiResource('classroom', ClassroomController::class);
});

Route::middleware(['jwt.verify'])->group(function () {
    Route::get('/report/export', [ReportController::class, 'export']);
    Route::post('/report/import', [ReportController::class, 'import'])->middleware(['role:ADMIN,TEACHER']);
    Route::apiResource('report', ReportController::class);
});
