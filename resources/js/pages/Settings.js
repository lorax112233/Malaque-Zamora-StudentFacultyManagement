import React, { useState } from "react";
import { Plus, Edit2, Archive, RotateCcw } from "lucide-react";

const tabs = ["Courses", "Departments", "Academic Years"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Courses");
  const [showArchived, setShowArchived] = useState(false);

  const data = {
    Courses: [
      { id: 1, name: "BSCS", status: "Active" },
      { id: 2, name: "BSIT", status: "Active" },
      { id: 3, name: "BSECE", status: "Archived" },
    ],
    Departments: [
      { id: 1, name: "Computer Science", status: "Active" },
      { id: 2, name: "Information Technology", status: "Active" },
      { id: 3, name: "Engineering", status: "Archived" },
    ],
    "Academic Years": [
      { id: 1, name: "2023–2024", status: "Active" },
      { id: 2, name: "2022–2023", status: "Archived" },
    ],
  };

  const filteredData = data[activeTab].filter(
    (item) => (showArchived ? item.status === "Archived" : item.status === "Active")
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-[#A7F3D0] drop-shadow-md mb-10">
          System Settings
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${
                  activeTab === tab
                    ? "bg-[#00B5AD] text-white shadow-lg scale-105"
                    : "bg-[#015E5C]/60 text-[#E9F9F8] hover:bg-[#019C95]/80"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Section Controls */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-semibold text-[#A7F3D0]">
            {activeTab} Management
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-md transition active:scale-95
                ${
                  showArchived
                    ? "bg-[#F87171] text-white hover:bg-[#DC2626]"
                    : "bg-[#036666]/80 text-white hover:bg-[#00B5AD]"
                }`}
            >
              {showArchived ? (
                <>
                  <RotateCcw size={18} /> Show Active
                </>
              ) : (
                <>
                  <Archive size={18} /> Show Archived
                </>
              )}
            </button>

            {!showArchived && (
              <button className="flex items-center gap-2 bg-[#00B5AD] hover:bg-[#019C95] px-4 py-2 rounded-xl text-white font-semibold shadow-md transition active:scale-95">
                <Plus size={18} /> Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#013836]/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-[#015E5C]/40 transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/30 transition"
                    >
                      <td className="p-4">{item.id}</td>
                      <td className="p-4">{item.name}</td>
                      <td
                        className={`p-4 font-medium ${
                          item.status === "Active"
                            ? "text-[#6EE7B7]"
                            : "text-[#F87171]"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="p-4 flex justify-center gap-3">
                        {!showArchived ? (
                          <button className="p-2 bg-[#00B5AD]/20 rounded-lg hover:bg-[#00B5AD]/40 transition">
                            <Edit2 size={18} />
                          </button>
                        ) : null}
                        <button
                          className={`p-2 rounded-lg transition ${
                            showArchived
                              ? "bg-[#00B5AD]/20 hover:bg-[#00B5AD]/40"
                              : "bg-[#F87171]/20 hover:bg-[#F87171]/40"
                          }`}
                        >
                          {showArchived ? (
                            <RotateCcw size={18} />
                          ) : (
                            <Archive size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-6 text-[#A7F3D0] italic"
                    >
                      No {showArchived ? "archived" : "active"}{" "}
                      {activeTab.toLowerCase()} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
