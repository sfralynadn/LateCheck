<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Teacher>
 */
class TeacherFactory extends Factory
{
    protected static ?string $password;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => fake()->name(),
            "nip" => fake()->unique()->numerify("####################"),
            "email" => fake()->email(),
            "contact" => fake()->numerify("############"),
            "role" => fake()->randomElement([1, 2]),
            "classroom_id" => fake()->randomElement([1, 2, 3]),
            "password" => static::$password ??= Hash::make("password"),
            "last_logged_in" => fake()->dateTime(),
        ];
    }
}
