import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit2, UserPlus } from 'lucide-react';
import { useSettingsStore } from '../store/settings';

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

const availablePermissions: Permission[] = [
  {
    id: 'read_jobs',
    name: 'Read Jobs',
    description: 'View job listings and details',
    module: 'jobs'
  },
  {
    id: 'write_jobs',
    name: 'Manage Jobs',
    description: 'Create, edit, and delete jobs',
    module: 'jobs'
  },
  {
    id: 'read_candidates',
    name: 'Read Candidates',
    description: 'View candidate profiles and applications',
    module: 'candidates'
  },
  {
    id: 'write_candidates',
    name: 'Manage Candidates',
    description: 'Create, edit, and manage candidate profiles',
    module: 'candidates'
  },
  {
    id: 'read_team',
    name: 'Read Team',
    description: 'View team members',
    module: 'team'
  },
  {
    id: 'write_team',
    name: 'Manage Team',
    description: 'Add, edit, and manage team members',
    module: 'team'
  }
];

export default function UserRoles() {
  const { roles, fetchRoles, addRole, updateRole, deleteRole } = useSettingsStore();
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {}
  });

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleAddRole = async () => {
    if (!newRole.name) return;
    
    await addRole(newRole.name, newRole.description, newRole.permissions);
    setNewRole({ name: '', description: '', permissions: {} });
    setShowAddRole(false);
  };

  const handleUpdateRole = async () => {
    if (!editingRole || !editingRole.name) return;
    
    await updateRole(editingRole.id, editingRole.name, editingRole.description, editingRole.permissions);
    setEditingRole(null);
  };

  const handleDeleteRole = async (id: string) => {
    await deleteRole(id);
  };

  if (!roles || roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg shadow">
        <UserPlus className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Roles Created Yet</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first role to manage team permissions</p>
        <button
          onClick={() => setShowAddRole(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create First Role
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">User Roles</h2>
        {!showAddRole && (
          <button
            onClick={() => setShowAddRole(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </button>
        )}
      </div>

      {showAddRole && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <h3 className="text-lg font-medium">Add New Role</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Role Name"
              value={newRole.name}
              onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <div className="space-y-2">
              <h4 className="font-medium">Permissions</h4>
              {availablePermissions.map((permission) => (
                <label key={permission.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newRole.permissions[permission.id] || false}
                    onChange={(e) => {
                      setNewRole({
                        ...newRole,
                        permissions: {
                          ...newRole.permissions,
                          [permission.id]: e.target.checked
                        }
                      });
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{permission.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddRole(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRole}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Role
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role.id} className="bg-white p-4 rounded-lg shadow">
            {editingRole?.id === role.id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="space-y-2">
                  <h4 className="font-medium">Permissions</h4>
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingRole.permissions[permission.id] || false}
                        onChange={(e) => {
                          setEditingRole({
                            ...editingRole,
                            permissions: {
                              ...editingRole.permissions,
                              [permission.id]: e.target.checked
                            }
                          });
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{permission.name}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setEditingRole(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateRole}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">{role.name}</h3>
                    <p className="text-gray-500">{role.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingRole(role)}
                      className="p-2 text-gray-400 hover:text-gray-500"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availablePermissions
                      .filter((permission) => role.permissions[permission.id])
                      .map((permission) => (
                        <span
                          key={permission.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {permission.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
