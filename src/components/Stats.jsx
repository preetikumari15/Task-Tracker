import React from "react";

export default function Stats() {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const meetings = JSON.parse(localStorage.getItem("meetings") || "[]");
  const reports = JSON.parse(localStorage.getItem("reports") || "[]");

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Stats</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded text-center">
          <p className="text-2xl">{projects.length}</p>
          <p>Projects</p>
        </div>
        <div className="bg-green-100 p-4 rounded text-center">
          <p className="text-2xl">{meetings.length}</p>
          <p>Meetings</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded text-center">
          <p className="text-2xl">{reports.length}</p>
          <p>Reports</p>
        </div>
      </div>
    </div>
  );
}
