import React, { useState } from "react";
import Tabs from "./components/Tabs";
import Projects from "./components/Projects";
import Meetings from "./components/Meetings";
import Reports from "./components/Reports";
import Settings from "./components/Settings";

export default function App() {
  const [activeTab, setActiveTab] = useState("Projects");
  const [searchQuery, setSearchQuery] = useState("");

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-15">
          <h1 className="text-4xl font-bold mb-4">
            📌Task Tracker
          </h1>
          <h2 className="text-xl text-gray-600">
           • Project  • Meeting  • Deadline Tracker
          </h2>
        </header>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="mt-6">
          {activeTab === "Projects" && <Projects searchQuery={searchQuery} />}
          {activeTab === "Meetings" && <Meetings searchQuery={searchQuery} />}
          {activeTab === "Reports" && <Reports searchQuery={searchQuery} />}
          {activeTab === "Settings" && <Settings onClearAll={handleClearAll} />}
        </main>
      </div>
    </div>
  );
}

