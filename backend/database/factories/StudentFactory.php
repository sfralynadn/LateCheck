<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nis' => fake()->randomNumber(5),
            'name' => fake()->name(),
            'gender' => fake()->randomElement(["W", "M"]),
            'contact' => fake()->numerify("############"),
            'classroom_id' => fake()->randomElement([1, 2, 3]),
            'address' => fake()->address(),
        ];
    }
}
