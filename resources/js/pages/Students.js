import React, { useEffect, useState } from "react";
import api from "../axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
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
    department_id: "",
    course_id: "",
    academic_year_id: "",
    year_level: "",
    status: "Active",
  });


  // Helpers
  const fullName = (s) => s ? `${s.f_name}${s.m_name ? ` ${s.m_name}` : ""} ${s.l_name}${s.suffix ? `, ${s.suffix}` : ""}` : "—";

  // Fetch data
  const fetchDepartments = async () => { try { const res = await api.get("/departments"); setDepartments(res.data); } catch (err) { console.error(err); } };
  const fetchCourses = async () => { try { const res = await api.get("/courses"); setCourses(res.data); } catch (err) { console.error(err); } };
  const fetchYearLevels = async () => { try { const res = await api.get("/year-levels"); setYearLevels(res.data); } catch (err) { console.error(err); } };
  const fetchAcademicYears = async () => { try { const res = await api.get("/academic-years"); setAcademicYears(res.data); } catch (err) { console.error(err); } };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/students", { params: { search, department_id: deptFilter, course_id: courseFilter } });
      const filtered = res.data.filter(s => view === "active" ? !s.deleted_at : s.deleted_at);
      setStudents(filtered);
    } catch (err) { console.error(err); setStudents([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDepartments(); fetchCourses(); fetchYearLevels(); fetchAcademicYears(); }, []);
  useEffect(() => { fetchStudents(); }, [search, deptFilter, courseFilter, view]);
  useEffect(() => {
    const handler = () => fetchStudents();
    window.addEventListener("data-updated", handler);
    return () => window.removeEventListener("data-updated", handler);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const resetForm = () => setFormData({
    f_name: "", m_name: "", l_name: "", suffix: "",
    date_of_birth: "", sex: "Male", phone_number: "",
    email_address: "", address: "", department_id: "", course_id: "",
    academic_year_id: "", year_level_id: "", status: "Active"
  });

const handleSave = async () => {
  // Validate required fields
  if (
    !formData.f_name ||
    !formData.l_name ||
    !formData.email_address ||
    !formData.date_of_birth ||
    !formData.academic_year_id ||
    !formData.year_level
  ) {
    alert(
      "Please fill in first name, last name, email, date of birth, academic year, and year level"
    );
    return;
  }

  try {
    if (editing) await api.put(`/students/${editing.id}`, formData);
    else await api.post("/students", formData);

    setShowModal(false);
    setEditing(null);
    resetForm();
    fetchStudents(); // or however you fetch the list
    window.dispatchEvent(new Event("data-updated"));
  } catch (err) {
    const msg = err.response?.data?.errors
      ? Object.values(err.response.data.errors).flat().join("\n")
      : "Failed to save";
    alert(msg);
  }
};


  const archiveStudent = async (id) => { if(confirm("Archive this student?")) { await api.patch(`/students/${id}/archive`); fetchStudents(); } };
  const restoreStudent = async (id) => { if(confirm("Restore this student?")) { await api.patch(`/students/${id}/restore`); fetchStudents(); } };
  const deleteStudent = (id) => { if (!confirm("Are you sure you want to permanently delete this student?")) return; api.delete(`/students/${id}`).then(fetchStudents).catch(err => alert("Failed to delete student")); };

  const handleEdit = (s) => { 
    // Coerce numeric IDs to strings for select fields
    setEditing(s); 
    setFormData({
      ...s,
      department_id: s.department_id?.toString()||"",
      course_id: s.course_id?.toString()||"",
      academic_year_id: s.academic_year_id?.toString()||"",
      year_level_id: s.year_level?.toString()||""
    }); 
    setShowModal(true); 
  };
  const handleAdd = () => { setEditing(null); resetForm(); setShowModal(true); };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8]">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#A7F3D0]">Students</h1>
          <button onClick={handleAdd} className="bg-[#00B5AD] px-5 py-2 rounded-xl font-semibold text-white shadow-md hover:bg-[#019C95] transition">+ Add Student</button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e)=>setSearch(e.target.value)}
            className="p-3 rounded-lg bg-[#015E5C]/60 text-white flex-1 focus:ring-2 focus:ring-[#00B5AD]" />
          <select value={deptFilter} onChange={(e)=>setDeptFilter(e.target.value)} className="p-3 rounded-lg bg-[#015E5C]/60 text-white">
            <option value="">All Departments</option>
            {Array.isArray(departments) && departments.map(d => <option key={d.id} value={d.id}>{d.department_name||d.name}</option>)}
          </select>
          <select value={courseFilter} onChange={(e)=>setCourseFilter(e.target.value)} className="p-3 rounded-lg bg-[#015E5C]/60 text-white">
            <option value="">All Courses</option>
            {Array.isArray(courses) && courses.map(c => <option key={c.id} value={c.id}>{c.course_name||c.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={()=>setView("active")} className={`px-4 py-2 rounded-xl font-semibold ${view==="active"?"bg-teal-600 text-white":"bg-[#014F4D] text-gray-200"}`}>Active</button>
            <button onClick={()=>setView("archived")} className={`px-4 py-2 rounded-xl font-semibold ${view==="archived"?"bg-red-600 text-white":"bg-[#014F4D] text-gray-200"}`}>Archived</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-[#013836]/80 rounded-2xl p-2 shadow-lg border border-[#015E5C]/40">
          {loading ? <div className="p-8 text-center text-gray-300">Loading students...</div> :
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Department</th>
                  <th className="p-4 font-semibold">Course</th>
                  <th className="p-4 font-semibold">Academic Year</th>
                  <th className="p-4 font-semibold">Year Level</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length>0 ? students.map(s => (
                  <tr key={s.id} className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/20 transition">
                    <td className="p-4">{s.id}</td>
                    <td className="p-4">{fullName(s)}</td>
                    <td className="p-4">{s.email_address||"—"}</td>
                    <td className="p-4">{s.department?.department_name||"—"}</td>
                    <td className="p-4">{s.course?.course_name||"—"}</td>
                    <td className="p-4">{s.academic_year?.school_year || "—"}</td>
                    <td className="p-4">{s.year_level || "—"}</td>
                    <td className="p-4">{s.status||"Active"}</td>
                    <td className="border p-4 flex gap-2">
                      {s.deleted_at ? (
                        <>
                          <button onClick={()=>restoreStudent(s.id)} className="bg-green-600 px-3 py-2 rounded-lg text-white font-semibold hover:bg-green-700">Restore</button>
                          <button onClick={()=>deleteStudent(s.id)} className="bg-red-700 px-3 py-2 rounded-lg text-white font-semibold hover:bg-red-800">Delete</button>
                        </>
                      ):(<>
                          <button onClick={()=>archiveStudent(s.id)} className="bg-red-600 px-3 py-2 rounded-lg text-white font-semibold hover:bg-red-700">Archive</button>
                          <button onClick={()=>handleEdit(s)} className="bg-[#00B5AD] px-3 py-2 rounded-lg text-white font-semibold hover:bg-[#019C95]">Edit</button>
                        </>)}
                    </td>
                  </tr>
                )):<tr><td colSpan="9" className="text-center p-6 text-[#A7F3D0]">No students found.</td></tr>}
              </tbody>
            </table>
          }
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

                    {/* Department */}
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

                    {/* Course */}
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
                          {a.school_year}
                        </option>
                      ))}
                    </select>

                    {/* Year Level as Text Input */}
                    <input
                      name="year_level"
                      value={formData.year_level || ""}
                      onChange={handleChange}
                      placeholder="Year Level"
                      type="number"
                      min={1}
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
