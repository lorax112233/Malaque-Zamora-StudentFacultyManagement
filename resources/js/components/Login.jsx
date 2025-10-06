import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Use 127.0.0.1 instead of localhost
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // needed if you use cookies/session
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        // Handle Laravel unauthorized error
        if (res.status === 401) {
          setError("Invalid email or password");
        } else {
          setError("Login failed. Please try again.");
        }
        return;
      }

      const data = await res.json();

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Check your server connection.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#0A1118]">
      <div className="w-full max-w-md bg-[#053D3A] shadow-lg rounded-2xl p-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-teal-300">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg"
          />
          <button
            type="submit"
            className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold shadow hover:bg-teal-700 active:scale-95 transition transform text-lg"
          >
            Sign In
          </button>
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
}
