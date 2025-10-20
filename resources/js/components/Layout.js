import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

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
    <div className="flex h-screen bg-[#001F1E] text-[#D7F2EF] font-inter">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-[#002E2D] via-[#012725] to-[#001F1E] shadow-[4px_0_20px_rgba(0,181,163,0.15)] border-r border-[#014F4D]/40`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-[#00B5AD]/20">
          <h1 className="font-bold text-2xl tracking-wide text-[#5EF2D0]">
            {sidebarOpen ? "ACADEMIC" : "A"}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-col gap-1 px-3">
          {modules.map((mod) => {
            const isActive = location.pathname === mod.path;
            return (
              <Link
                key={mod.name}
                to={mod.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-[#00B5AD]/20 text-[#5EF2D0] border border-[#00B5AD]/40 shadow-[0_0_10px_rgba(0,181,163,0.3)]"
                    : "text-gray-300 hover:bg-[#014542]/60 hover:text-white"
                }`}
              >
                {sidebarOpen ? mod.name : mod.name.charAt(0)}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="mt-auto px-5 py-6 border-t border-[#014F4D]/40 flex items-center gap-3 bg-[#002B2B]/80 backdrop-blur-sm">
          <div className="bg-[#00B5AD] text-white font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-[0_0_20px_rgba(0,181,163,0.3)]">
            AD
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-semibold text-white leading-tight">
                Admin User
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-[#002725]/60 backdrop-blur-lg border-b border-[#00B5AD]/20 shadow-[0_2px_20px_rgba(0,181,163,0.1)] flex items-center justify-between px-8 py-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#014542]/40 transition"
            title="Toggle Sidebar"
          >
            {sidebarOpen ? (
              <X className="text-[#5EF2D0]" size={22} />
            ) : (
              <Menu className="text-[#5EF2D0]" size={22} />
            )}
          </button>
          <span className="font-semibold text-[#5EF2D0] text-sm tracking-wide">
            Welcome back, <span className="text-white">Admin</span>
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#001F1E] via-[#002E2D] to-[#013532] p-10 text-gray-100">
          <div className="max-w-7xl mx-auto bg-[#002926]/60 backdrop-blur-md border border-[#014F4D]/40 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,181,163,0.1)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
