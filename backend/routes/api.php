<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\CategoryController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
  return new UserResource($request->user()->load(['departments']));
});

Route::group(['middleware' => ['auth:sanctum']], function() {
  Route::get('categories', [CategoryController::class, 'index']);
});