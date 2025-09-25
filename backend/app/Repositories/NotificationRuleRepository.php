<?php

namespace App\Repositories;

use App\Models\NotificationRules;

class NotificationRuleRepository extends Repository
{
    public function __construct()
    {
        parent::__construct(NotificationRules::class);
    }
}
