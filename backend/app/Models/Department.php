<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;
   
    protected $fillable = [
      'name',
      'email'
    ];
    
    public function users()
    {
      return $this->belongsToMany(User::class, 'user_has_departments', 'department_id', 'user_id');
    }
}
