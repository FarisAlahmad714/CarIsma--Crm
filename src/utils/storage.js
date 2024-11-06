// src/utils/storage.js

export const STORAGE_KEYS = {
  USER: 'carisma_user',
  COMPANY: 'carisma_company',
  USERS: 'carisma_users',
  INVITATIONS: 'carisma_invitations',
  AUTH_TOKEN: 'carisma_auth_token',      // For JWT or session tokens
  PREFERENCES: 'carisma_preferences',     // For user preferences
  NOTIFICATIONS: 'carisma_notifications',  // For notifications state
  LEADS: 'carisma_leads',
  VEHICLES: 'availableVehicles', // Corrected key
};

export const storage = {
  set: (key, value) => {
    try {
      if (!STORAGE_KEYS[key] && !Object.values(STORAGE_KEYS).includes(key)) {
        console.warn(`Using unregistered storage key: ${key}`);
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  get: (key) => {
    try {
      if (!STORAGE_KEYS[key] && !Object.values(STORAGE_KEYS).includes(key)) {
        console.warn(`Using unregistered storage key: ${key}`);
      }
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  remove: (key) => {
    try {
      if (!STORAGE_KEYS[key] && !Object.values(STORAGE_KEYS).includes(key)) {
        console.warn(`Using unregistered storage key: ${key}`);
      }
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};
