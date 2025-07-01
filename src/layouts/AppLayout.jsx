// layouts/AppLayout.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from "../components/context/authcontext";
import { useAppSelector } from '../store/hooks'; // Add this import for Redux
import './AppLayout.css';

// Components
import Sidebar from '../components/Basic/Sidebar/Sidebar';
import ToolBar from '../components/Basic/ToolBar/ToolBar';
import BackgroundFilter from '../components/Basic/BackgroundFilter/BackgroundFilter';
import LoginPage from '../components/Auth/LoginPage/LoginPage';

// Views
import ViewRouter from './ViewRouter';

// Panels
import SettingsPanel from '../components/Basic/SettingsPanel/SettingsPanel';
import TablePersonel from '../components/Tables/TablePersonel/main';
import ConfirmationPopup from '../components/Tables/TablePersonel/ConfirmationPopup';
import AddPersonelPopup from '../components/Tables/TablePersonel/AddPersonelPopup';
import CompanyDataPopup from '../components/Basic/ToolBar/AdminTools/CompanyDataPopup';

// Data
import { initialPersonelData } from '../data/initialPersonelData';

// Hooks
import { useAppNavigation } from '../hooks/useAppNavigation';
import { usePopupManager } from '../hooks/usePopupManager';

function AppLayout() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  
  // Get selected company from Redux store
  const selectedCompany = useAppSelector((state) => state.company.selectedCompany);
  
  // Navigation state
  const {
    activeView,
    previousView,
    isTransitioning,
    isSidebarExpanded,
    isSettingsPanelVisible,
    isTablePersonelVisible,
    handleNavigate,
    toggleSidebar,
    toggleSettingsPanel,
    toggleTablePersonel
  } = useAppNavigation();

  // Popup state
  const {
    popupState,
    showConfirmationPopup,
    hideConfirmationPopup,
    handleConfirm,
    showAddPersonelPopup,
    hideAddPersonelPopup,
    showCompanyDataPopup,
    hideCompanyDataPopup
  } = usePopupManager();

  // Personnel data state
  const [personelData, setPersonelData] = useState(initialPersonelData);

  // Loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Personnel handlers
  const handleAddPersonel = (newPersonel) => {
    setPersonelData(prevData => [
      ...prevData,
      { 
        ...newPersonel, 
        id: String(Date.now() + Math.random()),
        aktion: ''
      }
    ]);
    hideAddPersonelPopup();
  };

  const handleUpdatePersonelEntry = (rowIndex, columnKey, value) => {
    setPersonelData(prevData => 
      prevData.map((row, idx) => {
        if (idx === rowIndex) {
          return { ...row, [columnKey]: value };
        }
        return row;
      })
    );
  };

  const handleDeletePersonelEntry = (rowId) => {
    setPersonelData(prevData => prevData.filter(row => row.id !== rowId));
  };

  // Company Data handlers
  const handleToggleCompanyDataPopup = () => {
    // Check if a company is selected
    if (!selectedCompany || !selectedCompany.companyId) {
      alert('Bitte wählen Sie zuerst ein Unternehmen aus.');
      return;
    }
    
    console.log('Opening CompanyDataPopup with company:', selectedCompany);
    showCompanyDataPopup();
  };

  const handleAddCompanyData = (companyData) => {
    console.log('Adding new company:', companyData);
    // Implement your add logic here
    // This might involve:
    // 1. Making an API call to save the company
    // 2. Dispatching a Redux action to update the store
    // 3. Refreshing the company list
  };

  const handleUpdateCompanyData = (companyData) => {
    console.log('Updating company:', companyData);
    console.log('Company ID:', selectedCompany?.companyId);
    
    // Implement your update logic here
    // This might involve:
    // 1. Making an API call to update the company
    // 2. Dispatching a Redux action to update the store
    // 3. Refreshing the company data in the UI
    
    // Example:
    // dispatch(updateCompany({ id: selectedCompany.companyId, ...companyData }));
  };

  // Check if any popup is visible
  const isAnyPopupVisible = isSettingsPanelVisible || 
    isTablePersonelVisible || 
    popupState.isConfirmationPopupVisible || 
    popupState.isAddPersonelPopupVisible || 
    popupState.isCompanyDataPopupVisible;

  return (
    <div className="App">
      <Sidebar
        isExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        onSettingsClick={toggleSettingsPanel}
        onNavigate={handleNavigate}
        activeView={activeView}
        currentUser={user}
        onLogout={logout}
      />
      
      <ToolBar 
        onToggleTablePersonel={toggleTablePersonel} 
        onToggleCompanyDataPopup={handleToggleCompanyDataPopup}
        currentUser={user}
      />
      
      <div className={`main-content ${isSidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <ViewRouter 
          activeView={activeView}
          previousView={previousView}
          isTransitioning={isTransitioning}
        />
      </div>
      
      {/* Background Filter */}
      {isAnyPopupVisible && 
        <BackgroundFilter 
          isVisible={isAnyPopupVisible} 
          zIndex={popupState.backgroundFilterZIndex} 
        />
      }
      
      {/* Panels and Popups */}
      {isSettingsPanelVisible && (
        <SettingsPanel 
          onClose={toggleSettingsPanel} 
          currentUser={user} 
        />
      )}
      
      {isTablePersonelVisible && (
        <TablePersonel 
          isVisible={isTablePersonelVisible} 
          onClose={toggleTablePersonel} 
          personelData={personelData}
          showConfirmationPopup={showConfirmationPopup}
          showAddPersonelPopup={showAddPersonelPopup}
          onUpdatePersonelEntry={handleUpdatePersonelEntry}
          onDeletePersonelEntry={handleDeletePersonelEntry}
        />
      )}
      
      {popupState.isConfirmationPopupVisible && (
        <ConfirmationPopup 
          message={popupState.confirmationPopupMessage} 
          onConfirm={handleConfirm} 
          onCancel={hideConfirmationPopup} 
          isVisible={popupState.isConfirmationPopupVisible} 
        />
      )}
      
      {popupState.isAddPersonelPopupVisible && (
        <AddPersonelPopup
          isVisible={popupState.isAddPersonelPopupVisible}
          onClose={hideAddPersonelPopup}
          onAddPersonel={handleAddPersonel}
        />
      )}
      
      {/* Company Data Popup - Pass company ID and handlers */}
      {popupState.isCompanyDataPopupVisible && (
        <CompanyDataPopup
          isVisible={popupState.isCompanyDataPopupVisible}
          onClose={hideCompanyDataPopup}
          companyId={selectedCompany?.companyId} // Pass the company ID from Redux
          onAddCompanyData={handleAddCompanyData}
          onUpdateCompanyData={handleUpdateCompanyData}
        />
      )}
    </div>
  );
}

export default AppLayout;