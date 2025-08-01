<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      Category::firstOrCreate([
        'name' => 'License',
        'color' => '#000000',
        'desc' => ''
      ]);
      
      Category::firstOrCreate([
        'name' => 'Subscriptions',
        'color' => '#000000',
        'desc' => ''
      ]);

      Category::firstOrCreate([
        'name' => 'License',
        'color' => '#000000',
        'desc' => ''
      ]);
    }
}
