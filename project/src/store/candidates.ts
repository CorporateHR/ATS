import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  current_company?: string;
  current_designation?: string;
  experience: number;
  skills: string[];
  resume_url?: string;
  created_at: Date;
  updated_at: Date;
  status: 'active' | 'hired' | 'rejected' | 'withdrawn';
}

interface CandidatesState {
  candidates: Candidate[];
  loading: boolean;
  error: string | null;
  fetchCandidates: () => Promise<void>;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>) => Promise<Candidate>;
  updateCandidate: (id: string, candidate: Partial<Candidate>) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;
}

const useCandidatesStore = create<CandidatesState>((set, get) => ({
  candidates: [],
  loading: false,
  error: null,

  fetchCandidates: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ candidates: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addCandidate: async (candidate) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('candidates')
        .insert([{
          ...candidate,
          created_at: new Date(),
          updated_at: new Date()
        }])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ candidates: [data, ...state.candidates] }));
      return data;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateCandidate: async (id, candidate) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('candidates')
        .update({
          ...candidate,
          updated_at: new Date()
        })
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        candidates: state.candidates.map(c => c.id === id ? { ...c, ...candidate } : c)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteCandidate: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        candidates: state.candidates.filter(c => c.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

export default useCandidatesStore;
