import React from 'react';
import { Layout } from 'lucide-react';
import TalentTracker from '../components/TalentTracker';
import RoleChecker from '../components/RoleChecker';

export default function Masters() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layout className="w-6 h-6 text-gray-400" />
          <h1 className="text-2xl font-semibold text-gray-900">Talent Tracker</h1>
        </div>
      </div>

      <RoleChecker />

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <TalentTracker />
        </div>
      </div>
    </div>
  );
}
