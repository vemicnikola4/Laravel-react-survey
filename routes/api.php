<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SurveyController;



// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('survey', SurveyController::class);
  
    Route::get('surveys', [SurveyController::class,'index']);
    Route::get('me', [AuthController::class,'me']);
   
    
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
 Route::get('survey/get-by-slug/{slug}', [SurveyController::class,'getBySlug'])->name('survey.getBySlug');
//pronaci ce survey po slugu i onda u funkciji mozemo da prosledimo survey a ne request
// Route::get('survey/get-by-slug/{survey:slug}', [SurveyController::class,'getBySlug'])->name('survey.getBySlug');
