import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Role } from '@/types/roles';
import { AVAILABLE_PERMISSIONS } from '@/types/roles';

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (role: Omit<Role, 'id' | 'created_at' | 'updated_at'>) => void;
  initialData?: Role;
}

export default function RoleForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: RoleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {} as Record<string, Record<string, boolean>>,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        permissions: initialData.permissions,
      });
    } else {
      // Initialize with all permissions set to false
      const initialPermissions = Object.entries(AVAILABLE_PERMISSIONS).reduce(
        (acc, [module, actions]) => ({
          ...acc,
          [module]: Object.keys(actions).reduce(
            (moduleAcc, action) => ({
              ...moduleAcc,
              [action]: false,
            }),
            {}
          ),
        }),
        {}
      );
      setFormData({
        name: '',
        description: '',
        permissions: initialPermissions,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePermission = (module: string, action: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: !prev.permissions[module]?.[action],
        },
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Role' : 'Create New Role'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Role Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(AVAILABLE_PERMISSIONS).map(([module, actions]) => (
                <div
                  key={module}
                  className="bg-gray-50 p-4 rounded-lg space-y-2"
                >
                  <h4 className="font-medium text-gray-900 capitalize mb-3">
                    {module}
                  </h4>
                  {Object.entries(actions).map(([action, label]) => (
                    <label
                      key={action}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions[module]?.[action] || false}
                        onChange={() => togglePermission(module, action)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {initialData ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
