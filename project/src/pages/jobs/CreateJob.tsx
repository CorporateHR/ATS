import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LinkedInShareModal } from '../../components/jobs/LinkedInShareModal';
import { IndeedShareModal } from '../../components/jobs/IndeedShareModal';

interface JobFormData {
  title: string;
  description: string;
  location: string;
  companyId: string;
  employmentType: string;
  experience: string;
  skills: string[];
  clientId: string;
  agencyId: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    interval: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  };
}

export function CreateJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    companyId: '',
    employmentType: 'FULL_TIME',
    experience: '',
    skills: [],
    clientId: '',
    agencyId: '',
  });
  
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showIndeedModal, setShowIndeedModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save job to your database
      const { data, error } = await supabase
        .from('jobs')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      // Show job portal selection dialog
      setShowLinkedInModal(true);
    } catch (error) {
      console.error('Error creating job:', error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkedInModalClose = () => {
    setShowLinkedInModal(false);
    // Show Indeed modal after LinkedIn
    setShowIndeedModal(true);
  };

  const handleIndeedModalClose = () => {
    setShowIndeedModal(false);
    // Navigate to jobs list after all sharing is done
    navigate('/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Job</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
            Employment Type
          </label>
          <select
            id="employmentType"
            value={formData.employmentType}
            onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="TEMPORARY">Temporary</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience Required
          </label>
          <input
            type="text"
            id="experience"
            value={formData.experience}
            onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            id="skills"
            value={formData.skills.join(', ')}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              skills: e.target.value.split(',').map(skill => skill.trim()) 
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
            Client ID
          </label>
          <input
            type="text"
            id="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="agencyId" className="block text-sm font-medium text-gray-700">
            Agency ID
          </label>
          <input
            type="text"
            id="agencyId"
            value={formData.agencyId}
            onChange={(e) => setFormData(prev => ({ ...prev, agencyId: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? 'Creating...' : 'Create Job'}
          </button>
        </div>
      </form>

      <LinkedInShareModal
        isOpen={showLinkedInModal}
        onClose={handleLinkedInModalClose}
        jobData={formData}
      />

      <IndeedShareModal
        isOpen={showIndeedModal}
        onClose={handleIndeedModalClose}
        jobData={formData}
      />
    </div>
  );
}
