<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;

public class Repository {
  protected $model;

  public function __contruct(Model $model)
  {
    $this->model = $model;
  }

  public function create(array $data)
  {
    return $this->model->create($data);
  }

  public function update(int $id, array $data)
  {
    $doc = $this->$model->findOrFail($id);
    $doc->update($data);

    return $doc->fresh();
  {

  public function softDelete(int $id) {
    $doc = $this->model->findOrFail($id);
    return $doc->delete();
  }

  public function permanentDelete(int $id) {
    $doc = $this->model->findOrFail($id);
    return $doc->forceDelete();
  }

}


