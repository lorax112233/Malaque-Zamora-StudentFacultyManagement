import React, { useEffect, useState } from "react";
import axios from "../axios"; // your axios instance
import { motion, AnimatePresence } from "framer-motion";

export default function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingLists, setFetchingLists] = useState(false);
  const [view, setView] = useState("active");

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    f_name: "",
    m_name: "",
    l_name: "",
    suffix: "",
    email_address: "",
    phone_number: "",
    address: "",
    sex: "Male",
    department_id: "",
    course_id: "",
    status: "Active",
  });

  const fullName = (f) => {
    if (!f) return "—";
    const mid = f.m_name ? ` ${f.m_name}` : "";
    const suf = f.suffix ? `, ${f.suffix}` : "";
    return `${f.f_name}${mid} ${f.l_name}${suf}`;
  };

  // Fetch departments and courses for dropdowns
  const fetchLists = async () => {
    try {
      setFetchingLists(true);
      const [dRes, cRes] = await Promise.all([
        axios.get("/departments"),
        axios.get("/courses"),
      ]);
      setDepartments(Array.isArray(dRes.data) ? dRes.data : []);
      setCourses(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) {
      console.error("Error fetching lists:", err);
      setDepartments([]);
      setCourses([]);
    } finally {
      setFetchingLists(false);
    }
  };

  // Fetch faculties
  const fetchFaculties = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        department_id: deptFilter || undefined,
        status: view || undefined,
      };
      const res = await axios.get("/faculties", { params });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setFaculties(data);
    } catch (err) {
      console.error("Error fetching faculties:", err.response?.data || err.message);
      setFaculties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    fetchFaculties();
  }, [search, deptFilter, view]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () =>
    setFormData({
      f_name: "",
      m_name: "",
      l_name: "",
      suffix: "",
      email_address: "",
      phone_number: "",
      address: "",
      sex: "Male",
      department_id: "",
      course_id: "",
      status: "Active",
    });

  const handleSave = async () => {
    try {
      if (!formData.f_name || !formData.l_name || !formData.email_address) {
        alert("Please fill all required fields.");
        return;
      }

      if (editing) {
        await axios.put(`/faculties/${editing.id}`, formData);
      } else {
        await axios.post("/faculties", formData);
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchFaculties();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Error saving faculty:", err.response?.data || err.message);
      const data = err.response?.data;
      if (data?.errors) {
        alert(Object.values(data.errors).flat().join("\n"));
      } else {
        alert("Failed to save faculty.");
      }
    }
  };

  const handleArchive = async (id) => {
    if (!confirm("Archive this faculty?")) return;
    try {
      await axios.delete(`/faculties/${id}`);
      fetchFaculties();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Error archiving:", err);
      alert("Failed to archive.");
    }
  };

  const handleRestore = async (id) => {
    if (!confirm("Restore this faculty?")) return;
    try {
      await axios.patch(`/faculties/${id}/restore`);
      fetchFaculties();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Error restoring:", err);
      alert("Failed to restore.");
    }
  };

  const handleEdit = (f) => {
    setEditing(f);
    setFormData({
      f_name: f.f_name || "",
      m_name: f.m_name || "",
      l_name: f.l_name || "",
      suffix: f.suffix || "",
      email_address: f.email_address || "",
      phone_number: f.phone_number || "",
      address: f.address || "",
      sex: f.sex || "Male",
      department_id: f.department_id || "",
      course_id: f.course_id || "",
      status: f.status || "Active",
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditing(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#A7F3D0]">Faculties</h1>
          <button
            onClick={handleAdd}
            className="bg-[#00B5AD] px-5 py-2 rounded-xl font-semibold text-white shadow-md hover:bg-[#019C95] transition"
          >
            + Add Faculty
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white flex-1 focus:ring-2 focus:ring-[#00B5AD]"
          />

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.department_name || d.name}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setView("active")}
              className={`px-4 py-2 rounded-xl font-semibold ${
                view === "active" ? "bg-teal-600 text-white" : "bg-[#014F4D] text-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setView("archived")}
              className={`px-4 py-2 rounded-xl font-semibold ${
                view === "archived" ? "bg-red-600 text-white" : "bg-[#014F4D] text-gray-200"
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#013836]/80 rounded-2xl p-2 shadow-lg border border-[#015E5C]/40">
          {loading ? (
            <div className="p-8 text-center text-gray-300">Loading faculties...</div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Department</th>
                  <th className="p-4 font-semibold">Course</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculties.length > 0 ? (
                  faculties.map((f) => (
                    <tr
                      key={f.id}
                      className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/20 transition"
                    >
                      <td className="p-4">{f.id}</td>
                      <td className="p-4">{fullName(f)}</td>
                      <td className="p-4">{f.email_address || "—"}</td>
                      <td className="p-4">
                        {f.department?.department_name || f.department?.name || "—"}
                      </td>
                      <td className="p-4">
                        {f.course?.course_name || f.course?.name || "—"}
                      </td>
                      <td className="p-4">{f.status || "—"}</td>
                      <td className="p-4 flex gap-2">
                        {view === "active" ? (
                          <>
                            <button
                              onClick={() => handleEdit(f)}
                              className="bg-[#00B5AD] px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#019C95]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleArchive(f.id)}
                              className="bg-red-600 px-3 py-2 rounded-lg text-white font-semibold hover:bg-red-700"
                            >
                              Archive
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(f.id)}
                            className="bg-green-600 px-3 py-2 rounded-lg text-white font-semibold hover:bg-green-700"
                          >
                            Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-6 text-[#A7F3D0]">
                      No faculty found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

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
                  {editing ? "Edit Faculty" : "Add Faculty"}
                </h3>

                <div className="space-y-2">
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

                  <input
                    name="email_address"
                    value={formData.email_address}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  />

                  <input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  />

                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>

                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.department_name || d.name}
                      </option>
                    ))}
                  </select>

                  <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  >
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name || c.course_name}
                      </option>
                    ))}
                  </select>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditing(null);
                    }}
                    className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded bg-[#00B5AD] hover:bg-[#019C95] text-white font-semibold"
                  >
                    Save
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
