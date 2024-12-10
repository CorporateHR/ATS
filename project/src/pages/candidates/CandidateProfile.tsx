import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, Building, Briefcase, Calendar, FileText, 
  Edit, Trash2, MessageCircle, GraduationCap, Award, Clock, User
} from 'lucide-react';
import type { Candidate } from '../../types';

// This would come from your API in a real application
const MOCK_CANDIDATES: Record<string, Candidate> = {
  '1': {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    current_company: 'Tech Corp',
    current_designation: 'Senior Developer',
    experience: 5,
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
    resume_url: 'https://example.com/resume1.pdf',
    agency_id: '1',
    created_at: '2024-03-10',
    updated_at: '2024-03-10',
    status: 'Active'
  }
};

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const candidate = id ? MOCK_CANDIDATES[id] : null;
  const [activeTab, setActiveTab] = useState<'profile' | 'work' | 'education'>('profile');

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Candidate not found</h2>
          <p className="mt-1 text-sm text-gray-500">The candidate you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Candidates
          </button>
          <div className="flex space-x-3">
            <button 
              onClick={() => navigate(`/candidates/${id}/edit`)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              title="Edit Candidate"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </button>
            <button 
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="Remove Candidate"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Remove
            </button>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Profile Summary */}
          <div className="md:col-span-1 bg-white shadow rounded-lg p-6">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.current_designation} at {candidate.current_company}</p>
              
              {/* Status Badge */}
              <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium 
                ${candidate.status === 'Active' ? 'bg-green-100 text-green-800' : 
                  candidate.status === 'Inactive' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                {candidate.status}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                  {candidate.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:underline">
                  {candidate.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2 bg-white shadow rounded-lg">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                {[
                  { name: 'Profile', key: 'profile', icon: User },
                  { name: 'Work History', key: 'work', icon: Briefcase },
                  { name: 'Education', key: 'education', icon: GraduationCap }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`w-1/3 py-4 px-1 text-center flex items-center justify-center border-b-2 font-medium text-sm 
                      ${activeTab === tab.key 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}
                  >
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'work' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Work Experience
                  </h3>
                  <p>No work history available</p>
                </div>
              )}
              {activeTab === 'education' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2 text-blue-600" /> Education
                  </h3>
                  <p>No education history available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" /> Timeline
            </h3>
            <div className="text-sm text-gray-500">
              <p>Added on {new Date(candidate.created_at).toLocaleDateString()}</p>
              <p>Last updated {new Date(candidate.updated_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-blue-600" /> Notes
            </h3>
            <p className="text-sm text-gray-500">No notes available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
