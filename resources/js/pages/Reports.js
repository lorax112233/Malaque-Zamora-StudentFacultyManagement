import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function Reports() {
  const [type, setType] = useState("students");
  const [filter, setFilter] = useState("");
  const [data, setData] = useState([]);

  const fetchReport = async () => {
    try {
      if (type === "students") {
        const res = await axios.get("/api/students", {
          params: { course: filter },
        });
        setData(res.data);
      } else {
        const res = await axios.get("/api/faculties", {
          params: { department: filter },
        });
        setData(res.data);
      }
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  useEffect(() => {
    setData([]);
    setFilter("");
  }, [type]);

  const handleExportCSV = () => {
    if (data.length === 0) return;

    const csvHeader = ["ID", "Name", type === "students" ? "Course" : "Department"];
    const csvRows = data.map((item) =>
      [item.id, item.name, type === "students" ? item.course : item.department].join(",")
    );

    const csvContent = [csvHeader.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${type}-report.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-[#A7F3D0] drop-shadow-md mb-10">
          Reports
        </h1>

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white flex-1 focus:ring-2 focus:ring-[#00B5AD]"
          >
            <option value="students">Student Report</option>
            <option value="faculty">Faculty Report</option>
          </select>

          {type === "students" ? (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
            >
              <option value="">All Courses</option>
              <option value="BSCS">BSCS</option>
              <option value="BSIT">BSIT</option>
              <option value="BSECE">BSECE</option>
            </select>
          ) : (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Engineering">Engineering</option>
            </select>
          )}

          <button
            onClick={fetchReport}
            className="bg-[#00B5AD] hover:bg-[#019C95] px-6 py-3 rounded-xl font-semibold text-white shadow-md transition transform active:scale-95"
          >
            Generate Report
          </button>

          <button
            onClick={handleExportCSV}
            disabled={data.length === 0}
            className="bg-[#028C84] hover:bg-[#02746E] px-6 py-3 rounded-xl font-semibold text-white shadow-md transition disabled:opacity-50"
          >
            Export CSV
          </button>

          <button
            onClick={handlePrint}
            disabled={data.length === 0}
            className="bg-[#00695C] hover:bg-[#004D40] px-6 py-3 rounded-xl font-semibold text-white shadow-md transition disabled:opacity-50"
          >
            Print
          </button>
        </div>

        {/* Summary */}
        {data.length > 0 && (
          <div className="flex gap-6 mb-6">
            <div className="bg-[#014F4D]/70 px-6 py-4 rounded-xl shadow text-center flex-1">
              <p className="text-lg font-semibold text-[#A7F3D0]">
                Total {type === "students" ? "Students" : "Faculty"}
              </p>
              <p className="text-3xl font-bold text-white">{data.length}</p>
            </div>
            {filter && (
              <div className="bg-[#014F4D]/70 px-6 py-4 rounded-xl shadow text-center flex-1">
                <p className="text-lg font-semibold text-[#A7F3D0]">
                  Filter: {filter}
                </p>
                <p className="text-xl text-white">
                  {type === "students" ? "Course" : "Department"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {data.length > 0 && (
          <div className="mb-4 text-right text-gray-300 text-sm italic">
            Generated on {new Date().toLocaleDateString()} at{" "}
            {new Date().toLocaleTimeString()}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto bg-[#013836]/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#015E5C]/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
              <tr>
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                {type === "students" ? (
                  <th className="p-4 font-semibold">Course</th>
                ) : (
                  <th className="p-4 font-semibold">Department</th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/30 transition"
                  >
                    <td className="p-4">{item.id}</td>
                    <td className="p-4">{item.name}</td>
                    <td className="p-4">
                      {type === "students" ? item.course : item.department}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center p-6 text-[#A7F3D0] italic"
                  >
                    No {type} report data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
