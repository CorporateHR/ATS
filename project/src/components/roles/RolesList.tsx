import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';
import type { Role } from '@/types/roles';

interface RolesListProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export default function RolesList({ roles, onEdit, onDelete }: RolesListProps) {
  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div
          key={role.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
              {role.description && (
                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(role)}
                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-50"
                title="Edit role"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(role.id)}
                className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-50"
                title="Delete role"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(role.permissions).map(([module, permissions]) => (
              <div key={module} className="space-y-2">
                <h4 className="font-medium text-gray-700 capitalize">{module}</h4>
                <ul className="space-y-1">
                  {Object.entries(permissions).map(([action, enabled]) => (
                    <li
                      key={action}
                      className={`text-sm flex items-center gap-2 ${
                        enabled ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        enabled ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
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
  );
}
