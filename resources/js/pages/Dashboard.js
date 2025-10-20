import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "../axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    departments: 0,
  });

  const [studentChartData, setStudentChartData] = useState({ labels: [], datasets: [] });
  const [facultyChartData, setFacultyChartData] = useState({ labels: [], datasets: [] });

  const fetchStats = async () => {
    try {
      // Counts
      const studentRes = await axios.get("/api/students/count");
      const facultyRes = await axios.get("/api/faculties/count"); // FIX: plural
      const deptRes = await axios.get("/api/departments/count");

      setStats({
        students: studentRes.data.count ?? 0,
        faculty: facultyRes.data.count ?? 0,
        departments: deptRes.data.count ?? 0,
      });

      // Students per department
      const studentChartRes = await axios.get("/api/students/by-department");
      const studentArray = studentChartRes.data.data || studentChartRes.data;

      setStudentChartData({
        labels: studentArray.map((d) => d.department),
        datasets: [
          {
            label: "Students per Department",
            data: studentArray.map((d) => d.count),
            backgroundColor: "#00B5AD99",
            borderColor: "#00B5AD",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      });

      // Faculty per department
      const facultyChartRes = await axios.get("/api/faculties/by-department");
      const facultyArray = facultyChartRes.data.data || facultyChartRes.data;

      setFacultyChartData({
        labels: facultyArray.map((d) => d.department),
        datasets: [
          {
            label: "Faculty per Department",
            data: facultyArray.map((d) => d.count),
            backgroundColor: "#34D39999",
            borderColor: "#34D399",
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchStats();

    const handleDataUpdated = () => fetchStats();
    window.addEventListener("data-updated", handleDataUpdated);
    return () => window.removeEventListener("data-updated", handleDataUpdated);
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#A7F3D0" }, grid: { color: "#015E5C33" } },
      y: { ticks: { color: "#A7F3D0" }, grid: { color: "#015E5C33" } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-[#A7F3D0] drop-shadow-md">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Students", value: stats.students, color: "#00B5AD" },
            { label: "Total Faculty", value: stats.faculty, color: "#34D399" },
            { label: "Departments", value: stats.departments, color: "#2DD4BF" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-lg bg-[#013836]/80 backdrop-blur-md border border-[#015E5C]/40 hover:scale-[1.02] transition transform"
            >
              <h2 className="text-2xl font-bold mb-2" style={{ color: stat.color }}>
                {stat.value}
              </h2>
              <p className="text-lg text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Students Chart */}
          <div className="bg-[#013836]/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-[#015E5C]/40">
            <h2 className="text-2xl font-bold text-[#A7F3D0] mb-6">Students per Department</h2>
            {studentChartData.labels.length > 0 ? (
              <Bar data={studentChartData} options={chartOptions} />
            ) : (
              <p className="text-gray-400">No data available.</p>
            )}
          </div>

          {/* Faculty Chart */}
          <div className="bg-[#013836]/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-[#015E5C]/40">
            <h2 className="text-2xl font-bold text-[#A7F3D0] mb-6">Faculty per Department</h2>
            {facultyChartData.labels.length > 0 ? (
              <Bar data={facultyChartData} options={chartOptions} />
            ) : (
              <p className="text-gray-400">No data available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
