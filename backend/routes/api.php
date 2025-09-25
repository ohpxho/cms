<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DocumentController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return new UserResource($request->user()->load(['departments']));
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('documents', [DocumentController::class, 'index']);
    Route::post('document', [DocumentController::class, 'store']);
    Route::put('document/{document}', [DocumentController::class, 'update']);
    Route::post('documents/{document}/renew', [DocumentController::class, 'renew']);
});
