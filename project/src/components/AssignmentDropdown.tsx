import React from 'react';
import type { Client } from '../types/temp-types';
import type { Job } from '../types';

interface AssignmentDropdownProps {
  type: 'client' | 'spoc' | 'job';
  selectedId: string;
  onSelect: (value: string) => void;
  onAssign: () => void;
  disabled?: boolean;
}

// Define SPOC interface based on database schema
interface SPOC {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'internal' | 'external';
  designation: string;
  client_id: string;
}

// Updated mock data to match database schema
const MOCK_CLIENTS: Client[] = [
  {
    id: 'client1',
    name: 'TechCorp Solutions',
    industry: 'Technology',
    contact_person: 'John Smith',
    contact_email: 'john@techcorp.com',
    contact_phone: '+1 (555) 123-4567',
    created_at: new Date(),
    updated_at: new Date(),
    status: 'active'
  }
];

const MOCK_SPOCS: SPOC[] = [
  {
    id: 'spoc1',
    name: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    type: 'internal',
    designation: 'HR Manager',
    client_id: 'client1'
  }
];

const MOCK_JOBS: Job[] = [
  {
    id: 'job1',
    title: 'Senior Frontend Developer',
    description: 'Frontend development role',
    requirements: ['React', 'TypeScript'],
    clientId: 'client1',
    status: 'open',
    agency_id: 'agency1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    location: 'Remote',
    salary_range_start: 100000,
    salary_range_end: 150000,
    experience_level: 'Senior',
    created_by: 'user1',
    responsibilities: ['Build UI components', 'Write tests']
  }
];

export default function AssignmentDropdown({
  type,
  selectedId,
  onSelect,
  onAssign,
  disabled
}: AssignmentDropdownProps) {
  const getOptions = () => {
    switch (type) {
      case 'client':
        return MOCK_CLIENTS;
      case 'spoc':
        return MOCK_SPOCS;
      case 'job':
        return MOCK_JOBS;
      default:
        return [];
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'client':
        return 'Select Client';
      case 'spoc':
        return 'Select SPOC';
      case 'job':
        return 'Select Job';
      default:
        return '';
    }
  };

  const options = getOptions();

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {getLabel()}
      </label>
      <div className="flex space-x-2">
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
        >
          <option value="">{getLabel()}</option>
          {options.map((option: any) => (
            <option key={option.id} value={option.id}>
              {option.name || option.title}
            </option>
          ))}
        </select>
        <button
          onClick={onAssign}
          disabled={!selectedId}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Assign
        </button>
      </div>
    </div>
  );
}
