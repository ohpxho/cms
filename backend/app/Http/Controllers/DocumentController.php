<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\DocumentRequest;
use App\Models\Document;
use App\Http\Resources\DocumentResource;
use Illuminate\Support\Facades\Auth;

class DocumentController extends Controller
{ 
  
  public function index(Request $request) {
    return DocumentResource::collection(Document::all());
  }

  public function store(DocumentRequest $request)
  {
    $validated = $request->validated();

    if($request->hasFile('attachment')) {
      $path = $request->file('attachment')->store('docs', 'public');
      if(!$path) {
        return response()->json(['response' => false, 'message' => 'Failed to upload the attachment.'], 422);
      }
      $validated["attachment"] = $path;
    }

    $user = Auth::user();
    
    $validated["created_by"] = $user->id;

    $data = Document::create($validated);
    $data->load(['category', 'updatedBy', 'createdBy']);
    return new DocumentResource($data);
  }
}
