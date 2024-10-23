<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthResource;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.verify', ['except' => 'authenticate']);
    }
    public function authenticate()
    {
        $credentials = request()->only(['email', 'password']);
        $token = auth()->attempt($credentials);
        if (!$token) return response()->json(['message' => 'incorrect email or password'], 401);
        $user = auth()->user();
        $user->last_logged_in = now();
        $user->save();
        return response()->json([
            'message' => 'authentication success',
            'data' => $this->respondWithToken($token)
        ]);
    }

    public function getCurrentAuth()
    {
        return response()->json([
            'message' => 'current user data',
            'data' => new AuthResource(auth()->user()->load('profile.classroom'))
        ]);
    }

    public function logout()
    {
        if (JWTAuth::invalidate(JWTAuth::getToken())) return response()->json(['message' => 'logout success']);
    }

    protected function respondWithToken($token)
    {
        return [
            'access_token' => $token,
            'token_type' => 'bearer',
            // 'expires_in' => auth()->factory()->getTTL() * 60
        ];
    }
}
