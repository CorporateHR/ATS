import React, { useState } from 'react';
import { Cog, Table, Plus } from 'lucide-react';
import TalentTracker from '../components/TalentTracker';

export default function Settings() {
  const [trackers, setTrackers] = useState([
    {
      id: '1',
      name: 'Engineering Recruitment 2024',
      columns: [
        { 
          id: 'name', 
          title: 'Full Name', 
          type: 'text', 
          color: '#6B7280' 
        },
        { 
          id: 'status', 
          title: 'Application Status', 
          type: 'select', 
          color: '#10B981',
          options: ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected']
        }
      ],
      assignments: [
        { type: 'job', id: 'eng-sr-dev-2024' },
        { type: 'client', id: 'tech-corp' }
      ]
    }
  ]);

  const [selectedTracker, setSelectedTracker] = useState<string | null>(null);

  const handleCreateTracker = () => {
    const newTracker = {
      id: (trackers.length + 1).toString(),
      name: `New Tracker ${trackers.length + 1}`,
      columns: [],
      assignments: []
    };
    setTrackers([...trackers, newTracker]);
    setSelectedTracker(newTracker.id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Cog className="w-6 h-6 text-gray-400" />
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trackers List */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Talent Trackers</h2>
            <button 
              onClick={handleCreateTracker}
              className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          {trackers.length === 0 ? (
            <div className="text-center py-8">
              <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No trackers created yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trackers.map(tracker => (
                <div 
                  key={tracker.id}
                  onClick={() => setSelectedTracker(tracker.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors
                    ${selectedTracker === tracker.id 
                      ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                      : 'hover:bg-gray-100 text-gray-700'}
                  `}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{tracker.name}</span>
                    <span className="text-xs text-gray-500">
                      {tracker.columns.length} columns
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Talent Tracker Configuration */}
        <div className="md:col-span-2 bg-white shadow rounded-lg">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedTracker 
                ? `Tracker: ${trackers.find(t => t.id === selectedTracker)?.name}` 
                : 'Select or Create a Tracker'}
            </h2>
            {selectedTracker ? (
              <TalentTracker 
                initialColumns={trackers.find(t => t.id === selectedTracker)?.columns || []}
                initialAssignments={trackers.find(t => t.id === selectedTracker)?.assignments || []}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Table className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Tracker Selected
                </h3>
                <p className="text-gray-500 mb-4">
                  Create a new tracker or select an existing one to configure
                </p>
                <button 
                  onClick={handleCreateTracker}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Tracker
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
