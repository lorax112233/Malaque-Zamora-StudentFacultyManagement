<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    // 🟢 Get the currently authenticated admin
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // 🟡 Update profile details
    public function update(Request $request)
    {
        $admin = $request->user();

        $validated = $request->validate([
            'username' => 'sometimes|string|max:255|unique:admins,username,' . $admin->id,
            'email' => 'sometimes|email|max:255|unique:admins,email,' . $admin->id,
        ]);

        $admin->update($validated);

        return response()->json(['message' => 'Profile updated successfully', 'admin' => $admin]);
    }

    // 🟠 Update password
    public function updatePassword(Request $request)
    {
        $admin = $request->user();

        $validated = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        if (!Hash::check($validated['current_password'], $admin->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['The current password is incorrect.'],
            ]);
        }

        $admin->password = Hash::make($validated['new_password']);
        $admin->save();

        return response()->json(['message' => 'Password updated successfully']);
    }

    // 🔴 Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
