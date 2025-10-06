





import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import StatCard from "../components/StatCard";

const studentData = [
  { course: "BSCS", students: 30 },
  { course: "BSIT", students: 25 },
  { course: "BSECE", students: 20 },
];

const facultyData = [
  { department: "IT", faculty: 10 },
  { department: "ECE", faculty: 5 },
];

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-teal-300">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard title="Total Students" value={120} bgColor="bg-teal-500" />
        <StatCard title="Total Faculty" value={15} bgColor="bg-[#014F4D]" />
        {/* Add more StatCards if needed */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6 text-[#053D3A]">Students per Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="course"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="students" fill="#14b8a6"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-6 text-[#053D3A]">Faculty per Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={facultyData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="department"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="faculty" fill="#014F4D"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
