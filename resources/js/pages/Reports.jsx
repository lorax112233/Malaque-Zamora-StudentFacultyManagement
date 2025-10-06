




import React, { useState } from "react";

export default function Reports() {
  const [type, setType] = useState("students");

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-teal-300">Reports</h1>
      <div className="flex gap-4 mb-8 justify-center">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-3 rounded-lg bg-[#014F4D] text-white focus:ring-2 focus:ring-teal-400 focus:border-teal-400 text-lg"
        >
          <option value="students">Student Report</option>
          <option value="faculty">Faculty Report</option>
        </select>
      </div>
      <div className="bg-[#053D3A] p-8 rounded-2xl shadow-lg text-gray-200 min-h-[120px] flex items-center justify-center">
        {type === "students" ? (
          <p className="text-xl font-medium">Generate report filtered by <span className="text-teal-300 font-bold">course</span>.</p>
        ) : (
          <p className="text-xl font-medium">Generate report filtered by <span className="text-teal-300 font-bold">department</span>.</p>
        )}
      </div>
    </div>
  );
}
