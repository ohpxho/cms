<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
  
  public function index(Request $request) {
    return CategoryResource::collection(Category::all());
  }
}
