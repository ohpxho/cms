<?php

namespace App\Repositories;

use App\Models\Document;

class DocumentRepository
{
  protected $model;

  public function __construct(Document $model)
  {
    $this->model = $model;
  }

  public function update(int $id, array $data)
  {
    $doc = $this->$model->findOrFail($id);
    $doc->update($data);

    return $doc->fresh();
  }

  public function create(array $data)
  {
    return $this->model->create($data);
  }

}
