
import React, { useState } from "react";

const tabs = ["Courses", "Departments", "Academic Years"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Courses");

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-teal-300">System Settings</h1>

      <div className="flex gap-4 mb-8 justify-center">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-semibold text-lg shadow transition-all duration-150
              ${activeTab === tab ? "bg-teal-600 text-white scale-105" : "bg-[#014F4D] text-gray-200 hover:bg-teal-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#053D3A] p-8 rounded-2xl shadow-lg text-gray-200 min-h-[180px] flex items-center justify-center">
        <p className="text-xl font-medium">Manage <span className="text-teal-300 font-bold">{activeTab}</span> here (Add/Edit/Archive functionality).</p>
      </div>
    </div>
  );
}
