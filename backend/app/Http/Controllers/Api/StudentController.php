<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected $student;

    public function __construct(Student $student)
    {
        $this->student = $student;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

    public function search(Request $request)
    {
        $classroomID = $request->query('classroomId');
        $name = $request->query('name');
        $students = [];
        if (!!$name) {
            $students = $this->student->with('classroom')->when($name, function ($query, $name) {
                $query->where('name', 'LIKE', '%' . $name . '%');
            })->when($classroomID, function ($query, $classroomID) {
                $query->where('classroom_id', $classroomID);
            })->orderBy('name', 'ASC')->get();
        }
        return response()->json([
            'message' => 'search student data',
            'data' => StudentResource::collection($students)
        ]);
    }
}
