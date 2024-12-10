import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useRolesStore } from '@/store/roles';
import RolesList from '@/components/roles/RolesList';
import RoleForm from '@/components/roles/RoleForm';
import type { Role } from '@/types/roles';

export default function RolesPage() {
  const { roles, loading, error, fetchRoles, createRole, updateRole, deleteRole } =
    useRolesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleCreateRole = async (roleData: Omit<Role, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createRole(roleData);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create role:', error);
    }
  };

  const handleUpdateRole = async (roleData: Omit<Role, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingRole) return;
    try {
      await updateRole(editingRole.id, roleData);
      setIsModalOpen(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(id);
      } catch (error) {
        console.error('Failed to delete role:', error);
      }
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading roles: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Roles</h1>
          <p className="text-gray-600">Manage roles and permissions</p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Role
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <RolesList
        roles={filteredRoles}
        onEdit={(role) => {
          setEditingRole(role);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteRole}
      />

      <RoleForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
        initialData={editingRole}
      />
    </div>
  );
}
