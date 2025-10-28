import React, { useState, useEffect } from "react";
import { Plus, Edit2, Archive, RotateCcw, X } from "lucide-react";
import axios from "../axios";

const tabs = ["Courses", "Departments", "Academic Years"];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("Departments");
  const [showArchived, setShowArchived] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
      // Load courses for each department
      response.data.forEach(dept => loadCourses(dept));
    } catch (error) {
      console.error('Failed to load departments:', error);
    }
  };

  const loadCourses = async (department) => {
    try {
      const response = await axios.get(`/api/departments/${department}/courses`);
      setCourses(prev => ({ ...prev, [department]: response.data }));
    } catch (error) {
      console.error('Failed to load courses:', error);
    }
  };

  const handleAdd = () => {
    setDialogMode("add");
    setNewItemName("");
    setSelectedItem(null);
    setShowDialog(true);
  };

  const handleEdit = (item) => {
    setDialogMode("edit");
    setNewItemName(item.name);
    setSelectedItem(item);
    if (activeTab === "Courses") {
      setSelectedDepartment(item.department);
    }
    setShowDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (activeTab === "Departments") {
        if (dialogMode === "add") {
          await axios.post('/api/departments', { name: newItemName });
        } else {
          await axios.put(`/api/departments/${selectedItem.name}`, { name: newItemName });
        }
        loadDepartments();
      } else if (activeTab === "Courses") {
        if (dialogMode === "add") {
          await axios.post(`/api/departments/${selectedDepartment}/courses`, { name: newItemName });
        } else {
          await axios.put(`/api/departments/${selectedDepartment}/courses/${selectedItem.name}`, { name: newItemName });
        }
        loadCourses(selectedDepartment);
      }
      setShowDialog(false);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (item) => {
    try {
      if (activeTab === "Departments") {
        await axios.delete(`/api/departments/${item.name}`);
        loadDepartments();
      } else if (activeTab === "Courses") {
        await axios.delete(`/api/departments/${selectedDepartment}/courses/${item.name}`);
        loadCourses(selectedDepartment);
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // Transform API data into the format expected by the table
  const getTableData = () => {
    if (activeTab === "Departments") {
      return departments.map((dept, index) => ({
        id: index + 1,
        name: dept,
        status: "Active"
      }));
    } else if (activeTab === "Courses") {
      const allCourses = [];
      let id = 1;
      Object.entries(courses).forEach(([dept, courseList]) => {
        courseList.forEach(course => {
          allCourses.push({
            id: id++,
            name: course,
            department: dept,
            status: "Active"
          });
        });
      });
      return allCourses;
    }
    return [];
  };

  const filteredData = getTableData().filter(
    (item) => (showArchived ? item.status === "Archived" : item.status === "Active")
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01302E] via-[#014F4D] to-[#012726] text-[#E9F9F8] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-[#A7F3D0] drop-shadow-md mb-10">
          System Settings
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300
                ${
                  activeTab === tab
                    ? "bg-[#00B5AD] text-white shadow-lg scale-105"
                    : "bg-[#015E5C]/60 text-[#E9F9F8] hover:bg-[#019C95]/80"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Section Controls */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-semibold text-[#A7F3D0]">
            {activeTab} Management
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold shadow-md transition active:scale-95
                ${
                  showArchived
                    ? "bg-[#F87171] text-white hover:bg-[#DC2626]"
                    : "bg-[#036666]/80 text-white hover:bg-[#00B5AD]"
                }`}
            >
              {showArchived ? (
                <>
                  <RotateCcw size={18} /> Show Active
                </>
              ) : (
                <>
                  <Archive size={18} /> Show Archived
                </>
              )}
            </button>

            {!showArchived && (
              <button className="flex items-center gap-2 bg-[#00B5AD] hover:bg-[#019C95] px-4 py-2 rounded-xl text-white font-semibold shadow-md transition active:scale-95">
                <Plus size={18} /> Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#013836]/80 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-[#015E5C]/40 transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#014F4D]/90 text-[#A7F3D0] uppercase">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#015E5C]/30 hover:bg-[#015E5C]/30 transition"
                    >
                      <td className="p-4">{item.id}</td>
                      <td className="p-4">{item.name}</td>
                      <td
                        className={`p-4 font-medium ${
                          item.status === "Active"
                            ? "text-[#6EE7B7]"
                            : "text-[#F87171]"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="p-4 flex justify-center gap-3">
                        {!showArchived ? (
                          <button className="p-2 bg-[#00B5AD]/20 rounded-lg hover:bg-[#00B5AD]/40 transition">
                            <Edit2 size={18} />
                          </button>
                        ) : null}
                        <button
                          className={`p-2 rounded-lg transition ${
                            showArchived
                              ? "bg-[#00B5AD]/20 hover:bg-[#00B5AD]/40"
                              : "bg-[#F87171]/20 hover:bg-[#F87171]/40"
                          }`}
                        >
                          {showArchived ? (
                            <RotateCcw size={18} />
                          ) : (
                            <Archive size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center p-6 text-[#A7F3D0] italic"
                    >
                      No {showArchived ? "archived" : "active"}{" "}
                      {activeTab.toLowerCase()} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-[#013836] p-6 rounded-2xl shadow-xl border border-[#015E5C] w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-[#A7F3D0]">
                {dialogMode === "add" ? "Add" : "Edit"} {activeTab.slice(0, -1)}
              </h3>
              <button
                onClick={() => setShowDialog(false)}
                className="p-2 hover:bg-[#015E5C]/40 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === "Courses" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full bg-[#014F4D] border border-[#015E5C] rounded-lg p-2 focus:outline-none focus:border-[#00B5AD]"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-[#014F4D] border border-[#015E5C] rounded-lg p-2 focus:outline-none focus:border-[#00B5AD]"
                  required
                />
              </div>

              {error && (
                <div className="mb-4 text-[#F87171] text-sm">{error}</div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="px-4 py-2 rounded-lg border border-[#015E5C] hover:bg-[#015E5C]/40 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00B5AD] hover:bg-[#019C95] transition"
                >
                  {dialogMode === "add" ? "Add" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
