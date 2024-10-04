<?php

namespace App\Http\Controllers;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.verify', ['except' => ['authenticate']]);
    }

    public function authenticate()
    {
        $credentials = request(['email', 'password']);
        $token = auth('api')->attempt($credentials);
        if (!$token) return response()->json(['message' => 'incorrect email or password'], 401);
        return response()->json(['message' => 'authentication success', 'data' => ['access_token' => $token]]);
    }

    public function getCurrentUser()
    {
        return response()->json([
            'message' => 'current auth data',
            'data' => auth()->user(),
        ]);
    }
}
