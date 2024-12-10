import React, { useState, FormEvent } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { processResume } from '../services/ocrService';

interface CandidateFormData {
  name: string;
  email: string;
  mobile: string;
  experienceYears: number;
  experienceMonths: number;
  currentJobTitle: string;
  noticePeriod: number;
  state: string;
  city: string;
  projects: string;
  resume?: File;
}

interface AddCandidateFormProps {
  onSubmit: (data: CandidateFormData) => void;
  onCancel: () => void;
}

export default function AddCandidateForm({ onSubmit, onCancel }: AddCandidateFormProps) {
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    email: '',
    mobile: '',
    experienceYears: 0,
    experienceMonths: 0,
    currentJobTitle: '',
    noticePeriod: 0,
    state: '',
    city: '',
    projects: ''
  });

  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processResumeWithOCR = async (file: File) => {
    setIsProcessing(true);
    try {
      const extractedData = await processResume(file);
      
      setFormData(prev => ({
        ...prev,
        name: extractedData.name || prev.name,
        email: extractedData.email || prev.email,
        mobile: extractedData.mobile || prev.mobile,
        currentJobTitle: extractedData.current_job_title || prev.currentJobTitle,
        experienceYears: extractedData.experience_years || prev.experienceYears,
        city: extractedData.city || prev.city,
        state: extractedData.state || prev.state,
        resume: file
      }));
      setShowForm(true);
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Error processing resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      await processResumeWithOCR(file);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Add New Candidate</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Resume Upload Section */}
        <div className="mb-6">
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-center">
                {isProcessing ? (
                  <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                ) : (
                  <Upload className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <div className="flex flex-col items-center text-center">
                <label
                  htmlFor="resume-upload"
                  className="cursor-pointer relative text-sm text-gray-600"
                >
                  <span className="text-indigo-600 hover:text-indigo-700">
                    {isProcessing ? 'Processing resume...' : 'Upload a resume'}
                  </span>
                  <input
                    id="resume-upload"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                    disabled={isProcessing}
                  />
                </label>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>
            {resumeFileName && !isProcessing && (
              <div className="mt-4 text-sm text-gray-600">
                Selected file: {resumeFileName}
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, resume: undefined }));
                    setResumeFileName('');
                    setShowForm(false);
                  }}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Section - Only shown after resume processing */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Current Job Title */}
              <div>
                <label htmlFor="currentJobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Job Title
                </label>
                <input
                  type="text"
                  id="currentJobTitle"
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Experience Years */}
              <div>
                <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  id="experienceYears"
                  name="experienceYears"
                  min="0"
                  max="50"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Experience Months */}
              <div>
                <label htmlFor="experienceMonths" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (Months)
                </label>
                <input
                  type="number"
                  id="experienceMonths"
                  name="experienceMonths"
                  min="0"
                  max="11"
                  value={formData.experienceMonths}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Notice Period */}
              <div>
                <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Period (Days)
                </label>
                <input
                  type="number"
                  id="noticePeriod"
                  name="noticePeriod"
                  min="0"
                  value={formData.noticePeriod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Projects */}
            <div className="mt-4">
              <label htmlFor="projects" className="block text-sm font-medium text-gray-700 mb-1">
                Projects
              </label>
              <textarea
                id="projects"
                name="projects"
                value={formData.projects}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Add Candidate
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
