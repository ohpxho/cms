<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Document;

class NotificationRules extends Model
{
    /** @use HasFactory<\Database\Factories\NotificationRulesFactory> */
    use HasFactory;

    protected $fillable = [
      'notify_before',
      'time_unit',
      'frequency',
    ];

    protected $with = ['document'];

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}
