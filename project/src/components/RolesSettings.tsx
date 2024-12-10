import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { useSettingsStore } from '../store/settings';

interface Permission {
  label: string;
  key: string;
  actions: {
    label: string;
    key: string;
  }[];
}

const permissions: Permission[] = [
  {
    label: 'Candidates',
    key: 'candidates',
    actions: [
      { label: 'Create', key: 'create' },
      { label: 'View', key: 'read' },
      { label: 'Edit', key: 'update' },
      { label: 'Delete', key: 'delete' }
    ]
  },
  {
    label: 'Jobs',
    key: 'jobs',
    actions: [
      { label: 'Create', key: 'create' },
      { label: 'View', key: 'read' },
      { label: 'Edit', key: 'update' },
      { label: 'Delete', key: 'delete' }
    ]
  },
  {
    label: 'Interviews',
    key: 'interviews',
    actions: [
      { label: 'Create', key: 'create' },
      { label: 'View', key: 'read' },
      { label: 'Edit', key: 'update' },
      { label: 'Delete', key: 'delete' }
    ]
  },
  {
    label: 'Settings',
    key: 'settings',
    actions: [
      { label: 'Manage', key: 'manage' }
    ]
  },
  {
    label: 'Users',
    key: 'users',
    actions: [
      { label: 'Manage', key: 'manage' }
    ]
  }
];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    permissions: Record<string, Record<string, boolean>>;
  }) => void;
  title: string;
  initialData?: {
    name: string;
    description?: string;
    permissions: Record<string, Record<string, boolean>>;
  };
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
  const [rolePermissions, setRolePermissions] = useState<Record<string, Record<string, boolean>>>(
    initialData?.permissions || {}
  );

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
      setRolePermissions(initialData?.permissions || {});
    }
  }, [isOpen, initialData]);

  const handlePermissionChange = (
    module: string,
    action: string,
    value: boolean
  ) => {
    setRolePermissions((prev) => ({
      ...prev,
      [module]: {
        ...(prev[module] || {}),
        [action]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description, permissions: rolePermissions });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
              <div className="space-y-6">
                {permissions.map((module) => (
                  <div key={module.key} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      {module.label}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {module.actions.map((action) => (
                        <label
                          key={action.key}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={rolePermissions[module.key]?.[action.key] || false}
                            onChange={(e) =>
                              handlePermissionChange(
                                module.key,
                                action.key,
                                e.target.checked
                              )
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{action.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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

export default function RolesSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    name: string;
    description?: string;
    permissions: Record<string, Record<string, boolean>>;
  } | null>(null);

  const {
    roles,
    loading,
    error,
    fetchRoles,
    addRole,
    updateRole,
    deleteRole
  } = useSettingsStore();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleAdd = async (data: {
    name: string;
    description?: string;
    permissions: Record<string, Record<string, boolean>>;
  }) => {
    await addRole(data.name, data.description, data.permissions);
  };

  const handleEdit = async (data: {
    name: string;
    description?: string;
    permissions: Record<string, Record<string, boolean>>;
  }) => {
    if (editingItem) {
      await updateRole(editingItem.id, data.name, data.description, data.permissions);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      await deleteRole(id);
    }
  };

  const getPermissionSummary = (permissions: Record<string, Record<string, boolean>>) => {
    const summary: string[] = [];
    for (const [module, actions] of Object.entries(permissions)) {
      const modulePermissions = Object.entries(actions)
        .filter(([, value]) => value)
        .map(([key]) => key);
      if (modulePermissions.length > 0) {
        summary.push(`${module}: ${modulePermissions.join(', ')}`);
      }
    }
    return summary;
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Roles</h2>
          <p className="text-sm text-gray-500">
            Manage roles and their permissions
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
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
            className="p-4 bg-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{role.name}</h3>
                {role.description && (
                  <p className="text-sm text-gray-500">{role.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(role);
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
            <div className="mt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-1">Permissions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {permissions.map((module) => (
                  <div key={module.key} className="text-sm">
                    <span className="font-medium">{module.label}:</span>
                    <div className="ml-2 space-y-1">
                      {module.actions.map((action) => (
                        <div key={action.key} className="flex items-center gap-1">
                          {role.permissions?.[module.key]?.[action.key] ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-gray-600">{action.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleEdit : handleAdd}
        title={`${editingItem ? 'Edit' : 'Add'} Role`}
        initialData={editingItem || undefined}
      />
    </div>
  );
}
