<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaginationResource;
use App\Http\Resources\ReportResource;
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
        $user = auth()->user();
        $reports = $this->report->with(['student.classroom'])->whereHas('student', function ($query) use ($user) {
            switch ($user->role) {
                case "TEACHER":
                    $query->where('classroom_id', $user->profile->classroom_id);
                    break;
                case "STUDENT":
                    $query->where('student_id', $user->id);
                    break;
            }
        })->orderBy('date', 'DESC')->paginate(10);
        return response()->json([
            'message' => 'data successfully retrieved',
            'data' =>  ReportResource::collection($reports->items()),
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
        //
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
}
