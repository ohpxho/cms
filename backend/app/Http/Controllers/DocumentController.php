<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\DocumentRequest;
use App\Models\Document;
use App\Http\Resources\DocumentResource;

class DocumentController extends Controller
{ 
  public function store(DocumentRequest $request)
  {
    $data = Document::create($request->validated());
    $data->load(['category', 'updatedBy', 'createdBy']);
    return new DocumentResource($data);
  }
}
