<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected $report;

    public function __construct(Report $report)
    {
        $this->report = $report;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reports = $this->report->all();

        if (count($reports) > 0) return response()->json([
            "message" => "data retrieved successfully",
            "data" => $reports
        ]);
        return response()->json([
            "message" => "data retrieved successfully",
            "data" => []
        ], 201);
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
        $request->validate(["student_nis" => "required"]);
        $report = new $this->report();
        $report->student_nis = $request->student_nis;
        $report->description = $request->description;
        $report->date = now();
        $report->save();
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

    public function getReportByClass(string $id)
    {
        $report = $this->report->where('class_id', $id)->get();
    }
}
