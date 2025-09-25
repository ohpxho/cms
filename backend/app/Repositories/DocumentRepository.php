<?php

namespace App\Repositories;

use App\Models\Document;

class DocumentRepository extends Repository
{
    public function __construct()
    {
        parent::__construct(Document::class);
    }
}
