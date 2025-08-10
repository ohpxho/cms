<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Requests\NotificationRules\StoreNotificationRules;
use App\Models\Document;
use App\Http\Resources\DocumentResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DocumentController extends Controller
{
  public function index(Request $request)
  {
    $documents = Document::with(['category', 'createdBy', 'updatedBy', 'rule'])->get();
    return DocumentResource::collection($documents);
  }

  public function store(StoreDocumentRequest $doc, StoreNotificationRules $notif)
  {
    // Debug: Log incoming request data
    \Log::info('Document store request data:', [
      'doc_data' => $doc->all(),
      'notif_data' => $notif->all()
    ]);

    DB::beginTransaction();

    try {
      $validated_doc = $doc->validated();

      if ($doc->hasFile('attachment')) {
        $path = $doc->file('attachment')->store('docs', 'public');
        if (!$path) {
          return response()->json(['response' => false, 'message' => 'Failed to upload the attachment.'], 422);
        }
        $validated_doc["attachment"] = $path;
      }

      $user = Auth::user();
      $validated_doc["created_by"] = $user->id;

      $document = Document::create($validated_doc);

      $validated_notif = $notif->validated();
      $validated_notif['document_id'] = $document->id;
      $document->rule()->create($validated_notif);

      DB::commit();

      $document->load(['category', 'updatedBy', 'createdBy', 'rule']);
      return new DocumentResource($document);

    } catch (\Exception $e) {
      DB::rollback();
      \Log::error('Document creation failed:', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return response()->json(['response' => false, 'message' => 'Failed to create document and notification rule.', 'error' => $e->getMessage()], 422);
    }
  }
}
