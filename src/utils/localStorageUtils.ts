
// Utility functions for managing local storage

// Save data to local storage
export const saveToLocalStorage = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Get data from local storage
export const getFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return defaultValue;
  }
};

// Remove data from local storage
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Local storage keys
export const STORAGE_KEYS = {
  RECENT_FILES: 'insightviz-recent-files',
  SAVED_FILTERS: 'insightviz-saved-filters',
  USER_SETTINGS: 'insightviz-user-settings',
};
