import { create } from 'zustand';
import type { User, UserRole } from '../types';
import { STORAGE_KEYS, getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  
  login: (username: string, password: string) => boolean;
  logout: () => void;
  initialize: () => void;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  canEdit: () => boolean;
  canAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  login: (username: string, password: string): boolean => {
    const users = getStorageItem<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    
    if (user) {
      setStorageItem(STORAGE_KEYS.CURRENT_USER, user);
      set({ user, isAuthenticated: true });
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    removeStorageItem(STORAGE_KEYS.CURRENT_USER);
    set({ user: null, isAuthenticated: false });
  },
  
  initialize: () => {
    const user = getStorageItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (user) {
      set({ user, isAuthenticated: true });
    }
  },
  
  hasPermission: (requiredRole: UserRole | UserRole[]): boolean => {
    const { user } = get();
    if (!user) return false;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    // Admin has all permissions
    if (user.role === 'administrator') return true;
    
    return roles.includes(user.role);
  },
  
  canEdit: (): boolean => {
    const { user } = get();
    if (!user) return false;
    return user.role === 'administrator' || user.role === 'data-entry';
  },
  
  canAdmin: (): boolean => {
    const { user } = get();
    if (!user) return false;
    return user.role === 'administrator';
  },
}));
