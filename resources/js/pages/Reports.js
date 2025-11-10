import React, { useEffect, useState } from "react";
import api from "../axios";
import { motion } from "framer-motion";

export default function Reports() {
  const [type, setType] = useState("students");
  const [filter, setFilter] = useState("");
  const [data, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Fetch courses & departments for filters
  useEffect(() => {
    const fetchFilters = async () => {
      const [courseRes, deptRes] = await Promise.all([
        api.get("/courses"),
        api.get("/departments"),
      ]);
      setCourses(courseRes.data);
      setDepartments(deptRes.data);
    };
    fetchFilters();
  }, []);

  const fetchReport = async () => {
    try {
      if (type === "students") {
        const res = await api.get("/students", { params: { course: filter } });
        setData(res.data);
      } else {
        const res = await api.get("/faculties", { params: { department: filter } });
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch report.");
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!data.length) return;
    const csvHeader = type === "students" 
      ? ["ID","Name","Email","Course","Department"] 
      : ["ID","Name","Email","Department"];
    const csvRows = data.map((item) =>
      type === "students"
        ? [item.id, `${item.f_name} ${item.l_name}`, item.email_address, item.course?.course_name || "", item.department?.department_name || ""].join(",")
        : [item.id, `${item.f_name} ${item.l_name}`, item.email_address, item.department?.department_name || ""].join(",")
    );
    const csvContent = [csvHeader.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${type}-report.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.h1 className="text-4xl font-bold mb-10 text-[#A7F3D0]">
          Reports
        </motion.h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setFilter(""); setData([]); }}
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
              {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
            </select>
          ) : (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
            </select>
          )}

          <button onClick={fetchReport} className="bg-[#00B5AD] px-6 py-3 rounded-xl text-white font-semibold hover:bg-[#019C95]">
            Generate Report
          </button>
          <button onClick={handleExportCSV} disabled={!data.length} className="bg-[#028C84] px-6 py-3 rounded-xl text-white font-semibold disabled:opacity-50 hover:bg-[#02746E]">
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#013836]/80 rounded-2xl p-2 shadow-lg border border-[#015E5C]/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
              <tr>
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">{type === "students" ? "Course" : "Department"}</th>
              </tr>
            </thead>
            <tbody>
              {data.length ? data.map(item => (
                <tr key={item.id} className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/20 transition">
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.f_name} {item.l_name}</td>
                  <td className="p-4">{type === "students" ? item.course?.course_name || "—" : item.department?.department_name || "—"}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="text-center p-6 text-[#A7F3D0] italic">
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
