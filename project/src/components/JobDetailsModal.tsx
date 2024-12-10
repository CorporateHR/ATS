import React from 'react';
import { X, MapPin, Building2, DollarSign, Calendar, Edit2, Trash2 } from 'lucide-react';
import type { Job } from '../types';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
}

export default function JobDetailsModal({ isOpen, onClose, job, onEdit, onDelete }: JobDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{job.type}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-gray-500"
              title="Edit Job"
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-400 hover:text-red-500"
              title="Delete Job"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Job Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="h-4 w-4 mr-2" />
                    Client ID: {job.client_id}
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary_range.min.toLocaleString()} - {job.salary_range.max.toLocaleString()} {job.salary_range.currency}
                    </div>
                  )}
                  {job.created_at && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  job.status === 'open' ? 'bg-green-100 text-green-800' :
                  job.status === 'closed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
