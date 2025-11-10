import React, { useEffect, useState } from "react";
import api from "../axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
  const [tab, setTab] = useState("departments");
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setAcademicYears] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [type, setType] = useState("department");
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [view, setView] = useState("active");

  // Fetch data from API based on current view
  const fetchData = async () => {
    try {
      const [deptRes, courseRes, yearRes, facultyRes] = await Promise.all([
        api.get("/departments", { params: { view } }),
        api.get("/courses", { params: { view } }),
        api.get("/academic-years", { params: { view } }),
        api.get("/faculties"),
      ]);

      setDepartments(deptRes.data);
      setCourses(courseRes.data);
      setAcademicYears(yearRes.data);
      setFaculties(facultyRes.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err);
      alert("Failed to fetch data. Check console for details.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [view]);

  const handleOpenModal = (modalType, item = null) => {
    setType(modalType);
    setEditing(item);

    if (modalType === "department") {
      setFormData({
        department_name: item?.department_name || "",
        department_head_id: item?.department_head_id || "",
      });
    }

    if (modalType === "course") {
      setFormData({
        course_name: item?.course_name || "",
        department_id: item?.department_id || "",
      });
    }

    if (modalType === "year") {
      setFormData({
        school_year: item?.school_year || "",
        start_date: item?.start_date || "",
        end_date: item?.end_date || "",
        is_active: item?.is_active || false,
      });
    }

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData({
      ...formData,
      [name]: inputType === "checkbox" ? checked : value,
    });
  };

    const handleSave = async () => {
      try {
        const payload = {
          ...formData,
          is_active: formData.is_active !== undefined ? !!formData.is_active : undefined,
        };

        // map frontend types to backend routes
        const routeType = type === "year" ? "academic-years" : `${type}s`;

        if (editing) {
          await api.put(`/${routeType}/${editing.id}`, payload);
        } else {
          await api.post(`/${routeType}`, payload);
        }
        
      setShowModal(false);
      setEditing(null);
      setFormData({});
      fetchData();
    } catch (err) {
      console.error("Save error:", err.response?.data || err);
      alert("Failed to save. Check console for details.");
    }
  };
  

const getRouteType = (type) => {
  if (type === "year") return "academic-years";
  return `${type}s`;
};

// Archive an item
const handleArchive = async (item) => {
  if (!window.confirm("Archive this item?")) return;
  try {
    await api.delete(`/${getRouteType(type)}/${item.id}`);
    fetchData();
  } catch (err) {
    console.error("Archive error:", err.response?.data || err);
    alert("Failed to archive item. Check console for details.");
  }
};

// Restore an archived item
const handleRestore = async (item) => {
  try {
    await api.patch(`/${getRouteType(type)}/${item.id}/restore`);
    fetchData();
  } catch (err) {
    console.error("Restore error:", err.response?.data || err);
    alert("Failed to restore item. Check console for details.");
  }
};

// Permanently delete an item
const handleDelete = async (item) => {
  if (!window.confirm("Permanently delete this item?")) return;
  try {
    await api.delete(`/${getRouteType(type)}/${item.id}/force`);
    fetchData();
  } catch (err) {
    console.error("Delete error:", err.response?.data || err);
    alert("Failed to delete item. Check console for details.");
  }
};

  const renderTab = () => {
    let data = tab === "departments" ? departments : tab === "courses" ? courses :years;

    const filtered = data.filter((i) =>
      (i.department_name || i.course_name || i.school_year || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#A7F3D0] capitalize">{tab}</h2>
          <button
            onClick={() => handleOpenModal(tab.slice(0, -1))}
            className="bg-[#00B5AD] px-4 py-2 rounded-lg text-white font-semibold hover:bg-[#019C95]"
          >
            + Add {tab.slice(0, -1)}
          </button>
        </div>

        <div className="flex justify-between mb-4 gap-2">
          <input
            placeholder={`Search ${tab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded w-full bg-[#015E5C]/60 text-white"
          />
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

        <ul className="bg-[#013836]/80 rounded-xl p-4 shadow-lg border border-[#015E5C]/40">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-2 border-b border-[#015E5C]/30"
              >
                <div>{item.department_name || item.course_name || item.school_year || "Unnamed"}</div>
                <div className="flex gap-2">
                  {item.deleted_at != null ? (
                    <>
                      <button
                        onClick={() => handleRestore(item)}
                        className="px-2 py-1 bg-green-600 rounded text-white hover:bg-green-700"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="px-2 py-1 bg-red-700 rounded text-white hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenModal(tab.slice(0, -1), item)}
                        className="px-2 py-1 bg-teal-600 rounded text-white hover:bg-teal-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(item)}
                        className="px-2 py-1 bg-red-600 rounded text-white hover:bg-red-700"
                      >
                        Archive
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="text-center p-2 text-gray-300">No {tab} found.</li>
          )}
        </ul>
      </div>
    );
  };

  const renderModalFields = () => {
    if (type === "department")
      return (
        <>
          <input
            name="department_name"
            value={formData.department_name || ""}
            onChange={handleChange}
            placeholder="Department Name"
            className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4"
          />
          <select
            name="department_head_id"
            value={formData.department_head_id || ""}
            onChange={handleChange}
            className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4"
          >
            <option value="">-- Select Department Head --</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.f_name} {f.l_name}
              </option>
            ))}
          </select>
        </>
      );

    if (type === "course")
      return (
        <>
          <input
            name="course_name"
            value={formData.course_name || ""}
            onChange={handleChange}
            placeholder="Course Name"
            className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4"
          />
          <select
            name="department_id"
            value={formData.department_id || ""}
            onChange={handleChange}
            className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4"
          >
            <option value="">-- Select Department --</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.department_name}
              </option>
            ))}
          </select>
        </>
      );

    if (type === "year")
      return (
        <>
          <input
            name="school_year"
            value={formData.school_year || ""}
            onChange={handleChange}
            placeholder="School Year (e.g., 2025–2026)"
            className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4"
          />
          <input
            type="date"
            name="start_date"
            value={formData.start_date || ""}
            onChange={handleChange}
            className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4"
          />
          <input
            type="date"
            name="end_date"
            value={formData.end_date || ""}
            onChange={handleChange}
            className="p-3 rounded w-full bg-[#015E5C]/60 text-white mb-4"
          />
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active || false}
              onChange={handleChange}
            />{" "}
            Active
          </label>
        </>
      );
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#A7F3D0] mb-8">Settings</h1>
        <div className="flex gap-4 mb-6">
          {["departments", "courses", "years"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                tab === t ? "bg-[#00B5AD] text-white" : "bg-[#015E5C]/50 text-gray-300 hover:bg-[#017E77]"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {renderTab()}

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
                  {editing ? "Edit" : "Add"} {type.charAt(0).toUpperCase() + type.slice(1)}
                </h3>
                {renderModalFields()}
                <div className="flex justify-end gap-2">
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
