<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request()->only(["email", "password"]);
        $token = auth()->guard("api")->attempt($credentials);

        if (!$token) return response()->json([
            "message" => "incorrect email or password"
        ], 401);

        return response()->json([
            "message" => "authentication success",
            "data" => [
                "access_token" => $token
            ]
        ], 401);
    }
}
