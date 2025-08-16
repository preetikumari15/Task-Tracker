import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["Projects", "Meetings", "Reports", "Settings"];

  return (
    <div className="flex justify-center gap-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === tab
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

