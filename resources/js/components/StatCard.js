import React from "react";

export default function StatCard({ title, value, color }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-center items-center w-full">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
