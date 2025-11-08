import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import axios from "../axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    departments: 0,
  });
  const [studentChartData, setStudentChartData] = useState([]);
  const [facultyChartData, setFacultyChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats and chart data
  const fetchStats = async () => {
    try {
      const [
        studentRes,
        facultyRes,
        deptRes,
        studentChartRes,
        facultyChartRes,
      ] = await Promise.all([
        axios.get("/students/count"),
        axios.get("/faculties/count"),
        axios.get("/departments/count"),
        axios.get("/students/by-department"),
        axios.get("/faculties/by-department"),
      ]);

      setStats({
        students: studentRes.data.count ?? 0,
        faculty: facultyRes.data.count ?? 0,
        departments: deptRes.data.count ?? 0,
      });

      setStudentChartData(studentChartRes.data.data || studentChartRes.data || []);
      setFacultyChartData(facultyChartRes.data.data || facultyChartRes.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error.response || error);

      // Fallback data to prevent blank page
      setStats({ students: 0, faculty: 0, departments: 0 });
      setStudentChartData([]);
      setFacultyChartData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Stat card component
  const StatCard = ({ label, value, color }) => (
    <motion.div
      className="p-6 rounded-2xl shadow-lg bg-[#013836]/80 backdrop-blur-md border border-[#015E5C]/40"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <h2 className="text-3xl font-extrabold mb-2" style={{ color }}>
        {loading ? "..." : value ?? 0}
      </h2>
      <p className="text-gray-300">{label}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-bold mb-10 text-[#A7F3D0]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard Overview
        </motion.h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Students" value={stats.students} color="#00B5AD" />
          <StatCard label="Total Faculty" value={stats.faculty} color="#34D399" />
          <StatCard label="Departments" value={stats.departments} color="#2DD4BF" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Students Chart */}
          <motion.div
            className="bg-[#013836]/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-[#015E5C]/40"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-[#A7F3D0] mb-6">
              Students per Department
            </h2>
            {studentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#015E5C55" />
                  <XAxis dataKey="department" stroke="#A7F3D0" />
                  <YAxis stroke="#A7F3D0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#013836",
                      border: "1px solid #015E5C",
                      color: "#E9F9F8",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#00B5AD" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center">No student data available.</p>
            )}
          </motion.div>

          {/* Faculty Chart */}
          <motion.div
            className="bg-[#013836]/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-[#015E5C]/40"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-[#A7F3D0] mb-6">
              Faculty per Department
            </h2>
            {facultyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facultyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#015E5C55" />
                  <XAxis dataKey="department" stroke="#A7F3D0" />
                  <YAxis stroke="#A7F3D0" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#013836",
                      border: "1px solid #015E5C",
                      color: "#E9F9F8",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#34D399" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center">No faculty data available.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
