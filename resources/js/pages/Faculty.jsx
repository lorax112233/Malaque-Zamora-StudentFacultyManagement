






import React, { useState } from "react";

const facultyMembers = [
  { id: 1, name: "Dr. Smith", dept: "CS" },
  { id: 2, name: "Prof. Jane", dept: "IT" },
  { id: 3, name: "Dr. Brown", dept: "ENG" },
];

export default function Faculty() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const filtered = facultyMembers.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) &&
      (deptFilter === "" || f.dept === deptFilter)
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-teal-300">Faculty</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg flex-1"
        />
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg"
        >
          <option value="">All Departments</option>
          <option value="CS">CS</option>
          <option value="IT">IT</option>
          <option value="ENG">ENG</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead className="bg-[#014F4D] text-white">
            <tr>
              <th className="p-4 text-left font-semibold text-lg">ID</th>
              <th className="p-4 text-left font-semibold text-lg">Name</th>
              <th className="p-4 text-left font-semibold text-lg">Department</th>
              <th className="p-4 text-left font-semibold text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b hover:bg-[#014F4D] hover:text-white transition">
                <td className="p-4">{f.id}</td>
                <td className="p-4">{f.name}</td>
                <td className="p-4">{f.dept}</td>
                <td className="p-4 flex gap-2">
                  <button className="bg-teal-500 px-4 py-2 rounded-xl font-bold text-white shadow hover:bg-teal-600 active:scale-95 transition transform">Edit</button>
                  <button className="bg-red-600 px-4 py-2 rounded-xl font-bold text-white shadow hover:bg-red-700 active:scale-95 transition transform">Archive</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6">No faculty found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
