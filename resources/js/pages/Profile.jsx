



import React, { useState } from "react";

export default function Profile() {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@example.com");

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-teal-300">My Profile</h1>
      <div className="bg-[#053D3A] p-8 rounded-2xl shadow-lg">
        <form className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2 text-teal-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2 text-teal-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg"
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" className="bg-teal-500 px-6 py-2 rounded-xl font-bold text-lg shadow hover:bg-teal-600 active:scale-95 transition transform text-white">
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
              className="bg-red-600 px-6 py-2 rounded-xl font-bold text-lg shadow hover:bg-red-700 active:scale-95 transition transform text-white"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
    