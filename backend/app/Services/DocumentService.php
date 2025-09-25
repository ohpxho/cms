<?php

namespace App\Services;

use App\Repositories\DocumentRepository;
use App\Repositories\NotificationRuleRepository;
use App\Repositories\HistoryRepository;
use Illuminate\Support\Facades\DB;

class DocumentService
{
    public function createDocument(array $data)
    {
        $docRepo = new DocumentRepository();
        $rulesRepo = new NotificationRuleRepository();
        $response = ["data" => null, "error" => null];

        DB::beginTransaction();
        try {
            $doc = $docRepo->create($data["doc"]);
            $data["rules"]["document_id"] = $doc->id;
            $rulesRepo->create($data["rules"]);

            DB::commit();

            $response["data"] = $doc->load(["category", "updatedBy", "createdBy", "rule"]);
            return $response;

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Document creation failed:', [
              'error' => $e->getMessage(),
              'trace' => $e->getTraceAsString()
            ]);

            $response["error"] = $e->getMessage();
            return $response;
        }
    }

    public function updateDocument(int $id, array $data)
    {
        $docRepo = new DocumentRepository();
        $rulesRepo = new NotificationRuleRepository();
        $response = ["data" => null, "error" => null];

        DB::beginTransaction();
        try {
            $doc = $docRepo->update($id, $data["doc"]);
            $rules = $rulesRepo->update($id, $data["rules"]);
            DB::commit();

            $response["data"] = $doc->load(["category", "updatedBy", "createdBy", "rule"]);
            return $response;
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error("Document failed to update:", [
              "error" => $e->getMessage(),
              "trace" => $e->getTraceAsString()
            ]);
            $response["error"] = $e->getMessage();
            return $response;
        }
    }

    public function renewDocument(int $id, array $data)
    {
        $docRepo = new DocumentRepository();
        $rulesRepo = new NotificationRuleRepository();
        $historyRepo = new HistoryRepository();
        $response = ["data" => null, "error" => null];

        DB::beginTransaction();
        try {
            $history = $historyRepo->create($data["oldDoc"]);
            $doc = $docRepo->update($id, $data["newDoc"]);
            $rules = $rulesRepo->update($id, $data["rules"]);

            DB::commit();

            $response["data"] = $doc->load(["category", "updatedBy", "createdBy", "rule"]);
            return $response;

        } catch (\Exception $e) {
            DB::rollback();
            \Log::error("Document failed to renew:", [
              "error" => $e->getMessage(),
              "trace" => $e->getTraceAsString()
            ]);
            $response["error"] = $e->getMessage();
            return $response;
        }
    }
}
