import React, { useState, useEffect } from "react";
import { saveData, loadData } from "../utils/storage";

const MeetingForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agenda, setAgenda] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;
    onAdd({ title, date, time, agenda });
    setTitle("");
    setDate("");
    setTime("");
    setAgenda("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-10">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="time"
          className="border rounded px-3 py-2"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <textarea
        placeholder="Meeting Agenda (optional)"
        value={agenda}
        onChange={(e) => setAgenda(e.target.value)}
        className="w-full border rounded px-3 py-2"
        rows="2"
      />
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

export default function Meetings() {
  const [meetings, setMeetings] = useState(loadData("meetings", []));

  useEffect(() => saveData("meetings", meetings), [meetings]);

  const filteredMeetings = [...meetings].sort((a, b) => {
    return new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`);
  });

  const badgeForDeadline = (date) => {
    const today = new Date();
    const meetingDate = new Date(date);
    const daysUntil = Math.ceil((meetingDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Past</span>;
    } else if (daysUntil === 0) {
      return <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Today</span>;
    } else if (daysUntil <= 7) {
      return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Soon</span>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <MeetingForm onAdd={(m) => setMeetings((x) => [{ id: crypto.randomUUID(), ...m }, ...x])} />
        <Card title={`Meetings (${filteredMeetings.length})`}>
          {filteredMeetings.length === 0 ? (
            <Empty title="No meetings" note="Schedule one above." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredMeetings.map((m) => (
                <li key={m.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{m.title}</div>
                      <span className="text-xs text-gray-500">{m.date} • {m.time || "—"}</span>
                    </div>
                    {m.agenda && <div className="text-sm text-gray-600 max-w-[65ch]">{m.agenda}</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    {badgeForDeadline(m.date)}
                    <button
                      onClick={() => setMeetings((xs) => xs.filter((x) => x.id !== m.id))}
                      className="px-2.5 py-1.5 text-xs rounded-lg ring-1 ring-red-300 text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

