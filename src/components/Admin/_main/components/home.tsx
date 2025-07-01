import React, { useState, useEffect } from 'react';
import './../css/home.css';
import { ViewType } from './../../main';

import TopIcons from './../assets/TopIcons';
import ViewUnternehmen from './pages/Unternehmen/Unternehmen';
import ViewRangliste from './pages/lists/ViewRangliste';
import ViewPräsentation from './pages/Präsentation/ViewPräsentation';
import ViewBackoffice from './pages/Backoffice/ViewBackoffice';
import AddCompanyPopup from '../popup/AddCompanyPopup';
import ToastNotification from '../../../../alert/ToastNotification';
import { useToast } from "./../../../../alert/handler/useToast";

interface Company {
  id: string | number;
  name: string;
  rating: string | number;
  company_id: string | number;
  company_name: string;
  company_address: string;
  company_country: string;
  company_industry: string;
  company_field: string;
  company_rating: string | number;
  // NEW: Add department fields
  department_id?: string | number | null;
  department_name?: string | null;
}


interface AdminPanelProps {
  activeView: ViewType;
  data: Company[];
  onClose: () => void;
  onDataUpdate?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ activeView, data, onClose, onDataUpdate }) => {
  // CHANGED: Initialize with eyes closed (true means hidden)
  const [isGlobalEyeOff, setIsGlobalEyeOff] = useState(true);
  const [individualEyeStates, setIndividualEyeStates] = useState<{ [key: number]: boolean }>({});
  const [visibleView, setVisibleView] = useState<ViewType | null>(activeView);
  const [selectedCompanyData, setSelectedCompanyData] = useState<any>(null);
  const [showAddCompanyPopup, setShowAddCompanyPopup] = useState(false);
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  // Toast notifications
  const { toasts, removeToast, success, error, info } = useToast();

  const normalizedData = data.map(company => ({
    ...company,
    id: typeof company.id === 'string' ? parseInt(company.id) : company.id,
    rating: typeof company.rating === 'string' ? parseFloat(company.rating) : company.rating,
    company_id: typeof company.company_id === 'string' ? parseInt(company.company_id) : company.company_id,
    company_rating: typeof company.company_rating === 'string' ? parseFloat(company.company_rating) : company.company_rating,
    // NEW: Handle department fields
    department_id: company.department_id ? (typeof company.department_id === 'string' ? parseInt(company.department_id) : company.department_id) : null,
    department_name: company.department_name || null,
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleView(activeView);
    }, 200);
    return () => clearTimeout(timer);
  }, [activeView]);

  const handleGlobalEyeToggle = () => {
    setIsGlobalEyeOff((prev) => !prev);
    // CHANGED: Clear individual states when global is toggled
    setIndividualEyeStates({});
  };

  const handleIndividualEyeToggle = (companyId: number) => {
    setIndividualEyeStates(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  // CHANGED: Updated logic for individual eye states
  const isCompanyDataHidden = (companyId: number) => {
    // If global eye is off, all are hidden unless individual eye overrides it
    if (isGlobalEyeOff) {
      // Individual eye can show data even when global is off
      return !individualEyeStates[companyId];
    }
    // If global eye is on, individual eye can hide specific companies
    return individualEyeStates[companyId] || false;
  };

  const handleCompanySelect = async (companyData: any) => {
    setSelectedCompanyData(companyData);
    console.log('📊 Company selected in AdminPanel:', companyData);

    // Call backend to set company ID in session
    try {
      const formData = new FormData();
      formData.append('company_id', companyData.id || companyData.companyId);

      const response = await fetch(`https://i-mgmt-official.com/backend/admin/adminHandler.php?action=setCompanySession`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // Important for session handling
      });

      const result = await response.json();

      if (result.status === 'success') {
        console.log('✅ Company session set successfully on server:', result);
      } else {
        console.error('❌ Failed to set company session:', result.message);
      }
    } catch (error) {
      console.error('❌ Error setting company session:', error);
    }
  };

  const handleAddCompanyClick = () => {
    setShowAddCompanyPopup(true);
  };

  const handleAddCompanyClose = () => {
    setShowAddCompanyPopup(false);
    setIsAddingCompany(false);
  };

  const handleAddCompanySubmit = async (companyName: string, companyCountry: string) => {
    setIsAddingCompany(true);

    try {
      // Create FormData to send as $_POST
      const formData = new FormData();
      formData.append('name', companyName);
      formData.append('country', companyCountry);

      const response = await fetch('https://i-mgmt-official.com/backend/admin/adminHandler.php?action=add_company', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        console.log('✅ Company added successfully:', companyName);

        // Show success toast instead of alert
        success(
          'Unternehmen hinzugefügt!',
          `${companyName} wurde erfolgreich hinzugefügt.`,
          5000
        );

        // Close popup
        handleAddCompanyClose();

        // Refresh data
        if (onDataUpdate) {
          onDataUpdate();
        }
      } else {
        throw new Error(result.message || 'Fehler beim Hinzufügen des Unternehmens');
      }
    } catch (err) {
      console.error('❌ Add Company Error:', err);

      // Show error toast instead of alert
      error(
        'Fehler beim Hinzufügen',
        err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten.',
        6000
      );
    } finally {
      setIsAddingCompany(false);
    }
  };

  useEffect(() => {
    console.log('📊 AdminPanel received data:', normalizedData);
  }, [data]);

  return (
    <div className="admin-panel">
      <TopIcons
        activeView={activeView}
        isEyeIconClicked={isGlobalEyeOff}
        onEyeClick={handleGlobalEyeToggle}
        onClose={onClose}
        onAddCompany={handleAddCompanyClick}
      />

      <div className={`admin-panel-content ${visibleView === 'Unternehmen' ? 'fade-in' : 'fade-out'}`}>
        {visibleView === 'Unternehmen' && (
          <ViewUnternehmen
            isGlobalEyeOff={isGlobalEyeOff}
            individualEyeStates={individualEyeStates}
            onIndividualEyeClick={handleIndividualEyeToggle}
            isCompanyDataHidden={isCompanyDataHidden}
            data={normalizedData}
            onClose={onClose}
            onDataUpdate={onDataUpdate}
            onCompanySelect={handleCompanySelect}
          />
        )}
      </div>

      <div className={`admin-panel-content ${visibleView === 'Rangliste' ? 'fade-in' : 'fade-out'}`}>
        {visibleView === 'Rangliste' && (
          <ViewRangliste
            isEyeIconClicked={isGlobalEyeOff}
            onEyeClick={handleGlobalEyeToggle}
            data={normalizedData}
          />
        )}
      </div>

      <div className={`admin-panel-content ${visibleView === 'Präsentation' ? 'fade-in' : 'fade-out'}`}>
        {visibleView === 'Präsentation' && (
          <ViewPräsentation
            isEyeIconClicked={isGlobalEyeOff}
            onEyeClick={handleGlobalEyeToggle}
            data={normalizedData}
            onClose={onClose}
          />
        )}
      </div>

      <div className={`admin-panel-content ${visibleView === 'Backoffice' ? 'fade-in' : 'fade-out'}`}>
        {visibleView === 'Backoffice' && (
          <ViewBackoffice
            isEyeIconClicked={isGlobalEyeOff}
            onEyeClick={handleGlobalEyeToggle}
            data={normalizedData}
            onClose={onClose}
          />
        )}
      </div>

      {/* Add Company Popup */}
      <AddCompanyPopup
        isVisible={showAddCompanyPopup}
        onClose={handleAddCompanyClose}
        onSubmit={handleAddCompanySubmit}
        isLoading={isAddingCompany}
      />

      {/* Toast Notifications */}
      <ToastNotification toasts={toasts} onRemove={removeToast} />


    </div>
  );
};

export default AdminPanel;