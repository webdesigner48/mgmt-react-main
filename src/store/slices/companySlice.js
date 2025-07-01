// companySlice.js - Enhanced version
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'selectedCompany';

// Enhanced localStorage utilities with better error handling
const loadFromStorage = () => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Validate the structure to ensure it's valid data
    if (parsed && typeof parsed === 'object' && parsed.companyId) {
      return parsed;
    }
    
    // If structure is invalid, clean up
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch (error) {
    console.error('Error loading company from localStorage:', error);
    // Clear corrupted data
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (removeError) {
      console.error('Error clearing corrupted localStorage:', removeError);
    }
    return null;
  }
};

// Enhanced save to localStorage
const saveToStorage = (data) => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') return;
  
  try {
    if (data) {
      // Validate data before saving
      if (typeof data === 'object' && data.companyId) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('✅ Company data saved to localStorage');
      } else {
        console.warn('⚠️ Invalid company data, not saving to localStorage');
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
      console.log('🗑️ Company data removed from localStorage');
    }
  } catch (error) {
    console.error('❌ Error saving company to localStorage:', error);
    // If localStorage is full or unavailable, you might want to notify the user
    // This could trigger a toast notification in your app
  }
};

const initialState = {
  selectedCompany: loadFromStorage(),
  companies: [],
  isLoading: false,
  error: null,
  lastUpdated: null, // Track when data was last updated
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // Set selected company
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
      // Save to localStorage
      saveToStorage(action.payload);
    },

    // Clear selected company
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
      // Remove from localStorage
      saveToStorage(null);
    },

    // NEW: Update selected company (partial update)
    updateSelectedCompany: (state, action) => {
      if (state.selectedCompany) {
        state.selectedCompany = { ...state.selectedCompany, ...action.payload };
        state.lastUpdated = new Date().toISOString();
        saveToStorage(state.selectedCompany);
      }
    },

    // Set all companies (from admin panel)
    setCompanies: (state, action) => {
      state.companies = action.payload;
      state.error = null;
    },

    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // NEW: Clear error
    clearError: (state) => {
      state.error = null;
    },

    // NEW: Reset entire state
    resetCompanyState: (state) => {
      Object.assign(state, {
        selectedCompany: null,
        companies: [],
        isLoading: false,
        error: null,
        lastUpdated: null,
      });
      saveToStorage(null);
    },
  },
});

export const {
  setSelectedCompany,
  clearSelectedCompany,
  updateSelectedCompany, // NEW
  setCompanies,
  setLoading,
  setError,
  clearError, // NEW
  resetCompanyState, // NEW
} = companySlice.actions;

export default companySlice.reducer;