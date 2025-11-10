import React, { useEffect, useState } from "react";
import api from "../axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [view, setView] = useState("active");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    f_name: "", m_name: "", l_name: "", suffix: "",
    date_of_birth: "", sex: "Male", phone_number: "",
    email_address: "", address: "", position: "", status: "Active",
    department_id: ""
  });

  // Helper to display full name
  const fullName = (f) =>
    f ? `${f.f_name}${f.m_name ? ` ${f.m_name}` : ""} ${f.l_name}${f.suffix ? `, ${f.suffix}` : ""}` : "—";

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch faculties with proper active/archived filtering
  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const res = await api.get("/faculties", {
        params: { search, department_id: deptFilter }
      });
      // filter client-side based on view
      const filtered = res.data.filter(f =>
        view === "active" ? !f.deleted_at : f.deleted_at
      );
      setFaculties(filtered);
    } catch (err) {
      console.error(err);
      setFaculties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);
  useEffect(() => { fetchFaculties(); }, [search, deptFilter, view]);
  useEffect(() => {
    const handler = () => fetchFaculties();
    window.addEventListener("data-updated", handler);
    return () => window.removeEventListener("data-updated", handler);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const resetForm = () => setFormData({
    f_name: "", m_name: "", l_name: "", suffix: "",
    date_of_birth: "", sex: "Male", phone_number: "",
    email_address: "", address: "", position: "", status: "Active",
    department_id: ""
  });

  const handleSave = async () => {
    if (!formData.f_name || !formData.l_name || !formData.email_address || !formData.position) {
      alert("Please fill in first name, last name, email, and position");
      return;
    }
    try {
      if (editing) await api.put(`/faculties/${editing.id}`, formData);
      else await api.post("/faculties", formData);
      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchFaculties();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join("\n")
        : "Failed to save";
      alert(msg);
    }
  };

  // Archive / Restore / Delete
  const archiveFaculty = async (id) => {
    if (!confirm("Archive this faculty?")) return;
    try { await api.patch(`/faculties/${id}/archive`); fetchFaculties(); } 
    catch (err) { console.error(err); alert("Failed to archive faculty"); }
  };
  const restoreFaculty = async (id) => {
    if (!confirm("Restore this faculty?")) return;
    try { await api.patch(`/faculties/${id}/restore`); fetchFaculties(); } 
    catch (err) { console.error(err); alert("Failed to restore faculty"); }
  };
  const deleteFaculty = async (id) => {
    if (!confirm("Permanently delete this faculty?")) return;
    try { await api.delete(`/faculties/${id}`); fetchFaculties(); } 
    catch (err) { console.error(err); alert("Failed to delete faculty"); }
  };

  const handleEdit = (f) => { setEditing(f); setFormData({ ...f }); setShowModal(true); };
  const handleAdd = () => { setEditing(null); resetForm(); setShowModal(true); };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#A7F3D0]">Faculty</h1>
          <button onClick={handleAdd} className="bg-[#00B5AD] px-5 py-2 rounded-xl font-semibold text-white shadow-md hover:bg-[#019C95] transition">
            + Add Faculty
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..." className="p-3 rounded-lg bg-[#015E5C]/60 text-white flex-1 focus:ring-2 focus:ring-[#00B5AD]"
          />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="p-3 rounded-lg bg-[#015E5C]/60 text-white">
            <option value="">All Departments</option>
            {departments.map(d => <option key={d.id} value={d.id}>{d.department_name || d.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={() => setView("active")} className={`px-4 py-2 rounded-xl font-semibold ${view==="active"?"bg-teal-600 text-white":"bg-[#014F4D] text-gray-200"}`}>Active</button>
            <button onClick={() => setView("archived")} className={`px-4 py-2 rounded-xl font-semibold ${view==="archived"?"bg-red-600 text-white":"bg-[#014F4D] text-gray-200"}`}>Archived</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#013836]/80 rounded-2xl p-2 shadow-lg border border-[#015E5C]/40">
          {loading ? <div className="p-8 text-center text-gray-300">Loading faculty...</div> :
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Department</th>
                  <th className="p-4 font-semibold">Position</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculties.length > 0 ? faculties.map(f => (
                  <tr key={f.id} className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/20 transition">
                    <td className="p-4">{f.id}</td>
                    <td className="p-4">{fullName(f)}</td>
                    <td className="p-4">{f.email_address || "—"}</td>
                    <td className="p-4">{f.department?.department_name || f.department?.name || "—"}</td>
                    <td className="p-4">{f.position || "—"}</td>
                    <td className="p-4">{f.status || "—"}</td>
                    <td className="p-4 flex gap-2">
                      {f.deleted_at ? (
                        <>
                          <button onClick={() => restoreFaculty(f.id)} className="bg-green-600 px-3 py-2 rounded-lg text-white font-semibold hover:bg-green-700">Restore</button>
                          <button onClick={() => deleteFaculty(f.id)} className="bg-red-700 px-3 py-2 rounded-lg text-white font-semibold hover:bg-red-800">Delete</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(f)} className="bg-[#00B5AD] px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#019C95]">Edit</button>
                          <button onClick={() => archiveFaculty(f.id)} className="bg-red-600 px-3 py-2 rounded-lg text-white font-semibold hover:bg-red-700">Archive</button>
                        </>
                      )}
                    </td>
                  </tr>
                )) : <tr><td colSpan="7" className="text-center p-6 text-[#A7F3D0]">No faculty found.</td></tr>}
              </tbody>
            </table>
          }
        </div>

        {/* Modal */}
        {/* Modal */}
              <AnimatePresence>
                {showModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      className="bg-[#013836] w-full max-w-md p-6 rounded-2xl shadow-xl border border-[#015E5C]/50"
                    >
                      <h3 className="text-xl font-bold text-[#A7F3D0] mb-4">
                        {editing ? "Edit Student" : "Add Student"}
                      </h3>
                      <div className="space-y-2">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            name="f_name"
                            value={formData.f_name}
                            onChange={handleChange}
                            placeholder="First name"
                            className="p-2 rounded bg-[#015E5C]/60 text-white"
                          />
                          <input
                            name="m_name"
                            value={formData.m_name}
                            onChange={handleChange}
                            placeholder="Middle name"
                            className="p-2 rounded bg-[#015E5C]/60 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            name="l_name"
                            value={formData.l_name}
                            onChange={handleChange}
                            placeholder="Last name"
                            className="p-2 rounded bg-[#015E5C]/60 text-white"
                          />
                          <input
                            name="suffix"
                            value={formData.suffix}
                            onChange={handleChange}
                            placeholder="Suffix"
                            className="p-2 rounded bg-[#015E5C]/60 text-white"
                          />
                        </div>

                        {/* Contact & DOB */}
                        <input
                          name="email_address"
                          value={formData.email_address}
                          onChange={handleChange}
                          placeholder="Email"
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        />
                        <input
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        />
                        <select
                          name="sex"
                          value={formData.sex}
                          onChange={handleChange}
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>

                        <input
                          name="phone_number"
                          value={formData.phone_number}
                          onChange={handleChange}
                          placeholder="Phone"
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        />
                        <input
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Address"
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        />

                        {/* Department & Course */}
                        <select
                          name="department_id"
                          value={formData.department_id}
                          onChange={handleChange}
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        >
                          <option value="">Select Department</option>
                          {departments.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.department_name || d.name}
                            </option>
                          ))}
                        </select>
                        <select
                          name="course_id"
                          value={formData.course_id}
                          onChange={handleChange}
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>
                              {c.course_name || c.name}
                            </option>
                          ))}
                        </select>

                        {/* Academic Year */}
                        <select
                          name="academic_year_id"
                          value={formData.academic_year_id}
                          onChange={handleChange}
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        >
                          <option value="">Select Academic Year</option>
                          {academicYears.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.year || a.school_year}
                            </option>
                          ))}
                        </select>

                        {/* Year Level as Text Input */}
                        <input
                          name="year_level"
                          value={formData.year_level}
                          onChange={handleChange}
                          placeholder="Year Level"
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        />

                        {/* Status */}
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="p-2 rounded bg-[#015E5C]/60 text-white w-full"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      {/* Buttons */}
                      <div className="mt-4 flex justify-end gap-2">
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-gray-500 rounded text-white hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-teal-600 rounded text-white hover:bg-teal-700"
                        >
                          {editing ? "Update" : "Save"}
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

                    </div>
                  </div>
                );
              }
