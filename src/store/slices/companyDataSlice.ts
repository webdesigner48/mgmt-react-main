// store/slices/companyDataSlice.ts - Optimized company data management
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import companyDataHandler from '../../server/companyDataHandler';

// Types for your database tables based on your PHP structure
interface CompanyAllData {
  companyDetails: any;
  companySettings: any;
  companyDesignSettings: any;
  companyLogos: any;
  departments: any[];
  departmentDescriptions: any[];
  departmentFunctionDetails: any[];
  departmentModalDescriptions: any[];
  functionsBullets: any[];
  companyUsers: any[];
  userRoleLevels: any[];
  validRoles: any[];
  companyProcesses: any[];
  processDescriptions: any[];
  subprocesses: any[];
  capacityData: any[];
  instructions: any[];
  instructionImages: any[];
  ratings: any[];
}

interface CompanyDataState {
  selectedCompanyId: number | null;
  data: CompanyAllData;
  isLoading: boolean;
  loadingStates: {
    [key: string]: boolean;
  };
  error: string | null;
  lastFetched: string | null;
  dataFreshness: {
    [key: string]: string; // timestamp when each data type was last fetched
  };
}

const initialData: CompanyAllData = {
  companyDetails: null,
  companySettings: null,
  companyDesignSettings: null,
  companyLogos: null,
  departments: [],
  departmentDescriptions: [],
  departmentFunctionDetails: [],
  departmentModalDescriptions: [],
  functionsBullets: [],
  companyUsers: [],
  userRoleLevels: [],
  validRoles: [],
  companyProcesses: [],
  processDescriptions: [],
  subprocesses: [],
  capacityData: [],
  instructions: [],
  instructionImages: [],
  ratings: [],
};

const initialState: CompanyDataState = {
  selectedCompanyId: null,
  data: initialData,
  isLoading: false,
  loadingStates: {},
  error: null,
  lastFetched: null,
  dataFreshness: {},
};

// 🚀 MAIN ASYNC THUNK - Fetch ALL company data at once
export const fetchAllCompanyData = createAsyncThunk(
  'companyData/fetchAll',
  async (companyId: number, { rejectWithValue }) => {
    try {
      console.log(`🔄 Fetching all data for company ${companyId}...`);
      
      const allData = await companyDataHandler.fetchAllCompanyData(companyId);
      
      console.log('✅ All company data fetched successfully');
      return { companyId, data: allData };
    } catch (error) {
      console.error('❌ Error fetching all company data:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// 🔄 Refresh specific table data
export const refreshTableData = createAsyncThunk(
  'companyData/refreshTable',
  async (tableNames: string[], { getState, rejectWithValue }) => {
    try {
      const state = getState() as { companyData: CompanyDataState };
      const companyId = state.companyData.selectedCompanyId;
      
      if (!companyId) {
        throw new Error('No company selected');
      }

      const refreshedData = await companyDataHandler.refreshTableData(tableNames);
      return refreshedData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Refresh failed');
    }
  }
);

// 🆕 CRUD Operations
export const addUser = createAsyncThunk(
  'companyData/addUser',
  async (userData: any, { dispatch, rejectWithValue }) => {
    try {
      const result = await companyDataHandler.addUser(userData);
      
      // Refresh users data after successful addition
      if (result.status === 'success') {
        dispatch(refreshTableData(['companyUsers']));
      }
      
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Add user failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'companyData/updateUser',
  async ({ id, column, value }: { id: number; column: string; value: any }, { dispatch, rejectWithValue }) => {
    try {
      const result = await companyDataHandler.updateUser(id, column, value);
      
      // Refresh users data after successful update
      if (result.status === 'success') {
        dispatch(refreshTableData(['companyUsers']));
      }
      
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Update user failed');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'companyData/deleteUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const result = await companyDataHandler.deleteUser(userId);
      
      // Refresh users data after successful deletion
      if (result.status === 'success') {
        dispatch(refreshTableData(['companyUsers']));
      }
      
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Delete user failed');
    }
  }
);

export const saveDepartments = createAsyncThunk(
  'companyData/saveDepartments',
  async (departments: any[], { dispatch, rejectWithValue }) => {
    try {
      const result = await companyDataHandler.saveDepartments(departments);
      
      // Refresh departments data after successful save
      if (result.status === 'success') {
        dispatch(refreshTableData(['departments']));
      }
      
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Save departments failed');
    }
  }
);

export const saveProcesses = createAsyncThunk(
  'companyData/saveProcesses',
  async (processes: any[], { dispatch, rejectWithValue }) => {
    try {
      const result = await companyDataHandler.saveProcesses(processes);
      
      // Refresh processes data after successful save
      if (result.status === 'success') {
        dispatch(refreshTableData(['companyProcesses']));
      }
      
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Save processes failed');
    }
  }
);

const companyDataSlice = createSlice({
  name: 'companyData',
  initialState,
  reducers: {
    setSelectedCompanyId: (state, action: PayloadAction<number | null>) => {
      state.selectedCompanyId = action.payload;
      if (!action.payload) {
        // Clear data when no company is selected
        state.data = initialData;
        state.lastFetched = null;
        state.dataFreshness = {};
      }
    },
    
    clearAllData: (state) => {
      state.data = initialData;
      state.selectedCompanyId = null;
      state.lastFetched = null;
      state.dataFreshness = {};
      state.loadingStates = {};
    },

    clearError: (state) => {
      state.error = null;
    },

    // Manual data updates for optimistic updates
    updateTableDataManually: (state, action: PayloadAction<{ tableName: keyof CompanyAllData; data: any }>) => {
      const { tableName, data } = action.payload;
      state.data[tableName] = data;
      state.dataFreshness[tableName] = new Date().toISOString();
    },

    // Set loading state for specific operations
    setLoadingState: (state, action: PayloadAction<{ operation: string; loading: boolean }>) => {
      const { operation, loading } = action.payload;
      state.loadingStates[operation] = loading;
    },
  },
  extraReducers: (builder) => {
    // Fetch all company data
    builder
      .addCase(fetchAllCompanyData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('🔄 Starting to fetch all company data...');
      })
      .addCase(fetchAllCompanyData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCompanyId = action.payload.companyId;
        
        // Update all data
        Object.entries(action.payload.data).forEach(([key, value]) => {
          if (value && key in state.data) {
            (state.data as any)[key] = value.data || value; // Handle different response formats
            state.dataFreshness[key] = new Date().toISOString();
          }
        });
        
        state.lastFetched = new Date().toISOString();
        console.log('✅ All company data loaded successfully');
      })
      .addCase(fetchAllCompanyData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('❌ Failed to fetch company data:', action.payload);
      });

    // Refresh specific table data
    builder
      .addCase(refreshTableData.pending, (state, action) => {
        const tableNames = action.meta.arg;
        tableNames.forEach(tableName => {
          state.loadingStates[tableName] = true;
        });
      })
      .addCase(refreshTableData.fulfilled, (state, action) => {
        // Update refreshed data
        Object.entries(action.payload).forEach(([key, value]) => {
          if (key in state.data) {
            (state.data as any)[key] = (value as any).data || value;
            state.dataFreshness[key] = new Date().toISOString();
            state.loadingStates[key] = false;
          }
        });
      })
      .addCase(refreshTableData.rejected, (state, action) => {
        const tableNames = action.meta.arg;
        tableNames.forEach(tableName => {
          state.loadingStates[tableName] = false;
        });
      });

    // Handle CRUD operations
    builder
      .addCase(addUser.pending, (state) => {
        state.loadingStates.addUser = true;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loadingStates.addUser = false;
      })
      .addCase(addUser.rejected, (state) => {
        state.loadingStates.addUser = false;
      });

    builder
      .addCase(updateUser.pending, (state) => {
        state.loadingStates.updateUser = true;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loadingStates.updateUser = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.loadingStates.updateUser = false;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loadingStates.deleteUser = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loadingStates.deleteUser = false;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.loadingStates.deleteUser = false;
      });
  },
});

export const {
  setSelectedCompanyId,
  clearAllData,
  clearError,
  updateTableDataManually,
  setLoadingState,
} = companyDataSlice.actions;

// Selectors
export const selectCompanyData = (state: { companyData: CompanyDataState }) => state.companyData.data;
export const selectIsLoading = (state: { companyData: CompanyDataState }) => state.companyData.isLoading;
export const selectError = (state: { companyData: CompanyDataState }) => state.companyData.error;
export const selectSelectedCompanyId = (state: { companyData: CompanyDataState }) => state.companyData.selectedCompanyId;
export const selectLoadingStates = (state: { companyData: CompanyDataState }) => state.companyData.loadingStates;
export const selectDataFreshness = (state: { companyData: CompanyDataState }) => state.companyData.dataFreshness;

// Specific data selectors
export const selectCompanyUsers = (state: { companyData: CompanyDataState }) => state.companyData.data.companyUsers;
export const selectDepartments = (state: { companyData: CompanyDataState }) => state.companyData.data.departments;
export const selectCompanyProcesses = (state: { companyData: CompanyDataState }) => state.companyData.data.companyProcesses;
export const selectCompanyDetails = (state: { companyData: CompanyDataState }) => state.companyData.data.companyDetails;
export const selectCompanySettings = (state: { companyData: CompanyDataState }) => state.companyData.data.companySettings;

// Check if data is fresh (within last 5 minutes)
export const selectIsDataFresh = (tableName: string) => (state: { companyData: CompanyDataState }) => {
  const lastFetched = state.companyData.dataFreshness[tableName];
  if (!lastFetched) return false;
  
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return new Date(lastFetched) > fiveMinutesAgo;
};

export default companyDataSlice.reducer;