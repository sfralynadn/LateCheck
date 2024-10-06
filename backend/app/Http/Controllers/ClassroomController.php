<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    protected $classroom;

    public function __construct(Classroom $classroom)
    {
        $this->classroom = $classroom;
    }
    public function index()
    {
        return response()->json(['message' => 'data retrieved successfully', 'data' => $this->classroom->all()]);
    }
}
