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
    return DocumentResource::collection(Document::all());
  }

  public function store(StoreDocumentRequest $doc, StoreNotificationRules $notif)
  {
    DB::beginTransaction();

    try {
      $validated_doc = $doc->validated();
      $validated_notif = $notif->validated();

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

      $validated_notif['document_id'] = $document->id;
      $document->notificationRules()->create($validated_notif);

      DB::commit();

      $document->load(['category', 'updatedBy', 'createdBy', 'notificationRules']);
      return new DocumentResource($document);

    } catch (\Exception $e) {
      DB::rollback();
      return response()->json(['response' => false, 'message' => 'Failed to create document and notification rule.'], 422);
    }
  }
}
