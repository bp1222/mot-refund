import { create } from 'zustand';
import type { Client, ClientEngagement } from '../types';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage';

interface ClientStore {
  clients: Client[];
  engagements: ClientEngagement[];
  
  // Client actions
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
  
  // Engagement actions
  addEngagement: (engagement: ClientEngagement) => void;
  updateEngagement: (id: string, engagement: Partial<ClientEngagement>) => void;
  deleteEngagement: (id: string) => void;
  getEngagementsForClient: (clientId: string) => ClientEngagement[];
  getEngagementsForCompany: (companyId: string) => ClientEngagement[];
  getCurrentEngagement: (clientId: string) => ClientEngagement | undefined;
  
  // Bulk setters
  setClients: (clients: Client[]) => void;
  setEngagements: (engagements: ClientEngagement[]) => void;
  
  // Initialize from storage
  initialize: () => void;
}

const persistClients = (clients: Client[]) => setStorageItem(STORAGE_KEYS.CLIENTS, clients);
const persistEngagements = (engagements: ClientEngagement[]) =>
  setStorageItem(STORAGE_KEYS.CLIENT_ENGAGEMENTS, engagements);

export const useClientStore = create<ClientStore>((set, get) => ({
  clients: [],
  engagements: [],
  
  // Client actions
  addClient: (client) => {
    set((state) => {
      const newClients = [...state.clients, client];
      persistClients(newClients);
      return { clients: newClients };
    });
  },
  
  updateClient: (id, updates) => {
    set((state) => {
      const newClients = state.clients.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      persistClients(newClients);
      return { clients: newClients };
    });
  },
  
  deleteClient: (id) => {
    set((state) => {
      const newClients = state.clients.filter((c) => c.id !== id);
      persistClients(newClients);
      return { clients: newClients };
    });
  },
  
  getClient: (id) => get().clients.find((c) => c.id === id),
  
  // Engagement actions
  addEngagement: (engagement) => {
    set((state) => {
      const newEngagements = [...state.engagements, engagement];
      persistEngagements(newEngagements);
      return { engagements: newEngagements };
    });
  },
  
  updateEngagement: (id, updates) => {
    set((state) => {
      const newEngagements = state.engagements.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      );
      persistEngagements(newEngagements);
      return { engagements: newEngagements };
    });
  },
  
  deleteEngagement: (id) => {
    set((state) => {
      const newEngagements = state.engagements.filter((e) => e.id !== id);
      persistEngagements(newEngagements);
      return { engagements: newEngagements };
    });
  },
  
  getEngagementsForClient: (clientId) =>
    get().engagements.filter((e) => e.clientId === clientId),
  
  getEngagementsForCompany: (companyId) =>
    get().engagements.filter((e) => e.managementCompanyId === companyId),
  
  getCurrentEngagement: (clientId) =>
    get().engagements.find((e) => e.clientId === clientId && !e.endDate),
  
  // Bulk setters
  setClients: (clients) => {
    persistClients(clients);
    set({ clients });
  },
  
  setEngagements: (engagements) => {
    persistEngagements(engagements);
    set({ engagements });
  },
  
  // Initialize from storage
  initialize: () => {
    const clients = getStorageItem<Client[]>(STORAGE_KEYS.CLIENTS, []);
    const engagements = getStorageItem<ClientEngagement[]>(STORAGE_KEYS.CLIENT_ENGAGEMENTS, []);
    set({ clients, engagements });
  },
}));
