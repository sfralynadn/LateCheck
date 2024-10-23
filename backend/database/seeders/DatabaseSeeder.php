<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Classroom;
use App\Models\Report;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
        for ($i = 0; $i < 3; $i++):
            Classroom::factory()
                ->has(Teacher::factory()
                    ->has(User::factory()->asTeacher()))
                ->has(Student::factory()->count(30)
                    ->has(User::factory()->asStudent())
                    ->has(Report::factory()->count(fake()->numberBetween(1, 4))))->create();
        endfor;
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
