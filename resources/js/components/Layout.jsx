import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Student-Faculty System
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link className="block p-2 rounded hover:bg-gray-700" to="/">
            Dashboard
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-700" to="/students">
            Students
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-700" to="/faculty">
            Faculty
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-700" to="/reports">
            Reports
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-700" to="/settings">
            Settings
          </Link>
          <Link className="block p-2 rounded hover:bg-gray-700" to="/profile">
            My Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow p-4 flex justify-between">
          <h1 className="font-bold text-xl">Dashboard</h1>
          <button className="bg-primary text-white px-4 py-2 rounded">
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
