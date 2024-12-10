import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Mail, Phone, User, Check } from 'lucide-react';
import type { Candidate, Column } from '../types';

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    current_company: 'Tech Corp',
    current_designation: 'Senior Developer',
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js'],
    resume_url: 'https://example.com/resume1.pdf',
    applied_jobs: [
      {
        job_id: '1',
        applied_at: new Date('2024-03-10'),
        status: 'in-progress',
      }
    ],
    created_at: new Date('2024-03-10'),
    updated_at: new Date('2024-03-10')
  }
];

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (trackerId: string) => void;
  trackers: { id: string; name: string; }[];
}

function DownloadModal({ isOpen, onClose, onDownload, trackers }: DownloadModalProps) {
  const [selectedTracker, setSelectedTracker] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Download Candidates</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Tracker Format
          </label>
          <select
            value={selectedTracker}
            onChange={(e) => setSelectedTracker(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="">Select a tracker</option>
            {trackers.map((tracker) => (
              <option key={tracker.id} value={tracker.id}>
                {tracker.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDownload(selectedTracker);
              onClose();
            }}
            disabled={!selectedTracker}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-400"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyCandidates() {
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [trackers, setTrackers] = useState<{ id: string; name: string; }[]>([]);

  // Fetch trackers when component mounts
  useEffect(() => {
    // TODO: Replace with actual API call
    setTrackers([
      { id: '1', name: 'Default Tracker' },
      { id: '2', name: 'Technical Roles' },
      { id: '3', name: 'Sales Positions' },
    ]);
  }, []);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    }
  };

  const handleSelectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleDownload = (trackerId: string) => {
    // TODO: Implement actual download logic
    console.log('Downloading candidates:', selectedCandidates, 'with tracker:', trackerId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Candidates</h1>
        <p className="text-gray-600">View and manage candidates you've added</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            onClick={() => setShowDownloadModal(true)}
            disabled={selectedCandidates.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Download Selected
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Jobs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleSelectCandidate(candidate.id)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {candidate.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <a href={`mailto:${candidate.email}`} className="flex items-center gap-1 hover:text-indigo-600">
                            <Mail className="w-4 h-4" />
                            {candidate.email}
                          </a>
                          <a href={`tel:${candidate.phone}`} className="flex items-center gap-1 hover:text-indigo-600">
                            <Phone className="w-4 h-4" />
                            {candidate.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{candidate.current_designation}</div>
                    <div className="text-sm text-gray-500">{candidate.current_company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.experience} years
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {candidate.applied_jobs.length} jobs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-indigo-600 hover:text-indigo-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        onDownload={handleDownload}
        trackers={trackers}
      />
    </div>
  );
}
