// LocalStorage keys
export const STORAGE_KEYS = {
  USERS: 'mot-refund-users',
  CURRENT_USER: 'mot-refund-current-user',
  AIRCRAFT: 'mot-refund-aircraft',
  DOCUMENTS: 'mot-refund-documents',
  OWNERS: 'mot-refund-owners',
  OWNERSHIPS: 'mot-refund-ownerships',
  MANAGEMENT_COMPANIES: 'mot-refund-management-companies',
  AIRCRAFT_MANAGEMENTS: 'mot-refund-aircraft-managements',
  CLIENTS: 'mot-refund-clients',
  CLIENT_ENGAGEMENTS: 'mot-refund-client-engagements',
  FLIGHTS: 'mot-refund-flights',
  FUEL_RECEIPTS: 'mot-refund-fuel-receipts',
  INITIALIZED: 'mot-refund-initialized',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// Generic storage helpers
export function getStorageItem<T>(key: StorageKey, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: StorageKey, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
  }
}

export function removeStorageItem(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
}

export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    removeStorageItem(key);
  });
}

export function isStorageInitialized(): boolean {
  return getStorageItem<boolean>(STORAGE_KEYS.INITIALIZED, false);
}

export function setStorageInitialized(): void {
  setStorageItem(STORAGE_KEYS.INITIALIZED, true);
}

// Create a middleware for Zustand to persist state
export function createStoragePersistence<T>(key: StorageKey) {
  return {
    getState: (): T | null => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    setState: (state: T): void => {
      localStorage.setItem(key, JSON.stringify(state));
    },
  };
}
