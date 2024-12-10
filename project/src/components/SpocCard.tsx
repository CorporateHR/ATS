import React from 'react';
import { Mail, Phone, Building2 } from 'lucide-react';
import type { SPOC } from '../types';

interface SpocCardProps {
  spoc: SPOC;
  onEdit: (spoc: SPOC) => void;
}

export default function SpocCard({ spoc, onEdit }: SpocCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            spoc.type === 'internal' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <Building2 className={`w-6 h-6 ${
              spoc.type === 'internal' ? 'text-blue-600' : 'text-green-600'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{spoc.name}</h3>
            <p className="text-sm text-gray-600">{spoc.designation}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          spoc.type === 'internal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {spoc.type.charAt(0).toUpperCase() + spoc.type.slice(1)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <a href={`mailto:${spoc.email}`} className="hover:text-indigo-600">
            {spoc.email}
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <a href={`tel:${spoc.phone}`} className="hover:text-indigo-600">
            {spoc.phone}
          </a>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(spoc)}
          className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
}
