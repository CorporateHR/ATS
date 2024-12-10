import { create } from "zustand";
import type { Spoc, SpocInsert, SpocUpdate } from "../types/temp-types";

interface SpocsState {
  spocs: Spoc[];
  loading: boolean;
  error: string | null;
  fetchSpocs: () => Promise<void>;
  addSpoc: (spoc: SpocInsert) => Promise<Spoc>;
  updateSpoc: (id: string, spoc: SpocUpdate) => Promise<void>;
  deleteSpoc: (id: string) => Promise<void>;
}

const useSpocsStore = create<SpocsState>((set, get) => ({
  spocs: [],
  loading: false,
  error: null,

  fetchSpocs: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const mockSpocs: Spoc[] = [];
      set({ spocs: mockSpocs });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addSpoc: async (spoc: SpocInsert) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const newSpoc: Spoc = {
        id: crypto.randomUUID(),
        ...spoc,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set(state => ({ spocs: [...state.spocs, newSpoc] }));
      return newSpoc;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateSpoc: async (id: string, spoc: SpocUpdate) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      set(state => ({
        spocs: state.spocs.map(s => 
          s.id === id 
            ? { ...s, ...spoc, updated_at: new Date().toISOString() }
            : s
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteSpoc: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      set(state => ({
        spocs: state.spocs.filter(s => s.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

export default useSpocsStore;
