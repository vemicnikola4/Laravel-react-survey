<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SurveyController;
use App\Http\Controllers\DashboardController;



// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('survey', SurveyController::class);
  
    Route::get('surveys', [SurveyController::class,'index']);
    Route::get('me', [AuthController::class,'me']);
    Route::get('/dashboard',[DashboardController::class,'index']);
    Route::get('/surveys/{id}/answers',[DashboardController::class,'showSurveyAnswers']);
   
    
});


Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
 Route::get('survey/get-by-slug/{slug}', [SurveyController::class,'getBySlug'])->name('survey.getBySlug');

 
 Route::post('survey/{survey}/answer', [SurveyController::class,'storeAnswer'])->name('survey.store.answer');

//pronaci ce survey po slugu i onda u funkciji mozemo da prosledimo survey a ne request
// Route::get('survey/get-by-slug/{survey:slug}', [SurveyController::class,'getBySlug'])->name('survey.getBySlug');
