import { create } from 'zustand';
import type { Aircraft, AircraftDocument, AircraftOwnership, AircraftManagement } from '../types';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage';

interface AircraftStore {
  aircraft: Aircraft[];
  documents: AircraftDocument[];
  ownerships: AircraftOwnership[];
  managements: AircraftManagement[];
  
  // Aircraft actions
  addAircraft: (aircraft: Aircraft) => void;
  updateAircraft: (id: string, aircraft: Partial<Aircraft>) => void;
  deleteAircraft: (id: string) => void;
  getAircraft: (id: string) => Aircraft | undefined;
  
  // Document actions
  addDocument: (document: AircraftDocument) => void;
  updateDocument: (id: string, document: Partial<AircraftDocument>) => void;
  deleteDocument: (id: string) => void;
  getDocumentsForAircraft: (aircraftId: string) => AircraftDocument[];
  
  // Ownership actions
  addOwnership: (ownership: AircraftOwnership) => void;
  updateOwnership: (id: string, ownership: Partial<AircraftOwnership>) => void;
  deleteOwnership: (id: string) => void;
  getOwnershipsForAircraft: (aircraftId: string) => AircraftOwnership[];
  getCurrentOwnership: (aircraftId: string) => AircraftOwnership | undefined;
  
  // Management actions
  addManagement: (management: AircraftManagement) => void;
  updateManagement: (id: string, management: Partial<AircraftManagement>) => void;
  deleteManagement: (id: string) => void;
  getManagementsForAircraft: (aircraftId: string) => AircraftManagement[];
  getCurrentManagement: (aircraftId: string) => AircraftManagement | undefined;
  
  // Bulk setters for initialization
  setAircraft: (aircraft: Aircraft[]) => void;
  setDocuments: (documents: AircraftDocument[]) => void;
  setOwnerships: (ownerships: AircraftOwnership[]) => void;
  setManagements: (managements: AircraftManagement[]) => void;
  
  // Initialize from storage
  initialize: () => void;
}

const persistAircraft = (aircraft: Aircraft[]) => setStorageItem(STORAGE_KEYS.AIRCRAFT, aircraft);
const persistDocuments = (documents: AircraftDocument[]) => setStorageItem(STORAGE_KEYS.DOCUMENTS, documents);
const persistOwnerships = (ownerships: AircraftOwnership[]) => setStorageItem(STORAGE_KEYS.OWNERSHIPS, ownerships);
const persistManagements = (managements: AircraftManagement[]) => setStorageItem(STORAGE_KEYS.AIRCRAFT_MANAGEMENTS, managements);

export const useAircraftStore = create<AircraftStore>((set, get) => ({
  aircraft: [],
  documents: [],
  ownerships: [],
  managements: [],
  
  // Aircraft actions
  addAircraft: (aircraft) => {
    set((state) => {
      const newAircraft = [...state.aircraft, aircraft];
      persistAircraft(newAircraft);
      return { aircraft: newAircraft };
    });
  },
  
  updateAircraft: (id, updates) => {
    set((state) => {
      const newAircraft = state.aircraft.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      );
      persistAircraft(newAircraft);
      return { aircraft: newAircraft };
    });
  },
  
  deleteAircraft: (id) => {
    set((state) => {
      const newAircraft = state.aircraft.filter((a) => a.id !== id);
      persistAircraft(newAircraft);
      return { aircraft: newAircraft };
    });
  },
  
  getAircraft: (id) => get().aircraft.find((a) => a.id === id),
  
  // Document actions
  addDocument: (document) => {
    set((state) => {
      const newDocuments = [...state.documents, document];
      persistDocuments(newDocuments);
      return { documents: newDocuments };
    });
  },
  
  updateDocument: (id, updates) => {
    set((state) => {
      const newDocuments = state.documents.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      );
      persistDocuments(newDocuments);
      return { documents: newDocuments };
    });
  },
  
  deleteDocument: (id) => {
    set((state) => {
      const newDocuments = state.documents.filter((d) => d.id !== id);
      persistDocuments(newDocuments);
      return { documents: newDocuments };
    });
  },
  
  getDocumentsForAircraft: (aircraftId) =>
    get().documents.filter((d) => d.aircraftId === aircraftId),
  
  // Ownership actions
  addOwnership: (ownership) => {
    set((state) => {
      const newOwnerships = [...state.ownerships, ownership];
      persistOwnerships(newOwnerships);
      return { ownerships: newOwnerships };
    });
  },
  
  updateOwnership: (id, updates) => {
    set((state) => {
      const newOwnerships = state.ownerships.map((o) =>
        o.id === id ? { ...o, ...updates } : o
      );
      persistOwnerships(newOwnerships);
      return { ownerships: newOwnerships };
    });
  },
  
  deleteOwnership: (id) => {
    set((state) => {
      const newOwnerships = state.ownerships.filter((o) => o.id !== id);
      persistOwnerships(newOwnerships);
      return { ownerships: newOwnerships };
    });
  },
  
  getOwnershipsForAircraft: (aircraftId) =>
    get().ownerships.filter((o) => o.aircraftId === aircraftId),
  
  getCurrentOwnership: (aircraftId) =>
    get().ownerships.find((o) => o.aircraftId === aircraftId && !o.endDate),
  
  // Management actions
  addManagement: (management) => {
    set((state) => {
      const newManagements = [...state.managements, management];
      persistManagements(newManagements);
      return { managements: newManagements };
    });
  },
  
  updateManagement: (id, updates) => {
    set((state) => {
      const newManagements = state.managements.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      );
      persistManagements(newManagements);
      return { managements: newManagements };
    });
  },
  
  deleteManagement: (id) => {
    set((state) => {
      const newManagements = state.managements.filter((m) => m.id !== id);
      persistManagements(newManagements);
      return { managements: newManagements };
    });
  },
  
  getManagementsForAircraft: (aircraftId) =>
    get().managements.filter((m) => m.aircraftId === aircraftId),
  
  getCurrentManagement: (aircraftId) =>
    get().managements.find((m) => m.aircraftId === aircraftId && !m.endDate),
  
  // Bulk setters
  setAircraft: (aircraft) => {
    persistAircraft(aircraft);
    set({ aircraft });
  },
  
  setDocuments: (documents) => {
    persistDocuments(documents);
    set({ documents });
  },
  
  setOwnerships: (ownerships) => {
    persistOwnerships(ownerships);
    set({ ownerships });
  },
  
  setManagements: (managements) => {
    persistManagements(managements);
    set({ managements });
  },
  
  // Initialize from storage
  initialize: () => {
    const aircraft = getStorageItem<Aircraft[]>(STORAGE_KEYS.AIRCRAFT, []);
    const documents = getStorageItem<AircraftDocument[]>(STORAGE_KEYS.DOCUMENTS, []);
    const ownerships = getStorageItem<AircraftOwnership[]>(STORAGE_KEYS.OWNERSHIPS, []);
    const managements = getStorageItem<AircraftManagement[]>(STORAGE_KEYS.AIRCRAFT_MANAGEMENTS, []);
    
    set({ aircraft, documents, ownerships, managements });
  },
}));
