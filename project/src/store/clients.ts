import { create } from "zustand";
import type { Client, ClientInsert, ClientUpdate } from "../types/temp-types";

interface ClientsState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: ClientInsert) => Promise<Client>;
  updateClient: (id: string, client: ClientUpdate) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

const useClientsStore = create<ClientsState>((set, get) => ({
  clients: [],
  loading: false,
  error: null,

  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const mockClients: Client[] = [];
      set({ clients: mockClients });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  addClient: async (client: ClientInsert) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      const newClient: Client = {
        id: crypto.randomUUID(),
        ...client,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set(state => ({ clients: [...state.clients, newClient] }));
      return newClient;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateClient: async (id: string, client: ClientUpdate) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      set(state => ({
        clients: state.clients.map(c => 
          c.id === id 
            ? { ...c, ...client, updated_at: new Date().toISOString() }
            : c
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteClient: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Replace with actual API call
      set(state => ({
        clients: state.clients.filter(c => c.id !== id)
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

export default useClientsStore;
