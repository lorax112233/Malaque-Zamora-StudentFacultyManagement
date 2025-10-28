import React, { useState, useEffect } from "react";
import axios from "../axios";
import { DEPARTMENTS, COURSES } from "../constants/programs";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [view, setView] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", course: "", department: "" });
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
    byDepartment: [],
    byCourse: []
  });

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students", {
        params: { 
          search, 
          course: courseFilter, 
          department: deptFilter, 
          status: view,
          page,
          per_page: 10
        },
      });
      setStudents(response.data.students.data);
      setTotalPages(Math.ceil(response.data.students.total / 10));
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, courseFilter, deptFilter, view, page]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const triggerDashboardUpdate = () => window.dispatchEvent(new Event("data-updated"));

  const handleSave = async () => {
    try {
      if (editing) await axios.put(`/api/students/${editing.id}`, formData);
      else await axios.post("/api/students", formData);

      setShowModal(false);
      setEditing(null);
      setFormData({ name: "", course: "", department: "" });
      setErrors({});
      fetchStudents();
      triggerDashboardUpdate();
    } catch (error) {
      console.error("Error saving student:", error);
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || { general: error.response.data.message });
      } else {
        setErrors({ general: "An unexpected error occurred while saving." });
      }
    }
  };

  const handleArchive = async (id) => {
    if (confirm("Archive this student?")) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents();
        triggerDashboardUpdate();
      } catch (error) {
        console.error("Error archiving student:", error);
      }
    }
  };

  const handleRestore = async (id) => {
    if (confirm("Restore this student?")) {
      try {
        await axios.put(`/api/students/${id}/restore`);
        fetchStudents();
        triggerDashboardUpdate();
      } catch (error) {
        console.error("Error restoring student:", error);
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (confirm("Permanently delete this student? This action cannot be undone.")) {
      try {
        await axios.delete(`/api/students/${id}/force`);
        fetchStudents();
        triggerDashboardUpdate();
      } catch (error) {
        console.error("Error permanently deleting student:", error);
      }
    }
  };

  const handleEdit = (student) => {
    setEditing(student);
    setFormData({ name: student.name, course: student.course, department: student.department });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData({ name: "", course: "", department: "" });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-[#A7F3D0] drop-shadow-md">Students</h1>
          <button
            onClick={handleAdd}
            className="bg-[#00B5AD] hover:bg-[#019C95] px-6 py-3 rounded-xl font-semibold text-white shadow-md transition transform active:scale-95"
          >
            + Add Student
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Students", value: stats.total, color: "#00B5AD" },
            { label: "Active Students", value: stats.active, color: "#10B981" },
            { label: "Archived Students", value: stats.archived, color: "#EF4444" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-xl bg-[#013836]/80 border border-[#015E5C]/40">
              <h3 className="text-lg text-[#A7F3D0]">{stat.label}</h3>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value || 0}</p>
            </div>
          ))}
        </div>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Department Distribution */}
          {stats.byDepartment && stats.byDepartment.length > 0 && (
            <div className="bg-[#013836]/80 rounded-xl p-6 border border-[#015E5C]/40">
              <h3 className="text-xl font-semibold text-[#A7F3D0] mb-4">Department Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.byDepartment.map((dept, i) => (
                  <div key={i} className="p-4 rounded-lg bg-[#015E5C]/30">
                    <p className="text-sm text-[#A7F3D0]">{dept.department}</p>
                    <p className="text-2xl font-bold">{dept.count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Distribution */}
          {stats.byCourse && stats.byCourse.length > 0 && (
            <div className="bg-[#013836]/80 rounded-xl p-6 border border-[#015E5C]/40">
              <h3 className="text-xl font-semibold text-[#A7F3D0] mb-4">Course Distribution</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.byCourse.map((course, i) => (
                  <div key={i} className="p-4 rounded-lg bg-[#015E5C]/30">
                    <p className="text-sm text-[#A7F3D0]">{course.course}</p>
                    <p className="text-2xl font-bold">{course.count}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setView("active")}
            className={`px-6 py-2 rounded-xl font-semibold text-lg shadow transition-all duration-150 ${
              view === "active" ? "bg-teal-600 text-white scale-105" : "bg-[#014F4D] text-gray-200 hover:bg-teal-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setView("archived")}
            className={`px-6 py-2 rounded-xl font-semibold text-lg shadow transition-all duration-150 ${
              view === "archived" ? "bg-red-600 text-white scale-105" : "bg-[#014F4D] text-gray-200 hover:bg-red-700"
            }`}
          >
            Archived
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white flex-1 focus:ring-2 focus:ring-[#00B5AD] placeholder-gray-300"
          />
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setCourseFilter(""); // Reset course when department changes
            }}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
          >
            <option value="">All Courses</option>
            {deptFilter && COURSES[deptFilter]?.map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#013836]/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#015E5C]/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
              <tr>
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.id} className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/30 transition">
                    <td className="p-4">{s.id}</td>
                    <td className="p-4">{s.name}</td>
                    <td className="p-4">{s.course}</td>
                    <td className="p-4">{s.department}</td>
                    <td className="p-4 flex gap-2">
                      {view === "active" ? (
                        <>
                          <button
                            onClick={() => handleEdit(s)}
                            className="bg-[#00B5AD] px-4 py-2 rounded-lg font-semibold text-white hover:bg-[#019C95] transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleArchive(s.id)}
                            className="bg-red-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-red-700 transition"
                          >
                            Archive
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRestore(s.id)}
                            className="bg-green-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-green-700 transition"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(s.id)}
                            className="bg-red-800 px-4 py-2 rounded-lg font-semibold text-white hover:bg-red-900 transition"
                          >
                            Delete Permanently
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-[#A7F3D0]">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-[#013836] border border-[#015E5C]/40 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-[#A7F3D0]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg bg-[#013836] border border-[#015E5C]/40 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#013836] p-8 rounded-2xl shadow-xl w-96 border border-[#015E5C]/50">
              <h2 className="text-2xl font-bold text-[#A7F3D0] mb-6">
                {editing ? "Edit Student" : "Add Student"}
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mb-4 p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD] placeholder-gray-300"
              />
              {errors.name && <p className="text-sm text-red-400 mb-2">{errors.name[0]}</p>}
              <select
                name="department"
                value={formData.department}
                onChange={(e) => {
                  handleChange(e);
                  // Reset course when department changes
                  setFormData(prev => ({ ...prev, course: "" }));
                }}
                className="w-full mb-4 p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <p className="text-sm text-red-400 mb-2">{errors.department[0]}</p>}
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full mb-6 p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
                disabled={!formData.department}
              >
                <option value="">Select Course</option>
                {formData.department && COURSES[formData.department]?.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              {errors.course && <p className="text-sm text-red-400 mb-2">{errors.course[0]}</p>}
              {errors.general && <p className="text-sm text-red-400 mb-2">{errors.general}</p>}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#00B5AD] rounded-lg hover:bg-[#019C95] text-white font-semibold transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
