<?php

namespace App\Exports;

use App\Models\Report;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ReportExport implements FromCollection, WithMapping, WithHeadings
{

    protected $reports;

    public function __construct($reports)
    {
        $this->reports = $reports;
    }
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return $this->reports;
    }

    public function map($report): array
    {
        return [
            $report->student->name,
            $report->student->nis,
            $report->student->classroom->name,
            $report->description,
            $report->date
        ];
    }

    public function headings(): array
    {
        return [
            'Name',
            'NIS',
            'Classroom',
            'Description',
            'Date'
        ];
    }
}
