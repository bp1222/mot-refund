import { create } from 'zustand';
import type { Owner } from '../types';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage';

interface OwnerStore {
  owners: Owner[];
  
  addOwner: (owner: Owner) => void;
  updateOwner: (id: string, owner: Partial<Owner>) => void;
  deleteOwner: (id: string) => void;
  getOwner: (id: string) => Owner | undefined;
  setOwners: (owners: Owner[]) => void;
  initialize: () => void;
}

const persistOwners = (owners: Owner[]) => setStorageItem(STORAGE_KEYS.OWNERS, owners);

export const useOwnerStore = create<OwnerStore>((set, get) => ({
  owners: [],
  
  addOwner: (owner) => {
    set((state) => {
      const newOwners = [...state.owners, owner];
      persistOwners(newOwners);
      return { owners: newOwners };
    });
  },
  
  updateOwner: (id, updates) => {
    set((state) => {
      const newOwners = state.owners.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      );
      persistOwners(newOwners);
      return { owners: newOwners };
    });
  },
  
  deleteOwner: (id) => {
    set((state) => {
      const newOwners = state.owners.filter((o) => o.id !== id);
      persistOwners(newOwners);
      return { owners: newOwners };
    });
  },
  
  getOwner: (id) => get().owners.find((o) => o.id === id),
  
  setOwners: (owners) => {
    persistOwners(owners);
    set({ owners });
  },
  
  initialize: () => {
    const owners = getStorageItem<Owner[]>(STORAGE_KEYS.OWNERS, []);
    set({ owners });
  },
}));
