import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Mail, Phone, User, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Candidate } from '../../types';

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
    status: 'active' // updated to lowercase
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    current_company: 'Software Solutions Inc.',
    current_designation: 'Frontend Engineer',
    experience: 3,
    skills: ['Vue', 'JavaScript', 'CSS'],
    resume_url: 'https://example.com/resume2.pdf',
    agency_id: '1',
    created_at: '2024-03-11',
    updated_at: '2024-03-11',
    status: 'active' // updated to lowercase
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

export default function AllCandidates() {
  const navigate = useNavigate();
  const [candidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

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
            <h1 className="text-2xl font-semibold text-gray-900">All Candidates</h1>
            <p className="mt-1 text-sm text-gray-500">View and manage all candidates in the system</p>
          </div>
        </div>

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
            <div 
              key={candidate.id} 
              onClick={() => handleViewProfile(candidate.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCandidate(candidate.id);
                        }}
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

                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2.5 text-gray-400 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                        >
                          <HighlightedText text={skill} highlight={searchTerm} />
                        </span>
                      ))}
                      {candidate.skills.length > 3 && (
                        <span className="text-gray-500 text-xs ml-1">
                          +{candidate.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results State */}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">No Candidates Found</h2>
              <p className="text-gray-600 mb-6">
                Your search did not match any candidates. Try adjusting your search terms.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
