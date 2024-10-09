<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
        \App\Models\Classroom::factory()
            ->has(\App\Models\Teacher::factory()->count(1))
            ->has(\App\Models\Student::factory()->has(\App\Models\Report::factory()->count(fake()->numberBetween(1, 5)), 'reports')->count(30), 'students')
            ->create();
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
