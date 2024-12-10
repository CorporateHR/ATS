import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: {
    candidates?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
    jobs?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
    interviews?: {
      create?: boolean;
      read?: boolean;
      update?: boolean;
      delete?: boolean;
    };
    settings?: {
      manage?: boolean;
    };
  };
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description?: string }) => void;
  title: string;
  initialData?: { name: string; description?: string };
}

const AddEditModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function RoleManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Mock data for demonstration
  const roles: Role[] = [
    {
      id: '1',
      name: 'Admin',
      description: 'Full system access',
      permissions: {
        candidates: {
          create: true,
          read: true,
          update: true,
          delete: true
        },
        jobs: {
          create: true,
          read: true,
          update: true,
          delete: true
        },
        interviews: {
          create: true,
          read: true,
          update: true,
          delete: true
        },
        settings: {
          manage: true
        }
      }
    },
    {
      id: '2',
      name: 'Recruiter',
      description: 'Manage candidates and jobs',
      permissions: {
        candidates: {
          create: true,
          read: true,
          update: true,
          delete: false
        },
        jobs: {
          create: false,
          read: true,
          update: false,
          delete: false
        },
        interviews: {
          create: true,
          read: true,
          update: true,
          delete: false
        }
      }
    }
  ];

  const handleAdd = (data: { name: string; description?: string }) => {
    console.log('Adding role:', data);
    setIsModalOpen(false);
  };

  const handleEdit = (data: { name: string; description?: string }) => {
    console.log('Editing role:', data);
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      console.log('Deleting role:', id);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Roles</h2>
          <p className="text-sm text-gray-500">Manage user roles and permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Role
        </button>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                {role.description && (
                  <p className="text-sm text-gray-500">{role.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingRole(role);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(role.permissions).map(([category, perms]) => (
                <div key={category} className="space-y-2">
                  <h4 className="font-medium text-gray-700 capitalize">
                    {category}
                  </h4>
                  <ul className="space-y-1">
                    {Object.entries(perms).map(([action, allowed]) => (
                      <li
                        key={action}
                        className={`text-sm ${
                          allowed ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {action.charAt(0).toUpperCase() + action.slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        onSubmit={editingRole ? handleEdit : handleAdd}
        title={`${editingRole ? 'Edit' : 'Add'} Role`}
        initialData={editingRole || undefined}
      />
    </div>
  );
}
