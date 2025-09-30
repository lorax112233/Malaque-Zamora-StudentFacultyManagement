import React from "react";

export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-primary">Login</h1>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded mb-3"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded mb-3"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded hover:bg-teal-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
