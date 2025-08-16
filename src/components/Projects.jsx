import React, { useState, useEffect } from "react";
import { saveData, loadData } from "../utils/storage";
import cx from "classnames";

export default function Projects() {
  const [projects, setProjects] = useState(loadData("projects", []));
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => saveData("projects", projects), [projects]);

  const filteredProjects = projects;

  const badgeForDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Overdue</span>;
    } else if (daysLeft <= 7) {
      return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Soon</span>;
    }
    return null;
  };


  const ProjectForm = ({ onAdd }) => {
    const [formTitle, setFormTitle] = useState("");
    const [formDeadline, setFormDeadline] = useState("");
    const [formDescription, setFormDescription] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!formTitle || !formDeadline) return;
      onAdd({ title: formTitle, deadline: formDeadline, description: formDescription, completed: false });
      setFormTitle("");
      setFormDeadline("");
      setFormDescription("");
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 mt-10">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Project Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <input
            type="date"
            value={formDeadline}
            onChange={(e) => setFormDeadline(e.target.value)}
            className="border rounded px-3 py-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Project
          </button>
        </div>
        <textarea
          placeholder="Project Description (optional)"
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <ProjectForm onAdd={(p) => setProjects((x) => [{ id: crypto.randomUUID(), ...p }, ...x])} />
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Projects ({filteredProjects.length})</h2>
          </div>
          {filteredProjects.length === 0 ? (
            <Empty title="No projects" note="Add your first project above." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-2">Title</th>
                    <th className="px-4 py-2">Deadline</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="px-4 py-3">
                        <div className="font-medium">{p.title}</div>
                        <div className="text-gray-500 text-xs line-clamp-2 max-w-[40ch]">
                          {p.description}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{p.deadline || "—"}</span>
                          {p.deadline && badgeForDeadline(p.deadline)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cx(
                            "px-2 py-0.5 text-xs rounded-full",
                            p.completed
                              ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-gray-100 text-gray-700 ring-1 ring-gray-200"
                          )}
                        >
                          {p.completed ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setProjects((xs) =>
                                xs.map((x) => (x.id === p.id ? { ...x, completed: !x.completed } : x))
                              )
                            }
                            className="px-2.5 py-1.5 text-xs rounded-lg ring-1 ring-gray-300 hover:bg-gray-50"
                          >
                            {p.completed ? "Mark Pending" : "Mark Done"}
                          </button>
                          <button
                            onClick={() => setProjects((xs) => xs.filter((x) => x.id !== p.id))}
                            className="px-2.5 py-1.5 text-xs rounded-lg ring-1 ring-red-300 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

