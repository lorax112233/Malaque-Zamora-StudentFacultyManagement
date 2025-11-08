import React, { useEffect, useState } from "react";
import axios from "../axios"; // your axios instance with baseURL http://127.0.0.1:8000/api
import { motion, AnimatePresence } from "framer-motion";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetchingLists, setFetchingLists] = useState(false);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [view, setView] = useState("active");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    f_name: "",
    m_name: "",
    l_name: "",
    suffix: "",
    date_of_birth: "",
    sex: "Male",
    phone_number: "",
    email_address: "",
    address: "",
    status: "Active",
    department_id: "",
    course_id: "",
    academic_year_id: "",
    year_level: "",
  });

  // Utility to build full name
  const fullName = (s) => {
    if (!s) return "—";
    const middle = s.m_name ? ` ${s.m_name}` : "";
    const suffix = s.suffix ? `, ${s.suffix}` : "";
    return `${s.f_name}${middle} ${s.l_name}${suffix}`;
  };

  // Fetch dropdown lists
  const fetchLists = async () => {
    try {
      setFetchingLists(true);
      const [dRes, cRes, yRes] = await Promise.all([
        axios.get("/departments"),
        axios.get("/courses"),
        axios.get("/academic-years"),
      ]);
      setDepartments(Array.isArray(dRes.data) ? dRes.data : []);
      setCourses(Array.isArray(cRes.data) ? cRes.data : []);
      setAcademicYears(Array.isArray(yRes.data) ? yRes.data : []);
    } catch (err) {
      console.error("Error fetching lists:", err.response?.data || err.message);
      setDepartments([]);
      setCourses([]);
      setAcademicYears([]);
    } finally {
      setFetchingLists(false);
    }
  };

  // Fetch students (uses your /students endpoint)
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const params = {
        search: search || undefined,
        course_id: courseFilter || undefined,
        department_id: deptFilter || undefined,
        status: view || undefined,
      };

      // axios baseURL already points to /api, so use "/students"
      const res = await axios.get("/students", { params });

      // backend returns array of student profiles; protect against unexpected shape
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setStudents(data);
      console.log("Students fetched:", data);
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err.message);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [search, courseFilter, deptFilter, view]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () =>
    setFormData({
      f_name: "",
      m_name: "",
      l_name: "",
      suffix: "",
      date_of_birth: "",
      sex: "Male",
      phone_number: "",
      email_address: "",
      address: "",
      status: "Active",
      department_id: "",
      course_id: "",
      academic_year_id: "",
      year_level: "",
    });

  // Save (create / update)
  const handleSave = async () => {
    try {
      // basic client-side validation
      if (!formData.f_name || !formData.l_name || !formData.email_address) {
        alert("Please fill first name, last name and email.");
        return;
      }

      if (editing) {
        await axios.put(`/students/${editing.id}`, formData);
      } else {
        await axios.post("/students", formData);
      }

      setShowModal(false);
      setEditing(null);
      resetForm();
      fetchStudents();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Error saving student:", err.response?.data || err.message);
      // if API returns validation errors, show them (simple)
      if (err.response?.data) {
        const data = err.response.data;
        if (data.errors) {
          const msg = Object.values(data.errors).flat().join("\n");
          alert(msg);
        } else if (data.message) {
          alert(data.message);
        } else {
          alert("Failed to save student.");
        }
      } else {
        alert("Failed to save student.");
      }
    }
  };

  // Archive (soft-delete)
  const handleArchive = async (id) => {
    if (!confirm("Archive this student?")) return;
    try {
      await axios.delete(`/students/${id}`);
      fetchStudents();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Error archiving student:", err.response?.data || err.message);
      alert("Failed to archive.");
    }
  };

  // Restore
  const handleRestore = async (id) => {
    if (!confirm("Restore this student?")) return;
    try {
      await axios.patch(`/students/${id}/restore`);
      fetchStudents();
      window.dispatchEvent(new Event("data-updated"));
    } catch (err) {
      console.error("Error restoring student:", err.response?.data || err.message);
      alert("Failed to restore.");
    }
  };

  const handleEdit = (s) => {
    setEditing(s);
    setFormData({
      f_name: s.f_name || "",
      m_name: s.m_name || "",
      l_name: s.l_name || "",
      suffix: s.suffix || "",
      date_of_birth: s.date_of_birth || "",
      sex: s.sex || "Male",
      phone_number: s.phone_number || "",
      email_address: s.email_address || "",
      address: s.address || "",
      status: s.status || "Active",
      department_id: s.department_id || "",
      course_id: s.course_id || "",
      academic_year_id: s.academic_year_id || "",
      year_level: s.year_level || "",
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
          <h1 className="text-4xl font-bold text-[#A7F3D0]">Students</h1>
          <div>
            <button
              onClick={handleAdd}
              className="bg-[#00B5AD] px-5 py-2 rounded-xl font-semibold text-white shadow-md hover:bg-[#019C95] transition"
            >
              + Add Student
            </button>
          </div>
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

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.course_name}
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
            <div className="p-8 text-center text-gray-300">Loading students...</div>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Course</th>
                  <th className="p-4 font-semibold">Department</th>
                  <th className="p-4 font-semibold">Year / Level</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr key={s.id} className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/20 transition">
                      <td className="p-4">{s.id}</td>
                      <td className="p-4">{fullName(s)}</td>
                      <td className="p-4">{s.email_address || "—"}</td>
                      <td className="p-4">{s.course?.name || s.course?.course_name || "—"}</td>
                      <td className="p-4">{s.department?.department_name || s.department?.name || "—"}</td>
                      <td className="p-4">{s.academicYear?.year_name || s.year_level || "—"}</td>
                      <td className="p-4">{s.status || "—"}</td>
                      <td className="p-4 flex gap-2">
                        {view === "active" ? (
                          <>
                            <button
                              onClick={() => handleEdit(s)}
                              className="bg-[#00B5AD] px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#019C95]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleArchive(s.id)}
                              className="bg-red-600 px-3 py-2 rounded-lg text-white font-semibold hover:bg-red-700"
                            >
                              Archive
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleRestore(s.id)}
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
                    <td colSpan="8" className="text-center p-6 text-[#A7F3D0]">
                      No students found.
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
                  {editing ? "Edit Student" : "Add Student"}
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

                  <input
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    type="date"
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      className="p-2 rounded bg-[#015E5C]/60 text-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>

                    <input
                      name="year_level"
                      value={formData.year_level}
                      onChange={handleChange}
                      placeholder="Year / Level"
                      className="p-2 rounded bg-[#015E5C]/60 text-white"
                    />
                  </div>

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

                  <select
                    name="academic_year_id"
                    value={formData.academic_year_id}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-[#015E5C]/60 text-white"
                  >
                    <option value="">Select Academic Year</option>
                    {academicYears.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.year_name || a.name}
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
