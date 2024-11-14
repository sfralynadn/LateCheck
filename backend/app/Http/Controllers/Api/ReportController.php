<?php

namespace App\Http\Controllers\Api;

use App\Exports\ReportExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaginationResource;
use App\Http\Resources\ReportResource;
use App\Models\Report;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Excel as ExcelExcel;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    protected $report;

    public function __construct(Report $report)
    {
        $this->report = $report;
    }

    public function getReports()
    {
        $user = auth()->user();
        $from = request()->query('from');
        $to = request()->query('to');
        $classroom = request()->query('classroom') ?? [];

        $from = $from ? Carbon::parse($from)->startOfDay() : null;
        $to = $to ? Carbon::parse($to)->endOfDay() : null;
        $reports = $this->report
            ->with(['student.classroom'])->whereHas('student', function ($query) use ($user, $classroom) {
                switch ($user->role) {
                    case "TEACHER":
                        $query->where('classroom_id', $user->profile->classroom_id);
                        break;
                    case "STUDENT":
                        $query->where('student_id', $user->profile_id);
                        break;
                }
                if (count($classroom) > 0) {
                    $query->whereIn('classroom_id', $classroom);
                }
            })->when($from && $to, function ($query) use ($from, $to) {
                $query->whereBetween('date', [$from, $to]);
            })->when($from, function ($query) use ($from) {
                $query->whereDate('date', '>=', $from);
            })->when($to, function ($query) use ($to) {
                $query->whereDate('date', '<=', $to);
            })->orderBy('date', 'DESC');

        return $reports;
    }

    /**
     * Display a listing of the resource.
     */

    public function index()
    {
        $reports = $this->getReports()
            ->paginate(10);

        return response()->json([
            'message' => 'data successfully retrieved',
            'data' => ReportResource::collection($reports->items()),
            'pagination' => new PaginationResource($reports)
        ], 200);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $report = new $this->report;
        $report->description = $request->description;
        $report->student_id = $request->student_id;
        $report->date = Carbon::now()->format('Y-m-d');
        $report->save();

        return response()->json([
            'message' => 'report successfully added',
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function export()
    {
        $reports = $this->getReports()->get();
        $filePath = 'exports/' . \Illuminate\Support\Str::uuid() . '-reports.xlsx';
        Excel::store(new ReportExport($reports), $filePath, 'local', \Maatwebsite\Excel\Excel::XLSX);
        if (Storage::exists($filePath)) {
            return response()->file(storage_path('app/' . $filePath))->deleteFileAfterSend(true);
        }
        return response()->json(['message' => 'File tidak ditemukan'], 404);
    }
}
