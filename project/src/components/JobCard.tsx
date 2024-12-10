import React from 'react';
import { MoreVertical } from 'lucide-react';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function JobCard({ job, onView, onEdit, onDelete }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {job.title}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            job.status === 'open' ? 'bg-green-100 text-green-800' :
            job.status === 'closed' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
        </div>
        <div className="relative group">
          <button
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <button
              onClick={onView}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              View Details
            </button>
            <button
              onClick={onEdit}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="space-y-2">
        <div className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">Requirements:</span>
          <ul className="list-disc list-inside mt-1 space-y-1">
            {job.requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="line-clamp-1">
                {req}
              </li>
            ))}
            {job.requirements.length > 3 && (
              <li className="text-indigo-600">
                +{job.requirements.length - 3} more
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
