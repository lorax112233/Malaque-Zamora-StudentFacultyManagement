



import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const modules = [
  { name: "Dashboard", path: "/" },
  { name: "Students", path: "/students" },
  { name: "Faculty", path: "/faculty" },
  { name: "Reports", path: "/reports" },
  { name: "System Settings", path: "/settings" },
  { name: "My Profile", path: "/profile" },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#0A1118] text-gray-200">
      {/* Sidebar */}
      <aside
        className={`bg-[#053D3A] text-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-20"
        } min-h-screen flex flex-col`}
      >
        <div className="p-6 border-b border-[#014F4D] flex items-center justify-center text-teal-300 font-bold text-2xl tracking-wide">
          {sidebarOpen ? "Student Portal" : "SP"}
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          {modules.map((mod) => (
            <Link
              key={mod.name}
              to={mod.path}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-150
                ${location.pathname === mod.path ? "bg-teal-600 text-white scale-105" : "hover:bg-teal-700 hover:text-white"}`}
            >
              {sidebarOpen ? mod.name : mod.name[0]}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-[#014F4D] shadow flex items-center justify-between px-8 py-4 text-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-teal-700 transition"
            title="Toggle Sidebar"
          >
            {/* Hamburger / collapse icon */}
            {(() => {
              const iconPath = sidebarOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />;
              return (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {iconPath}
                </svg>
              );
            })()}
          </button>
          <span className="font-bold text-xl tracking-wide">Welcome!</span>
        </header>
        <main className="flex-1 overflow-y-auto bg-[#0A1118] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
