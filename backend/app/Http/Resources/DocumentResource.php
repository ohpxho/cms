<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\UserResource;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
          'id' => $this->id,
          'name' => $this->name,
          'issuing_authority' => $this->issuing_authority,
          'date_issued' => $this->date_issued,
          'date_expired' => $this->date_expired,
          'attachment' => $this->attachment,
          'remarks' => $this->remarks,
          'last_sent_email' => $this->last_sent_email,
          'category' => new CategoryResource($this->whenLoaded('category')),
          'created_by' => new UserResource($this->whenLoaded('createdBy')),
          'updated_by' => new UserResource($this->whenLoaded('updatedBy')),
          'notification_rules' => $this->whenLoaded('rule', function () {
              return [
                'notify_before' => $this->rule->notify_before,
                'time_unit' => $this->rule->time_unit,
                'frequency' => $this->rule->frequency
              ];
          })
        ];
    }
}
