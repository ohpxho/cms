<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Document\StoreDocumentRequest;
use App\Http\Requests\NotificationRules\StoreNotificationRules;
use App\Models\Document;
use App\Http\Resources\DocumentResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\DocumentService;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $documents = Document::with(['category', 'createdBy', 'updatedBy', 'rule'])->get();
        return DocumentResource::collection($documents);
    }

    public function store(StoreDocumentRequest $doc, StoreNotificationRules $notif)
    {
        \Log::info('Document store request data:', [
          'doc_data' => $doc->all(),
          'notif_data' => $notif->all()
        ]);


        $validatedDocument = $doc->validated();
        $validatedNotification = $notif->validated();

        $user = Auth::user();
        $validatedDocument["created_by"] = $user->id;

        [$path, $error] = $this->handleFileUpload($doc, "attachment");

        if ($error) {
            return response()->json([
              "response" => false,
              "message" => "Failed to updload the attachment.",
              "error" => $e->getMessage()
            ], 422);
        }

        $validatedDocument["attachment"] = $path;

        $data = [
          "doc" => $validatedDocument,
          "rules" => validatedNotification,
        ];

        $docService = new DocumentService();
        $createdDoc = $docService->createDocument($data);

        if (array_key_exists("error", $createdDoc) && !is_null($createdDoc["error"])) {
            return response()->json([
              'response' => false,
              'message' => 'Failed to create document and notification rule.',
              'error' => $createdDoc["error"]
            ], 422);
        }

        return new DocumentResource($createdDoc["data"]);
    }

    public function update(StoreDocumentRequest $doc, StoreNotificationRules $notif, Document $document)
    {

        \Log::info("Document update request data:", [
          "doc_data" => $doc->all(),
          "notif_data" => $notif->all
        ]);

        $user = Auth::user();
        $validatedDocument = $doc->validated();
        $validatedNotification = $notif->validated();

        $validatedDocument["updated_by"] = $user->id;

        [$path, $error] = $this->handleFileUpload($doc, "attachment");

        if ($error) {
            return response()->json([
              "response" => false,
              "message" => "Failed to upload the attachment",
              "error" => $e->getMessage()
            ], 422);
        }

        $validatedDocument["attachment"] = $path;
        $id = $document->id;
        $data = [
          "doc" => $validatedDocument,
          "rules" => $validatedNotification,
        ];
        $docService  = new DocumentService();
        $updatedDoc = $docService->updateDocument($id, $data);

        if (array_key_exists("error", $updatedDoc) || !is_null($updatedDoc["error"])) {
            return response()->json([
              "response" => false,
              "message" => "Failed to update document and notification rule.",
              "error" => $updatedDoc["error"]
            ], 422);
        }

        return new DocumentResource($updatedDoc["data"]);

    }

    public function renew(StoreDocumentRequest $doc, StoreNotificationRules $notif, Document $document)
    {
        \Log::info("Document renew request data:", [
         "old_doc_data" => $document->all(),
          "new_doc_data" => $doc->all(),
          "notif_data" => $notif->all
        ]);

        $user = Auth::user();
        $validatedDocument = $doc->validated();
        $validatedNotification = $notif->validated();

        $validatedDocument["updated_by"] = $user->id;

        [$path, $error] = $this->handleFileUpload($doc, "attachment");

        if ($error) {
            return response()->json([
              "response" => false,
              "message" => "Failed to upload the attachment",
              "error" => $e->getMessage()
            ], 422);
        }

        $validatedDocument["attachment"] = $path;
        $id = $document->id;
        $data = [
          "newDoc" => $validatedDocument,
          "oldDoc" => $document->toArray(),
          "rules" => $validatedNotification,
        ];
        $docService  = new DocumentService();
        $renewedDoc = $docService->renewDocument($id, $data);

        if (array_key_exists("error", $renewedDoc) && !is_null($renewedDoc["error"])) {
            return response()->json([
              "response" => false,
              "message" => "Failed to update document and notification rule.",
              "error" => $renewedDoc["error"]
            ], 422);
        }

        return new DocumentResource($renewedDoc["data"]);
    }

    public function handleFileUpload(Request $request, string $field = 'attachment')
    {
        if ($request->hasFile($field)) {
            $path = $request->file($field)->store("docs", "public");
            if (!$path) {
                return [false, "Failed to upload the attachment."];
            }

            return [$path, null];
        }
        return [null, null];
    }
}
