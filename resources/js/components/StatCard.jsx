import React from "react";

export default function StatCard({ title, value, bgColor }) {
  return (
    <div className={`p-6 rounded-xl shadow-lg text-white ${bgColor} hover:scale-105 transition transform`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
