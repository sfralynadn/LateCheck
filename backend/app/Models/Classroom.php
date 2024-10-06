<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function teacher()
    {
        return $this->hasOne(Teacher::class);
    }
}
