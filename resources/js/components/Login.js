import React, { useState } from "react";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Invalid credentials");
      return;
    }

    // ✅ Save token and user to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // ✅ Redirect to dashboard
    window.location.href = "/";
  } catch (err) {
    console.error("Network error:", err);
    setError("Network error. Check your backend connection.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#001F1E] relative overflow-hidden">
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#002B2B] via-[#001F1E] to-[#003F3C] opacity-95"></div>
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#00B5AD] blur-[180px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#028A7E] blur-[160px] opacity-10 animate-pulse"></div>

      {/* Login Box */}
      <div className="relative w-[900px] h-[480px] bg-[#012D2C]/60 backdrop-blur-lg rounded-3xl shadow-[0_0_40px_-10px_rgba(0,181,163,0.35)] flex overflow-hidden border border-[#014F4D]/40 z-10">
        {/* Left Section - Logo */}
        <div className="w-1/2 flex flex-col items-center justify-center border-r border-[#00B5A3]/20 bg-[#002624]/40 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-5">
            {/* Logo Icon */}
            <div className="bg-white p-4 rounded-2xl shadow-[0_0_30px_rgba(0,181,163,0.3)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-[#00B5AD]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0-6l9-5m-9 5l-9-5"
                />
              </svg>
            </div>

            {/* Branding Text */}
            <h1 className="text-3xl font-bold text-[#5EF2D0] tracking-wide">
              ACADEMIC
            </h1>
            <p className="text-sm text-[#A9C7C4] uppercase tracking-[4px] font-medium">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-1/2 flex flex-col justify-center items-center px-10 text-white space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#5EF2D0] tracking-wide">
              Welcome Back
            </h2>
            <p className="text-sm text-[#A9C7C4]/90">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#001F1E]/80 text-gray-100 placeholder-gray-400 border border-[#014F4D] focus:border-[#00B5A3] focus:ring-2 focus:ring-[#00B5A3]/30 outline-none transition duration-200"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[#001F1E]/80 text-gray-100 placeholder-gray-400 border border-[#014F4D] focus:border-[#00B5A3] focus:ring-2 focus:ring-[#00B5A3]/30 outline-none transition duration-200"
            />

            <button
              type="submit"
              className="bg-[#00B5A3] hover:bg-[#029E90] w-full py-3 rounded-lg text-white font-semibold shadow-md hover:shadow-[0_0_20px_rgba(0,181,163,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              Login
            </button>

            {error && (
              <div className="text-red-400 text-center mt-2 text-sm bg-red-600/10 border border-red-600/40 px-3 py-2 rounded-md">
                {error}
              </div>
            )}
          </form>

          <p className="text-xs text-[#A9C7C4]/70 pt-4">
            © {new Date().getFullYear()} Academic Admin Portal
          </p>
        </div>
      </div>
    </div>
  );
}
