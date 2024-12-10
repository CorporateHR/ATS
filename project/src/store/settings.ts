import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Department {
  id: string;
  name: string;
  description?: string;
}

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
    settings?: {
      manage?: boolean;
    };
    users?: {
      manage?: boolean;
    };
  };
}

interface SettingsState {
  departments: Department[];
  roles: Role[];
  loading: boolean;
  error: string | null;
  
  // Departments
  fetchDepartments: () => Promise<void>;
  addDepartment: (name: string, description?: string) => Promise<void>;
  updateDepartment: (id: string, name: string, description?: string) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;
  
  // Roles
  fetchRoles: () => Promise<void>;
  addRole: (name: string, description?: string, permissions?: Role['permissions']) => Promise<void>;
  updateRole: (id: string, name: string, description?: string, permissions?: Role['permissions']) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  departments: [],
  roles: [],
  loading: false,
  error: null,

  // Departments
  fetchDepartments: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ departments: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addDepartment: async (name: string, description?: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('departments')
        .insert({ name, description });
      
      if (error) throw error;
      await get().fetchDepartments();
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateDepartment: async (id: string, name: string, description?: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('departments')
        .update({ name, description })
        .eq('id', id);
      
      if (error) throw error;
      await get().fetchDepartments();
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteDepartment: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await get().fetchDepartments();
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Roles
  fetchRoles: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      set({ roles: data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addRole: async (name: string, description?: string, permissions?: Role['permissions']) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('roles')
        .insert({ name, description, permissions });
      
      if (error) throw error;
      await get().fetchRoles();
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateRole: async (id: string, name: string, description?: string, permissions?: Role['permissions']) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('roles')
        .update({ name, description, permissions })
        .eq('id', id);
      
      if (error) throw error;
      await get().fetchRoles();
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteRole: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await get().fetchRoles();
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }
}));
