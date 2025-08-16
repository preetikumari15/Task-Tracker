import React, { useState } from "react";
import { loadData, saveData } from "../utils/storage";

export default function Settings({ onImport, onClearAll }) {
  const [importStatus, setImportStatus] = useState(null);

  const exportData = () => {
    try {
      const data = {
        projects: loadData("projects", []),
        meetings: loadData("meetings", []),
        reports: loadData("reports", []),
        lastExported: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: "application/json" 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tracker-backup-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      setImportStatus({ type: 'success', message: 'Data exported successfully!' });
    } catch (error) {
      setImportStatus({ type: 'error', message: 'Failed to export data' });
    }
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
    
        if (!data.projects && !data.meetings && !data.reports) {
          throw new Error('Invalid data format');
        }

        saveData("projects", data.projects || []);
        saveData("meetings", data.meetings || []);
        saveData("reports", data.reports || []);
        
        if (onImport) {
          onImport(data);
        }
        
        setImportStatus({ type: 'success', message: 'Data imported successfully!' });
      } catch (error) {
        setImportStatus({ 
          type: 'error', 
          message: 'Error importing data. Please check the file format.' 
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        localStorage.clear();
        if (onClearAll) {
          onClearAll();
        }
        setImportStatus({ type: 'success', message: 'All data cleared successfully!' });
      } catch (error) {
        setImportStatus({ type: 'error', message: 'Failed to clear data' });
      }
    }
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={exportData}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              📤 Export Data
            </button>
            
            <div className="flex items-center gap-2">
              <label 
                htmlFor="import"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer transition-colors"
              >
                📥 Import Data
              </label>
              <input
                id="import"
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </div>

            <button
              onClick={handleClearAll}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              🗑️ Clear All Data
            </button>
          </div>

          {/* Status Message */}
          {importStatus && (
            <div className={`p-3 rounded ${
              importStatus.type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {importStatus.message}
            </div>
          )}

          {/* Instructions */}
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Instructions:</h3>
            <ul className="space-y-2">
              <li>• Clear All will permanently remove all stored data (cannot be undone)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

