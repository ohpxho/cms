<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\DepartmentResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'roles' => $this->getRoleNames()->join(', '),
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'departments' => DepartmentResource::collection($this->whenLoaded('departments')),
            'is_active' => $this->is_active,
            'created_at' => $this->created_at,
        ];
    }
}
