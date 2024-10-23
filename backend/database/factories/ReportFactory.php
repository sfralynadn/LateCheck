<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $currMonth = Carbon::now()->month;
        $year = Carbon::now()->year;
        $month = fake()->numberBetween($currMonth - 5, $currMonth);

        if ($month < 1) {
            $month += 12;
            $year--;
        } elseif ($month > 12) {
            $month -= 12;
            $year++;
        }

        return [
            'description' => fake()->randomElement([
                'Kesiangan',
                'Ban Bocor',
                'Isi Bensin',
                'Nunggu Gojek',
                'Nunggu Angkot',
                'Kurang Enak Badan',
                'Mandi Seabad'
            ]),
            'date' => Carbon::create($year, $month, fake()->numberBetween(1, 28))
        ];
    }
}
