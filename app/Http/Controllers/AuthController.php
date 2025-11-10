<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // ✅ Login User
    public function login(Request $request)
    {       
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // ✅ Logout User
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    // ✅ Get current user info
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // ✅ Update user profile (name/email)
public function update(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
    ]);

    $user->update($data);

    return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
}

public function updatePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required',
        'new_password' => 'required|min:8|confirmed',
    ]);

    $user = $request->user();

    if (!\Hash::check($request->current_password, $user->password)) {
        return response()->json(['message' => 'Current password is incorrect'], 400);
    }

    $user->update(['password' => bcrypt($request->new_password)]);

    return response()->json(['message' => 'Password updated successfully']);
}
}