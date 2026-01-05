<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BookCategory;

class BookCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Programming','English','Science','Mathematics','History'];

        foreach ($categories as $category) {
            BookCategory::create(['name' => $category]);
        }
    }
}
