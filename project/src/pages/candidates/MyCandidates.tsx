import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Mail, Phone, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Candidate } from '../../types';
import AddCandidateForm from '../../components/AddCandidateForm';

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
    agency_id: '1',
    created_at: '2024-03-10',
    updated_at: '2024-03-10',
    status: 'Active'
  }
];

const HighlightedText: React.FC<{ text: string | null; highlight: string }> = ({ text, highlight }) => {
  if (!text || !highlight.trim()) {
    return <span>{text || ''}</span>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="bg-yellow-200 font-medium">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export default function MyCandidates() {
  const navigate = useNavigate();
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleViewProfile = (candidateId: string) => {
    navigate(`/candidates/${candidateId}`);
  };

  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) return candidates;

    const searchLower = searchTerm.toLowerCase();
    return candidates.filter(candidate => {
      const searchableFields = [
        candidate.name,
        candidate.email,
        candidate.phone,
        candidate.current_company,
        candidate.current_designation,
        ...candidate.skills,
      ];
      
      return searchableFields.some(field => 
        field?.toLowerCase().includes(searchLower)
      );
    });
  }, [candidates, searchTerm]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">My Candidates</h1>
            <p className="mt-1 text-sm text-gray-500">Manage candidates you've added to the system</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Candidate
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6">
            <AddCandidateForm
              onSubmit={(data) => {
                console.log('New candidate data:', data);
                setShowAddForm(false);
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, skills, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <button 
                onClick={() => {}} 
                disabled={selectedCandidates.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Selected
              </button>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredCandidates.map((candidate) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleSelectCandidate(candidate.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        <HighlightedText text={candidate.name} highlight={searchTerm} />
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      <HighlightedText 
                        text={candidate.current_designation} 
                        highlight={searchTerm}
                      />
                      {candidate.current_designation && candidate.current_company && ' • '}
                      <HighlightedText 
                        text={candidate.current_company} 
                        highlight={searchTerm}
                      />
                    </p>
                  </div>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {candidate.experience}y exp
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate hover:text-gray-900 transition-colors">
                      <HighlightedText text={candidate.email} highlight={searchTerm} />
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate hover:text-gray-900 transition-colors">
                      <HighlightedText text={candidate.phone} highlight={searchTerm} />
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                      >
                        <HighlightedText text={skill} highlight={searchTerm} />
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-gray-500">
                        +{candidate.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Added {new Date(candidate.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-colors">
                      Edit
                    </button>
                    <button 
                      onClick={() => handleViewProfile(candidate.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
