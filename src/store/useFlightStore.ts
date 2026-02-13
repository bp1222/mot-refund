import { create } from 'zustand';
import type { Flight, FuelReceipt } from '../types';
import { STORAGE_KEYS, getStorageItem, setStorageItem } from '../utils/storage';

interface FlightStore {
  flights: Flight[];
  fuelReceipts: FuelReceipt[];
  
  // Flight actions
  addFlight: (flight: Flight) => void;
  updateFlight: (id: string, flight: Partial<Flight>) => void;
  deleteFlight: (id: string) => void;
  getFlight: (id: string) => Flight | undefined;
  getFlightsForAircraft: (aircraftId: string) => Flight[];
  getFlightsForClient: (clientId: string) => Flight[];
  
  // Fuel receipt actions
  addFuelReceipt: (receipt: FuelReceipt) => void;
  updateFuelReceipt: (id: string, receipt: Partial<FuelReceipt>) => void;
  deleteFuelReceipt: (id: string) => void;
  getReceiptsForFlight: (flightId: string) => FuelReceipt[];
  
  // Bulk setters
  setFlights: (flights: Flight[]) => void;
  setFuelReceipts: (receipts: FuelReceipt[]) => void;
  
  // Initialize from storage
  initialize: () => void;
}

const persistFlights = (flights: Flight[]) => setStorageItem(STORAGE_KEYS.FLIGHTS, flights);
const persistReceipts = (receipts: FuelReceipt[]) => setStorageItem(STORAGE_KEYS.FUEL_RECEIPTS, receipts);

export const useFlightStore = create<FlightStore>((set, get) => ({
  flights: [],
  fuelReceipts: [],
  
  // Flight actions
  addFlight: (flight) => {
    set((state) => {
      const newFlights = [...state.flights, flight];
      persistFlights(newFlights);
      return { flights: newFlights };
    });
  },
  
  updateFlight: (id, updates) => {
    set((state) => {
      const newFlights = state.flights.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      );
      persistFlights(newFlights);
      return { flights: newFlights };
    });
  },
  
  deleteFlight: (id) => {
    set((state) => {
      const newFlights = state.flights.filter((f) => f.id !== id);
      // Also delete associated fuel receipts
      const newReceipts = state.fuelReceipts.filter((r) => r.flightId !== id);
      persistFlights(newFlights);
      persistReceipts(newReceipts);
      return { flights: newFlights, fuelReceipts: newReceipts };
    });
  },
  
  getFlight: (id) => get().flights.find((f) => f.id === id),
  
  getFlightsForAircraft: (aircraftId) =>
    get().flights.filter((f) => f.aircraftId === aircraftId),
  
  getFlightsForClient: (clientId) =>
    get().flights.filter((f) => f.clientId === clientId),
  
  // Fuel receipt actions
  addFuelReceipt: (receipt) => {
    set((state) => {
      const newReceipts = [...state.fuelReceipts, receipt];
      persistReceipts(newReceipts);
      return { fuelReceipts: newReceipts };
    });
  },
  
  updateFuelReceipt: (id, updates) => {
    set((state) => {
      const newReceipts = state.fuelReceipts.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      );
      persistReceipts(newReceipts);
      return { fuelReceipts: newReceipts };
    });
  },
  
  deleteFuelReceipt: (id) => {
    set((state) => {
      const newReceipts = state.fuelReceipts.filter((r) => r.id !== id);
      persistReceipts(newReceipts);
      return { fuelReceipts: newReceipts };
    });
  },
  
  getReceiptsForFlight: (flightId) =>
    get().fuelReceipts.filter((r) => r.flightId === flightId),
  
  // Bulk setters
  setFlights: (flights) => {
    persistFlights(flights);
    set({ flights });
  },
  
  setFuelReceipts: (receipts) => {
    persistReceipts(receipts);
    set({ fuelReceipts: receipts });
  },
  
  // Initialize from storage
  initialize: () => {
    const flights = getStorageItem<Flight[]>(STORAGE_KEYS.FLIGHTS, []);
    const fuelReceipts = getStorageItem<FuelReceipt[]>(STORAGE_KEYS.FUEL_RECEIPTS, []);
    set({ flights, fuelReceipts });
  },
}));
