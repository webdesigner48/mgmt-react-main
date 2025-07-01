// CompanyDataPopup.tsx - Complete Component
import React, { useState, useEffect } from 'react';
import './CompanyDataPopup.css';
import { useCompanyData } from './hooks/useCompanyData';
import { PopupSidebar } from './components/PopupSidebar';
import { CompanySection } from './components/CompanySection';
import { DesignSection } from './components/DesignSection';
import { WorktimeSection } from './components/WorktimeSection';
import { DepartmentsSection } from './components/DepartmentsSection';
import { ProcessesSection } from './components/ProcessesSection';
import SubprocessSection from './components/SubprocessSection';
import { CompanyDataFormData, FormSection } from './types';
import companyDataHandler from '../../../../server/companyDataHandler';

interface CompanyDataPopupProps {
  isVisible: boolean;
  onClose: () => void;
  companyId?: string | number;
  onAddCompanyData?: (companyData: Omit<CompanyDataRow, 'id' | 'aktion'>) => void;
  onUpdateCompanyData?: (companyData: CompanyDataFormData) => void;
}

interface CompanyDataRow extends Omit<CompanyDataFormData, 'dailyWorkingTime' | 'dailyBreakTime' | 'country'> {
  id: string;
  country: string;
  dailyWorkingTimeHours?: number;
  dailyBreakTimeMinutes?: number;
  aktion: string;
}

const CompanyDataPopup: React.FC<CompanyDataPopupProps> = ({
  isVisible,
  onClose,
  companyId,
  onAddCompanyData,
  onUpdateCompanyData
}) => {
  const [isMounted, setIsMounted] = useState(isVisible);
  const [animationClassName, setAnimationClassName] = useState('');
  const [activeSection, setActiveSection] = useState<FormSection>('company');
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    formData,
    setFormData,
    logoPreview,
    setLogoPreview,
    logoActive,
    setLogoActive,
    colorStates,
    fontStates,
    departmentStates,
    workTimeData,
    handleChange,
    handleLogoFile,
    resetForm
  } = useCompanyData();

  // Fetch company data when component mounts and companyId is provided
  useEffect(() => {
    console.log('useEffect triggered - isVisible:', isVisible, 'companyId:', companyId);

    if (isVisible && companyId) {
      console.log('Conditions met, calling fetchCompanyData...');
      fetchCompanyData();
    } else {
      if (isVisible && !companyId) {
        console.log('No companyId provided - Create mode');
        setIsEditMode(false);
      }
    }
  }, [isVisible, companyId]);

  const fetchCompanyData = async () => {
    if (!companyId) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', companyId.toString());

      const response = await fetch(`${companyDataHandler.BASE_URL}${companyDataHandler.API_ENDPOINTS.companyById}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      const result = await response.json();
      console.log(result);
      if (result.status === 'success' && result.data) {
        const company = result.data;
        setIsEditMode(true);

        // Populate form data with all fields
        setFormData({
          companyName: company.name || '',
          street: company.street || '',
          houseNumber: company.house_number || '',
          postalCode: company.postal_code || '',
          province: company.province || '',
          region: company.region || '',
          country: company.country || '',
          taxid: company.tax_id || '',
          industry: company.industry || '',
          businessField: company.field || '',
          earliestStartTime: company.earliest_start_time || '',
          latestEndTime: company.latest_end_time || '',
          dailyWorkingTime: company.arbeitsstunden ? company.arbeitsstunden.toString() : '',
          dailyBreakTime: company.daily_break_time ? company.daily_break_time.toString() : ''
        });

        // If you have logo data, set it here
        if (company.logo_url) {
          setLogoPreview(company.logo_url);
          setLogoActive(true);
        }

        console.log('Company data loaded:', company);
      } else {
        console.error('Failed to fetch company:', result.message);
        alert('Fehler beim Laden der Firmendaten: ' + (result.message || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      alert('Netzwerkfehler beim Laden der Firmendaten');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      const timer = setTimeout(() => {
        setAnimationClassName('fade-in');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationClassName('fade-out');
      const timer = setTimeout(() => {
        setIsMounted(false);
        resetForm();
        setActiveSection('company');
        setSelectedProcess(null);
        setIsEditMode(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, resetForm]);

  useEffect(() => {
    if (activeSection !== 'processes') {
      setSelectedProcess(null);
    }
  }, [activeSection]);

  // In CompanyDataPopup.tsx, update the handleSubmit function without validation:

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditMode && companyId) {
      // Update existing company - general info only
      try {
        setIsLoading(true);
        console.log('Starting update for company ID:', companyId);

        // First, ensure the company session is set
        const sessionFormData = new FormData();
        sessionFormData.append('company_id', companyId.toString());

        try {
          const sessionResponse = await fetch(`${companyDataHandler.BASE_URL}/admin/adminHandler.php?action=setCompanySession`, {
            method: 'POST',
            body: sessionFormData,
            credentials: 'include'
          });

          const sessionResult = await sessionResponse.json();
          console.log('Session set result:', sessionResult);
        } catch (sessionError) {
          console.warn('Could not set session explicitly, continuing anyway...', sessionError);
        }

        // Prepare update data - only company general info
        const updateData = new FormData();
        updateData.append('Name', formData.companyName);
        updateData.append('Street', formData.street);
        updateData.append('HouseNumber', formData.houseNumber);
        updateData.append('PostalCode', formData.postalCode);
        updateData.append('Province', formData.province);
        updateData.append('Region', formData.region || '');
        updateData.append('Land', formData.country);
        updateData.append('TaxId', formData.taxid || '');
        updateData.append('Branche', formData.industry);
        updateData.append('Geschaeftsfeld', formData.businessField);

        console.log('Sending update request...');
        const response = await fetch(`${companyDataHandler.BASE_URL}/admin/adminHandler.php?action=saveGeneralInfo`, {
          method: 'POST',
          body: updateData,
          credentials: 'include'
        });

        const result = await response.json();
        console.log('Update result:', result);

        if (result.status === 'success') {
          // alert('Firmendaten erfolgreich aktualisiert!');
          if (onUpdateCompanyData) {
            onUpdateCompanyData(formData);
          }
          // onClose();
        } else {
          alert(result.message || 'Fehler beim Aktualisieren der Daten');
        }
      } catch (error) {
        console.error('Error updating company:', error);
        alert('Fehler beim Aktualisieren der Firmendaten');
      } finally {
        setIsLoading(false);
      }
    } else if (onAddCompanyData) {
      // Add new company (existing logic)
      const dataToSubmit: Omit<CompanyDataRow, 'id' | 'aktion'> = {
        companyName: formData.companyName,
        street: formData.street,
        houseNumber: formData.houseNumber,
        postalCode: formData.postalCode,
        province: formData.province,
        country: formData.country,
        industry: formData.industry,
        businessField: formData.businessField,
      };

      onAddCompanyData(dataToSubmit);
      onClose();
    }
  };

  const handleLogoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleLogoFile(e.target.files[0]);
    }
  };

  const handleLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleLogoFile(e.dataTransfer.files[0]);
    }
  };

  const handleLogoClick = () => {
    document.getElementById('logo-upload-input')?.click();
  };

  const handleProcessClick = (processName: string) => {
    setSelectedProcess(processName);
  };

  const handleSubprocessClose = () => {
    setSelectedProcess(null);
  };

  if (!isMounted && !animationClassName.includes('fade-out')) {
    return null;
  }
  if (!isMounted && animationClassName === '' && !isVisible) {
    return null;
  }

  return (
    <div className={`company-data-popup-overlay ${animationClassName}`}>
      <div className="company-data-popup-container-with-sidebar">
        <div className="company-data-popup-content">
          <PopupSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

          <div>
            <div className="company-data-popup-header">
              <h2>{isEditMode ? 'Unternehmen bearbeiten' : 'Unternehmen'}</h2>
              <div className="header-buttons">
                {activeSection === 'processes' && selectedProcess && (
                  <button onClick={handleSubprocessClose} className="company-data-back-button" aria-label="Zurück">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                  </button>
                )}
                {activeSection === 'departments' && (
                  <button className="company-data-add-button" aria-label="Abteilung hinzufügen" type="button" style={{ marginRight: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="11" y="4" width="2" height="16" rx="1" />
                      <rect x="4" y="11" width="16" height="2" rx="1" />
                    </svg>
                  </button>
                )}
                <button onClick={onClose} className="company-data-close-button" aria-label="Schließen">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
                fontSize: '18px',
                color: '#666'
              }}>
                <p>Lade Firmendaten...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="company-data-popup-form-with-sidebar">
                {activeSection === 'company' && (
                  <CompanySection
                    formData={formData}
                    handleChange={handleChange}
                    isEditMode={isEditMode}
                    isLoading={isLoading}
                  />
                )}
                {activeSection === 'design' && (
                  <DesignSection
                    logoPreview={logoPreview}
                    logoActive={logoActive}
                    setLogoPreview={setLogoPreview}
                    setLogoActive={setLogoActive}
                    handleLogoDrop={handleLogoDrop}
                    handleLogoClick={handleLogoClick}
                    handleLogoInput={handleLogoInput}
                    colorStates={colorStates}
                    fontStates={fontStates}
                  />
                )}
                {activeSection === 'worktime' && (
                  <WorktimeSection
                    formData={formData}
                    handleChange={handleChange}
                    workTimeData={workTimeData}
                  />
                )}
                {activeSection === 'departments' && (
                  <DepartmentsSection
                    formData={formData}
                    setFormData={setFormData}
                    departmentStates={departmentStates}
                    colorStates={colorStates}
                  />
                )}
                {activeSection === 'processes' && !selectedProcess && (
                  <ProcessesSection onProcessClick={handleProcessClick} />
                )}
                {activeSection === 'processes' && selectedProcess && (
                  <SubprocessSection
                    title={selectedProcess}
                  />
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDataPopup;