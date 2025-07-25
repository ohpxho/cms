<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $user = User::create([
          'name' => 'Lemuel k So',
          'email' => 'lemuelk.so@nykfil.com.ph',
          'password' => Hash::make('2025@nsm1'),
      ]);

      $role = Role::findOrCreate('admin');
      $user->assignRole($role);
      $user->save();
      
    }
}
