// hooks/useCompanyData.ts - Complete company data management hook
import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchAllCompanyData,
  refreshTableData,
  addUser,
  updateUser,
  deleteUser,
  saveDepartments,
  saveProcesses,
  setSelectedCompanyId,
  clearAllData,
  selectCompanyData,
  selectIsLoading,
  selectError,
  selectSelectedCompanyId,
  selectLoadingStates,
  selectDataFreshness,
  selectCompanyUsers,
  selectDepartments,
  selectCompanyProcesses,
  selectCompanyDetails,
  selectCompanySettings,
  selectIsDataFresh,
} from '../store/slices/companyDataSlice';

interface UseCompanyDataOptions {
  autoFetch?: boolean; // Automatically fetch data when company changes
  refreshInterval?: number; // Auto-refresh interval in minutes (0 = disabled)
}

export const useCompanyData = (options: UseCompanyDataOptions = {}) => {
  const { autoFetch = true, refreshInterval = 0 } = options;
  
  const dispatch = useAppDispatch();
  
  // Get selected company from the main company slice
  const selectedCompany = useAppSelector((state) => state.company.selectedCompany);
  
  // Get all company data state
  const selectedCompanyId = useAppSelector(selectSelectedCompanyId);
  const allCompanyData = useAppSelector(selectCompanyData);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const loadingStates = useAppSelector(selectLoadingStates);
  const dataFreshness = useAppSelector(selectDataFreshness);
  
  // Get specific data
  const companyUsers = useAppSelector(selectCompanyUsers);
  const departments = useAppSelector(selectDepartments);
  const companyProcesses = useAppSelector(selectCompanyProcesses);
  const companyDetails = useAppSelector(selectCompanyDetails);
  const companySettings = useAppSelector(selectCompanySettings);

  // 🚀 MAIN EFFECT: Auto-fetch data when company is selected
  useEffect(() => {
    if (autoFetch && selectedCompany?.companyId && selectedCompany.companyId !== selectedCompanyId) {
      console.log(`🏢 Company changed to: ${selectedCompany.companyName} (ID: ${selectedCompany.companyId})`);
      
      // Set the selected company ID first
      dispatch(setSelectedCompanyId(selectedCompany.companyId));
      
      // Then fetch all data
      dispatch(fetchAllCompanyData(selectedCompany.companyId));
    }
  }, [selectedCompany?.companyId, selectedCompanyId, autoFetch, dispatch]);

  // 🔄 Auto-refresh effect
  useEffect(() => {
    if (refreshInterval > 0 && selectedCompanyId) {
      const interval = setInterval(() => {
        console.log(`🔄 Auto-refreshing company data every ${refreshInterval} minutes`);
        dispatch(fetchAllCompanyData(selectedCompanyId));
      }, refreshInterval * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, selectedCompanyId, dispatch]);

  // 🔄 Manual refresh function
  const refreshAllData = useCallback(() => {
    if (selectedCompanyId) {
      dispatch(fetchAllCompanyData(selectedCompanyId));
    }
  }, [selectedCompanyId, dispatch]);

  // 🔄 Refresh specific tables
  const refreshSpecificData = useCallback((tableNames: string[]) => {
    dispatch(refreshTableData(tableNames));
  }, [dispatch]);

  // 👥 User management functions
  const userActions = {
    add: useCallback((userData: any) => dispatch(addUser(userData)), [dispatch]),
    update: useCallback((id: number, column: string, value: any) => 
      dispatch(updateUser({ id, column, value })), [dispatch]),
    delete: useCallback((userId: number) => dispatch(deleteUser(userId)), [dispatch]),
  };

  // 🏢 Department management functions
  const departmentActions = {
    save: useCallback((departments: any[]) => dispatch(saveDepartments(departments)), [dispatch]),
    refresh: useCallback(() => refreshSpecificData(['departments']), [refreshSpecificData]),
  };

  // ⚙️ Process management functions
  const processActions = {
    save: useCallback((processes: any[]) => dispatch(saveProcesses(processes)), [dispatch]),
    refresh: useCallback(() => refreshSpecificData(['companyProcesses']), [refreshSpecificData]),
  };

  // 🧹 Clear all data
  const clearData = useCallback(() => {
    dispatch(clearAllData());
  }, [dispatch]);

  // 📊 Data freshness checks
  const isDataFresh = useCallback((tableName: string) => {
    const freshness = dataFreshness[tableName];
    if (!freshness) return false;
    
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return new Date(freshness) > fiveMinutesAgo;
  }, [dataFreshness]);

  // 📈 Get data with freshness info
  const getDataWithFreshness = useCallback((tableName: keyof typeof allCompanyData) => {
    return {
      data: allCompanyData[tableName],
      isFresh: isDataFresh(tableName),
      lastFetched: dataFreshness[tableName],
      isLoading: loadingStates[tableName] || false,
    };
  }, [allCompanyData, isDataFresh, dataFreshness, loadingStates]);

  // 🎯 Smart data getter - auto-refresh if stale
  const getSmartData = useCallback(async (tableName: string) => {
    if (!isDataFresh(tableName)) {
      console.log(`📊 Data for ${tableName} is stale, refreshing...`);
      await dispatch(refreshTableData([tableName]));
    }
    return (allCompanyData as any)[tableName];
  }, [isDataFresh, allCompanyData, dispatch]);

  return {
    // State
    selectedCompanyId,
    allCompanyData,
    isLoading,
    error,
    loadingStates,
    
    // Specific data
    companyUsers,
    departments,
    companyProcesses,
    companyDetails,
    companySettings,
    
    // Actions
    refreshAllData,
    refreshSpecificData,
    clearData,
    
    // Specific domain actions
    userActions,
    departmentActions,
    processActions,
    
    // Utilities
    isDataFresh,
    getDataWithFreshness,
    getSmartData,
    
    // Computed values
    hasSelectedCompany: !!selectedCompanyId,
    isCompanySelected: (companyId: number) => selectedCompanyId === companyId,
    hasData: Object.keys(allCompanyData).some(key => {
      const data = (allCompanyData as any)[key];
      return Array.isArray(data) ? data.length > 0 : data !== null;
    }),
    
    // Loading states for specific operations
    isAddingUser: loadingStates.addUser || false,
    isUpdatingUser: loadingStates.updateUser || false,
    isDeletingUser: loadingStates.deleteUser || false,
    
    // Data counts for quick reference
    userCount: companyUsers?.length || 0,
    departmentCount: departments?.length || 0,
    processCount: companyProcesses?.length || 0,
  };
};