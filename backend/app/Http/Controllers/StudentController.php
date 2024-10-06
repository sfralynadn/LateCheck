<?php

namespace App\Http\Controllers;

use App\Http\Resources\StudentResource;
use App\Models\Student;

class StudentController extends Controller
{
    protected $student;

    public function __construct(Student $student)
    {
        $this->student = $student;
    }
    public function search(string $query = ' ')
    {
        $student = $this->student->with('classroom')->where('name', 'LIKE', '%' . $query . '%')->get();
        return response()->json([
            'message' => 'data successfully retrieved',
            'data' => StudentResource::collection($student)
        ], 200);
    }
}
