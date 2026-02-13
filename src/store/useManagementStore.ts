import { create } from 'zustand';
import type { ManagementCompany } from '../types';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage';

interface ManagementStore {
  companies: ManagementCompany[];
  
  addCompany: (company: ManagementCompany) => void;
  updateCompany: (id: string, company: Partial<ManagementCompany>) => void;
  deleteCompany: (id: string) => void;
  getCompany: (id: string) => ManagementCompany | undefined;
  setCompanies: (companies: ManagementCompany[]) => void;
  initialize: () => void;
}

const persistCompanies = (companies: ManagementCompany[]) =>
  setStorageItem(STORAGE_KEYS.MANAGEMENT_COMPANIES, companies);

export const useManagementStore = create<ManagementStore>((set, get) => ({
  companies: [],
  
  addCompany: (company) => {
    set((state) => {
      const newCompanies = [...state.companies, company];
      persistCompanies(newCompanies);
      return { companies: newCompanies };
    });
  },
  
  updateCompany: (id, updates) => {
    set((state) => {
      const newCompanies = state.companies.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      );
      persistCompanies(newCompanies);
      return { companies: newCompanies };
    });
  },
  
  deleteCompany: (id) => {
    set((state) => {
      const newCompanies = state.companies.filter((c) => c.id !== id);
      persistCompanies(newCompanies);
      return { companies: newCompanies };
    });
  },
  
  getCompany: (id) => get().companies.find((c) => c.id === id),
  
  setCompanies: (companies) => {
    persistCompanies(companies);
    set({ companies });
  },
  
  initialize: () => {
    const companies = getStorageItem<ManagementCompany[]>(STORAGE_KEYS.MANAGEMENT_COMPANIES, []);
    set({ companies });
  },
}));
