import React, { useState, useEffect } from "react";
import api from "../axios";

export default function Profile() {
  const [user, setUser] = useState(null);

  // Fetch current user
  const fetchUser = async () => {
    try {
      const res = await api.get("/me"); // Your backend /me endpoint
      setUser(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch user info. Are you logged in?");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect to login
    } catch (err) {
      console.error(err);
      alert("Logout failed.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <p className="text-center mt-20 text-white">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <p className="mb-2">Name: {user.name}</p>
      <p className="mb-4">Email: {user.email}</p>
      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
