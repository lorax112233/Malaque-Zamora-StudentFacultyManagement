








import React, { useState } from "react";

const initialStudents = [
  { id: 1, name: "Alice", course: "BSCS", department: "IT" },
  { id: 2, name: "Bob", course: "BSIT", department: "IT" },
  { id: 3, name: "Charlie", course: "BSECE", department: "ECE" },
];

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterDept, setFilterDept] = useState("");

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCourse ? s.course === filterCourse : true) &&
    (filterDept ? s.department === filterDept : true)
  );

  const editStudent = (id) => { alert("Edit student " + id) };
  const archiveStudent = (id) => { alert("Archive student " + id) };

  const courses = [...new Set(students.map(s => s.course))];
  const departments = [...new Set(students.map(s => s.department))];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-teal-300">Students</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg flex-1"
        />
        <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg">
          <option value="">All Courses</option>
          {courses.map((c,i) => <option key={i} value={c}>{c}</option>)}
        </select>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg">
          <option value="">All Departments</option>
          {departments.map((d,i) => <option key={i} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead className="bg-[#014F4D] text-white">
            <tr>
              <th className="p-4 text-left font-semibold text-lg">Name</th>
              <th className="p-4 text-left font-semibold text-lg">Course</th>
              <th className="p-4 text-left font-semibold text-lg">Department</th>
              <th className="p-4 text-left font-semibold text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(s => (
              <tr key={s.id} className="border-b hover:bg-[#014F4D] hover:text-white transition">
                <td className="p-4">{s.name}</td>
                <td className="p-4">{s.course}</td>
                <td className="p-4">{s.department}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => editStudent(s.id)} className="bg-teal-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-teal-600 active:scale-95 transition transform">Edit</button>
                  <button onClick={() => archiveStudent(s.id)} className="bg-[#014F4D] text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-[#053D3A] active:scale-95 transition transform">Archive</button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-6">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
