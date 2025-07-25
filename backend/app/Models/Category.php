<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;
    
    protected $fillable = [
       'name',
       'color',
       'desc'
    ];
    
    public function documents() {
      return $this->hasMany(Document::class, 'category_id');
    }
}
