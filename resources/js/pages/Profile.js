import React, { useState } from "react";
import { User, LogOut } from "lucide-react";

export default function Profile() {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@example.com");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleSave = () => {
    alert("Profile saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-[#00B5AD]/20 p-6 rounded-full shadow-lg mb-4">
            <User size={64} className="text-[#00B5AD]" />
          </div>
          <h1 className="text-4xl font-bold text-[#A7F3D0] mb-2">My Profile</h1>
          <p className="text-gray-300">Manage your account information</p>
        </div>

        {/* Profile Form */}
        <div className="bg-[#013836]/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-[#015E5C]/40">
          <form className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2 text-[#A7F3D0]">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD] placeholder-gray-300 transition"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-[#A7F3D0]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD] placeholder-gray-300 transition"
              />
            </div>

            <div className="flex justify-between items-center pt-6">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 bg-[#00B5AD] hover:bg-[#019C95] px-6 py-3 rounded-xl font-semibold text-white shadow-md transition active:scale-95"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition active:scale-95"
              >
                <LogOut size={20} /> Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
