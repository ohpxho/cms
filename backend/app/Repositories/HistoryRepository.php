<?php

namespace App\Repositories;

use App\Models\History;

class HistoryRepository extends Repository
{
    public function __construct()
    {
        parent::__construct(History::class);
    }
}
