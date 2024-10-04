<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReportResource;
use App\Constants\Role;
use App\Http\Resources\PaginationResource;
use App\Models\Report;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    protected $report;
    protected $student;

    public function __construct(Report $report, Student $student)
    {
        $this->report = $report;
        $this->student = $student;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $auth = auth()->user();
        $report = $this->report->with(['student.classroom'])->whereHas('student', function ($query) use ($auth) {
            if ($auth->role == Role::TEACHER) $query->where('classroom_id', $auth->classroom_id);
        })->paginate();

        return response()->json([
            'message' => 'data successfully retrieved',
            'data' => ReportResource::collection($report->items()),
            'pagination' => new PaginationResource($report)
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
        $validator = Validator::make($request->all(), [
            'student_id' => 'required'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'validation error',
                'errors' => $validator->messages(),
            ]);
        }
        $student = $this->student->with(['classroom'])->find($request->student_id);
        if (!$student) return response()->json(['message' => 'student not found'], 404);
        if (auth()->user()->role != Role::ADMIN && auth()->user()->classroom_id != $student->classroom->id) {
            return response()->json([
                'message' => "you're not permitted to do this operation"
            ], 401);
        }
        $report = new $this->report();
        $report->student_id = $request->student_id;
        $report->description = $request->description;
        $report->date = Carbon::today()->toDateString();
        if ($report->saveOrFail()) {
            return response()->json([
                'message' => 'report successfully created'
            ]);
        }
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
