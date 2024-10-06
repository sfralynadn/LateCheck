<?php

namespace App\Http\Controllers;

use App\Http\Resources\AuthResource;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.verify', ['except' => ['authenticate']]);
    }

    public function authenticate()
    {
        $credentials = request(['email', 'password']);
        $token = auth()->attempt($credentials);
        if (!$token) return response()->json(['message' => 'incorrect email or password'], 401);
        $auth = auth()->user();
        $auth->last_logged_in = Carbon::now();
        $auth->save();
        return response()->json(['message' => 'authentication success', 'data' => ['access_token' => $token]]);
    }

    public function getCurrentUser()
    {
        return response()->json([
            'message' => 'current auth data',
            'data' => new AuthResource(auth()->user()->load(['classroom'])),
        ]);
    }

    public function logout()
    {
        if (JWTAuth::invalidate(JWTAuth::getToken())) return response()->json(['message' => 'logout success']);
    }
}
