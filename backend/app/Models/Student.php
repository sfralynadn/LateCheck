<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    public function user()
    {
        return $this->morphOne(User::class, 'profile');
    }

    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class);
    }
}
