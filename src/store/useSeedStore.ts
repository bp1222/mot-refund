import { create } from 'zustand';
import {
  STORAGE_KEYS,
  clearAllStorage,
  isStorageInitialized,
  setStorageInitialized,
  setStorageItem,
} from '../utils/storage';
import { allSeedData } from '../utils/seedData';
import { useAuthStore } from './useAuthStore';
import { useAircraftStore } from './useAircraftStore';
import { useOwnerStore } from './useOwnerStore';
import { useManagementStore } from './useManagementStore';
import { useClientStore } from './useClientStore';
import { useFlightStore } from './useFlightStore';

interface SeedStore {
  isInitialized: boolean;
  initializeApp: () => void;
  resetToSeedData: () => void;
}

export const useSeedStore = create<SeedStore>((set) => ({
  isInitialized: false,
  
  initializeApp: () => {
    // Check if already initialized
    if (isStorageInitialized()) {
      // Load from storage
      useAuthStore.getState().initialize();
      useAircraftStore.getState().initialize();
      useOwnerStore.getState().initialize();
      useManagementStore.getState().initialize();
      useClientStore.getState().initialize();
      useFlightStore.getState().initialize();
      set({ isInitialized: true });
      return;
    }
    
    // First time - seed all data
    setStorageItem(STORAGE_KEYS.USERS, allSeedData.users);
    setStorageItem(STORAGE_KEYS.AIRCRAFT, allSeedData.aircraft);
    setStorageItem(STORAGE_KEYS.DOCUMENTS, allSeedData.documents);
    setStorageItem(STORAGE_KEYS.OWNERS, allSeedData.owners);
    setStorageItem(STORAGE_KEYS.OWNERSHIPS, allSeedData.ownerships);
    setStorageItem(STORAGE_KEYS.MANAGEMENT_COMPANIES, allSeedData.managementCompanies);
    setStorageItem(STORAGE_KEYS.AIRCRAFT_MANAGEMENTS, allSeedData.aircraftManagements);
    setStorageItem(STORAGE_KEYS.CLIENTS, allSeedData.clients);
    setStorageItem(STORAGE_KEYS.CLIENT_ENGAGEMENTS, allSeedData.clientEngagements);
    setStorageItem(STORAGE_KEYS.FLIGHTS, allSeedData.flights);
    setStorageItem(STORAGE_KEYS.FUEL_RECEIPTS, allSeedData.fuelReceipts);
    
    // Initialize stores from storage
    useAircraftStore.getState().initialize();
    useOwnerStore.getState().initialize();
    useManagementStore.getState().initialize();
    useClientStore.getState().initialize();
    useFlightStore.getState().initialize();
    
    // Mark as initialized
    setStorageInitialized();
    set({ isInitialized: true });
  },
  
  resetToSeedData: () => {
    // Clear all storage
    clearAllStorage();
    
    // Logout current user
    useAuthStore.getState().logout();
    
    // Re-seed all data
    setStorageItem(STORAGE_KEYS.USERS, allSeedData.users);
    setStorageItem(STORAGE_KEYS.AIRCRAFT, allSeedData.aircraft);
    setStorageItem(STORAGE_KEYS.DOCUMENTS, allSeedData.documents);
    setStorageItem(STORAGE_KEYS.OWNERS, allSeedData.owners);
    setStorageItem(STORAGE_KEYS.OWNERSHIPS, allSeedData.ownerships);
    setStorageItem(STORAGE_KEYS.MANAGEMENT_COMPANIES, allSeedData.managementCompanies);
    setStorageItem(STORAGE_KEYS.AIRCRAFT_MANAGEMENTS, allSeedData.aircraftManagements);
    setStorageItem(STORAGE_KEYS.CLIENTS, allSeedData.clients);
    setStorageItem(STORAGE_KEYS.CLIENT_ENGAGEMENTS, allSeedData.clientEngagements);
    setStorageItem(STORAGE_KEYS.FLIGHTS, allSeedData.flights);
    setStorageItem(STORAGE_KEYS.FUEL_RECEIPTS, allSeedData.fuelReceipts);
    
    // Re-initialize stores
    useAircraftStore.getState().initialize();
    useOwnerStore.getState().initialize();
    useManagementStore.getState().initialize();
    useClientStore.getState().initialize();
    useFlightStore.getState().initialize();
    
    // Mark as initialized
    setStorageInitialized();
    set({ isInitialized: true });
  },
}));
