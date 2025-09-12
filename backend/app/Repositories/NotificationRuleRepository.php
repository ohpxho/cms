<?php

namespace App\Repositories;

use App\Models\NotificationRules;

class NotificationRuleRepository
{
  protected $mode;

  public function __contruct(NotificationRules $model)
  {
    $this->model = $model;
  }

  public function create(array $data)
  {
    return $this->model->create($data);
  }

  public function update($id, array $data)
  {

  }
}
