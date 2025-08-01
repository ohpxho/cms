<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentFactory> */
    use HasFactory; 
    
    protected $fillable = [
      'name',
      'category',
      'issuing_authority',
      'date_issued',
      'date_expired',
      'attachment',
      'category_id',
      'created_by',
      'uploaded_by',
      'last_sent_email',
      'remarks',
    ];
    
    protected $with = [
      'category',
      'createdBy',
      'updatedBy'
    ];

    protected $casts = [
      'date_issued' => 'datetime',
      'date_expired' => 'datetime',
      'last_sent_email' => 'datetime'
    ];
    
    public function category() {
      return $this->belongsTo(Category::class, 'category_id');
    }

    public function createdBy() {
      return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy() {
      return $this->belongsTo(User::class, 'updated_by');
    }
}
