import React, { useState, useEffect } from "react";
import { saveData, loadData } from "../utils/storage";

const ReportForm = ({ onAdd }) => {
  const [week, setWeek] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!week || !notes) return;
    onAdd({ week, notes });
    setWeek("");
    setNotes("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-10">
      <div className="flex gap-2">
        <input
          type="number"
          className="border rounded px-3 py-2 w-32"
          placeholder="Week #"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Report notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Report
        </button>
      </div>
    </form>
  );
};

const Empty = ({ title, note }) => (
  <div className="text-center py-6">
    <p className="text-gray-600 font-medium">{title}</p>
    <p className="text-gray-400 text-sm">{note}</p>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

export default function Reports() {
  const [reports, setReports] = useState(loadData("reports", []));

  useEffect(() => saveData("reports", reports), [reports]);

  const filteredReports = [...reports].sort((a, b) => b.week - a.week);

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <ReportForm onAdd={(r) => setReports((x) => [{ id: crypto.randomUUID(), ...r }, ...x])} />
        <Card title={`Reports (${filteredReports.length})`}>
          {filteredReports.length === 0 ? (
            <Empty title="No reports" note="Submit a weekly report above." />
          ) : (
            <div className="grid gap-3">
              {filteredReports.map((r) => (
                <div key={r.id} className="p-3 rounded-xl ring-1 ring-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Week {r.week}</div>
                    <button
                      onClick={() => setReports((xs) => xs.filter((x) => x.id !== r.id))}
                      className="px-2.5 py-1.5 text-xs rounded-lg ring-1 ring-red-300 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{r.notes}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

