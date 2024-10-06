<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StudentController;
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

Route::group(['prefix' => 'auth', 'middleware' => 'api'], function () {
    Route::post('login', [AuthController::class, 'authenticate']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'getCurrentUser']);
});

Route::group(['middleware' => ['api', 'jwt.verify']], function () {
    Route::get('report/analytics', [ReportController::class, 'getAnalytics']);
    Route::apiResources([
        'report' => ReportController::class
    ]);
    Route::get('student/search/{query}', [StudentController::class, 'search']);
    Route::get('classroom', [ClassroomController::class, 'index']);
});
