<?php

namespace App\Repositories;

use App\Models\NotificationRules;

class NotificationRuleRepository extends Repository
{
    public function __construct()
    {
        parent::__construct(NotificationRules::class);
    }

    public function updateByDocument(int $id, array $data) 
    {
      $rules = $this->model->where("document", $id)->first();       
      $rules->update($data);

      return $rules->fresh();    
    }
}
