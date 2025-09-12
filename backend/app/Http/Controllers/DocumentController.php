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
      $validatedDocument = $doc->validated();

      if ($doc->hasFile('attachment')) {
        $path = $doc->file('attachment')->store('docs', 'public');
        if (!$path) {
          return response()->json(['response' => false, 'message' => 'Failed to upload the attachment.'], 422);
        }
        $validatedDocument["attachment"] = $path;
      }

      $user = Auth::user();
      $validatedDocument["created_by"] = $user->id;

      $document = Document::create($validatedDocument);

      $validatedNotification = $notif->validated();
      $validatedNotification['document_id'] = $document->id;
      $document->rule()->create($validatedNotification);

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

  public function update(StoreDocumentRequest $request, StoreNotificationRules $notif, Document $document)
  {
    DB::beginTransaction();
    try {
      $validatedRequest = $request->validated();

      if ($request->hasFile('attachment')) {
        $path = $request->file('attachment')->store('docs', 'public');

        if (!$path) {
          return response()->json(['response' => false, 'message' => 'Failed to upload the attachment.'], 422);
        }

        $validatedRequest["attachment"] = $path;
      }

      $user = Auth::user();
      $validatedRequest["updated_by"] = $user->id;

      $document->update($validatedRequest);

      $validatedNotification = $notif->validated();
      $validatedNotification['document_id'] = $document->id;
      $document->rule()->updateOrCreate(['document_id' => $document->id], $validatedNotification);

      DB::commit();

      $document->load(['category', 'updatedBy', 'createdBy', 'rule']);
      return new DocumentResource($document);

    } catch (\Exception $e) {
      DB::rollback();
      \Log::error('Document update failed:', [
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
      ]);
      return response()->json(['response' => false, 'message' => 'Failed to update document and notification rule.', 'error' => $e->getMessage()], 422);
    }
  }

  public function renew(StoreDocumentRequest $request, StoreNotificationRules $notif, Document $document)
  {
    DB::beginTransaction();
    try {
      $validatedRequest = $request->validated();
    } catch (\Exception $e) {
      DB::rollback();
      \Log::error("Dcoument renew failed:", [
          'error' => $e->getMessage(),
          'trace' => $e->getTraceAsString()
      ]);

      return response()->json(['response' => false, 'message' => "Failed to renew document and notification rule.", 'error' => $e->getMessage()], 422);
    }
  }
}
