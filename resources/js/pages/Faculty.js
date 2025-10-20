import React, { useState, useEffect } from "react";
import axios from "../axios";

export default function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [view, setView] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", department: "" });

  const fetchFaculties = async () => {
    try {
      const response = await axios.get("/api/faculties", {
        params: { search, department: deptFilter, status: view },
      });
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, [search, deptFilter, view]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const triggerDashboardUpdate = () => window.dispatchEvent(new Event("data-updated"));

  const handleSave = async () => {
    try {
      if (editing) await axios.put(`/api/faculties/${editing.id}`, formData);
      else await axios.post("/api/faculties", formData);

      setShowModal(false);
      setEditing(null);
      setFormData({ name: "", department: "" });
      fetchFaculties();
      triggerDashboardUpdate();
    } catch (error) {
      console.error("Error saving faculty:", error);
    }
  };

  const handleArchive = async (id) => {
    if (confirm("Archive this faculty?")) {
      try {
        await axios.delete(`/api/faculties/${id}`);
        fetchFaculties();
        triggerDashboardUpdate();
      } catch (error) {
        console.error("Error archiving faculty:", error);
      }
    }
  };

  const handleRestore = async (id) => {
    if (confirm("Restore this faculty?")) {
      try {
        await axios.put(`/api/faculties/${id}/restore`);
        fetchFaculties();
        triggerDashboardUpdate();
      } catch (error) {
        console.error("Error restoring faculty:", error);
      }
    }
  };

  const handleEdit = (faculty) => {
    setEditing(faculty);
    setFormData({ name: faculty.name, department: faculty.department });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData({ name: "", department: "" });
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-[#A7F3D0] drop-shadow-md">Faculty</h1>
          <button
            onClick={handleAdd}
            className="bg-[#00B5AD] hover:bg-[#019C95] px-6 py-3 rounded-xl font-semibold text-white shadow-md transition transform active:scale-95"
          >
            + Add Faculty
          </button>
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
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD]"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#013836]/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#015E5C]/40">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
              <tr>
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculties.length > 0 ? (
                faculties.map((f) => (
                  <tr key={f.id} className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/30 transition">
                    <td className="p-4">{f.id}</td>
                    <td className="p-4">{f.name}</td>
                    <td className="p-4">{f.department}</td>
                    <td className="p-4 flex gap-2">
                      {view === "active" ? (
                        <>
                          <button
                            onClick={() => handleEdit(f)}
                            className="bg-[#00B5AD] px-4 py-2 rounded-lg font-semibold text-white hover:bg-[#019C95] transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleArchive(f.id)}
                            className="bg-red-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-red-700 transition"
                          >
                            Archive
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRestore(f.id)}
                          className="bg-green-600 px-4 py-2 rounded-lg font-semibold text-white hover:bg-green-700 transition"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-[#A7F3D0]">
                    No faculty found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#013836] p-8 rounded-2xl shadow-xl w-96 border border-[#015E5C]/50">
              <h2 className="text-2xl font-bold text-[#A7F3D0] mb-6">
                {editing ? "Edit Faculty" : "Add Faculty"}
              </h2>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mb-4 p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD] placeholder-gray-300"
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="w-full mb-6 p-3 rounded-lg bg-[#015E5C]/60 text-white focus:ring-2 focus:ring-[#00B5AD] placeholder-gray-300"
              />

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
