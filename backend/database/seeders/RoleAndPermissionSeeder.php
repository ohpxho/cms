<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      $permissions = [
        'view document',
        'add document',
        'edit document',
        'delete document',

        'view users',
        'add user',
        'edit user',
        'delete user',

        'view category',
        'add category',
        'edit category',
        'delete category',

        'view department',
        'add department',
        'edit department',
        'delete department'
      ];

      foreach($permissions as $permission) {
        Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
      }
      
      $roles  = [
        'user' => [
          'view document',
          'add document',
          'edit document',
          'delete document'
        ]
      ];
      

      foreach($roles as $role => $permissions) {
        $newRole = Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        $newRole->syncPermissions($permissions);
      }
    }
}
