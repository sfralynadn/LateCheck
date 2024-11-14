<?php

namespace App\Imports;

use App\Models\Report;
use App\Models\Student;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class ReportImport implements ToModel, WithHeadingRow
{
    /**
     * @param Collection $collection
     */
    public function model(array $row)
    {
        $student = Student::where('nis', $row['nis'])->first();
        return new Report([
            'student_id' => $student->id,
            'description' => $row['description'],
            'date' => Date::excelToDateTimeObject($row['date'])
        ]);
    }
}
