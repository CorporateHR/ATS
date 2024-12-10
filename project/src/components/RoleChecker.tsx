import React from 'react';
import { useAuthStore } from '../store/auth';

export default function RoleChecker() {
  const { user, agency } = useAuthStore();

  if (!user) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Not logged in. Please log in first.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Current User Details</h2>
      <div className="space-y-2">
        <p><span className="font-medium">Name:</span> {user.name}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Role:</span> {user.role}</p>
        {agency && (
          <>
            <p><span className="font-medium">Agency:</span> {agency.name}</p>
            <p><span className="font-medium">Subscription:</span> {agency.subscription}</p>
          </>
        )}
      </div>
    </div>
  );
}
