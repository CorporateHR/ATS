import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'inactive';
}

interface TeamsState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>) => Promise<TeamMember>;
  updateMember: (id: string, member: Partial<TeamMember>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
}

const useTeamsStore = create<TeamsState>((set, get) => ({
  members: [],
  loading: false,
  error: null,

  fetchMembers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ members: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addMember: async (member) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          ...member,
          created_at: new Date(),
          updated_at: new Date()
        }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ members: [data, ...state.members] }));
      return data;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMember: async (id, member) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('team_members')
        .update({
          ...member,
          updated_at: new Date()
        })
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        members: state.members.map(m => m.id === id ? { ...m, ...member } : m)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMember: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        members: state.members.filter(m => m.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

export default useTeamsStore;
