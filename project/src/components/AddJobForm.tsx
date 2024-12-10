import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { Job, JobInsert } from '../types';

interface AddJobFormProps {
  onSubmit: (job: JobInsert) => void;
  onCancel: () => void;
  job?: Job | null;
  agencyId: string;
  userId: string;
}

export default function AddJobForm({
  onSubmit,
  onCancel,
  job,
  agencyId,
  userId
}: AddJobFormProps) {
  const [formData, setFormData] = useState<JobInsert>({
    title: job?.title || '',
    description: job?.description || '',
    requirements: job?.requirements || [''],
    responsibilities: job?.responsibilities || [''],
    status: job?.status || 'open',
    agency_id: agencyId,
    location: job?.location || '',
    salary_range_start: job?.salary_range_start || 0,
    salary_range_end: job?.salary_range_end || 0,
    job_type: job?.job_type || '',
    experience_level: job?.experience_level || '',
    created_by: userId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addItem = (field: 'requirements' | 'responsibilities') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeItem = (field: 'requirements' | 'responsibilities', index: number) => {
    if (formData[field].length > 1) {
      setFormData({
        ...formData,
        [field]: formData[field].filter((_, i) => i !== index)
      });
    }
  };

  const handleItemChange = (
    field: 'requirements' | 'responsibilities',
    index: number,
    value: string
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field].map((item, i) => (i === index ? value : item))
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleItemChange('requirements', index, e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => removeItem('requirements', index)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('requirements')}
            className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Requirement
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
          {formData.responsibilities.map((resp, index) => (
            <div key={index} className="mt-2 flex items-center space-x-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleItemChange('responsibilities', index, e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => removeItem('responsibilities', index)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Minus className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('responsibilities')}
            className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Responsibility
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <input
              type="text"
              id="job_type"
              value={formData.job_type}
              onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="salary_start" className="block text-sm font-medium text-gray-700">
              Salary Range Start
            </label>
            <input
              type="number"
              id="salary_start"
              value={formData.salary_range_start}
              onChange={(e) => setFormData({ ...formData, salary_range_start: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="salary_end" className="block text-sm font-medium text-gray-700">
              Salary Range End
            </label>
            <input
              type="number"
              id="salary_end"
              value={formData.salary_range_end}
              onChange={(e) => setFormData({ ...formData, salary_range_end: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
              Experience Level
            </label>
            <input
              type="text"
              id="experience_level"
              value={formData.experience_level}
              onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'open' | 'closed' | 'on-hold' })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {job ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
}
