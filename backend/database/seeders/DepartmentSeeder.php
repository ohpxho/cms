<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $departments = [
        ['name' => 'IT Operations Department', 'email' => 'it.center@nykil.com.ph'],
        ['name' => 'General Service Department', 'email' => 'noreen.reyes@nykil.com.ph'],
        ['name' => 'Human Resource Department', 'email' => 'gmsupporthr@nykfil.com.ph'],
        ['name' => 'Purchasing Department', 'email' => 'cad@nykfil.com.ph']
      ];

      foreach($departments as $department) {
        Department::firstOrCreate(['name' => $department['name'], 'email' => $department['email']]);
      }

    }
}
