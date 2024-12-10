import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Role } from '@/types/roles';

interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
  fetchRoles: () => Promise<void>;
  createRole: (role: Omit<Role, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRole: (id: string, role: Partial<Omit<Role, 'id'>>) => Promise<void>;
  deleteRole: (id: string) => Promise<void>;
}

export const useRolesStore = create<RolesState>((set) => ({
  roles: [],
  loading: false,
  error: null,

  fetchRoles: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ roles: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  createRole: async (role) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('roles').insert([role]);
      if (error) throw error;
      await useRolesStore.getState().fetchRoles();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateRole: async (id, role) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('roles')
        .update(role)
        .eq('id', id);

      if (error) throw error;
      await useRolesStore.getState().fetchRoles();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteRole: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await useRolesStore.getState().fetchRoles();
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
