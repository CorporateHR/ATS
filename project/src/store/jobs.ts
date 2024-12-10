import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Job, JobInsert, JobUpdate } from '../types';

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  addJob: (job: JobInsert) => Promise<Job>;
  updateJob: (id: string, job: JobUpdate) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
}

const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ jobs: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addJob: async (job) => {
    set({ loading: true, error: null });
    try {
      // Ensure required fields are present
      if (!job.client_id || !job.agency_id) {
        throw new Error('Client ID and Agency ID are required');
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert([job])
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({ jobs: [data, ...state.jobs] }));
      return data;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateJob: async (id, job) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('jobs')
        .update(job)
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        jobs: state.jobs.map(j => j.id === id ? { ...j, ...job } : j)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteJob: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      set(state => ({
        jobs: state.jobs.filter(job => job.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

export default useJobsStore;
