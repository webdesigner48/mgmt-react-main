import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar/sidebar';
import PersonalSection from './sections/PersonalSection';
import TableSection from './sections/TableSection';
import './TablePersonel.css';

// PersonelRow interface should ideally be imported from a shared types definition
interface PersonelRow {
  id: string;
  vorname: string;
  nachname: string;
  kapazitaet: string;
  abteilung: string;
  email: string;
  rolle: string;
  aktion: string; 
}

interface MainProps {
  isVisible: boolean;
  onClose: () => void;
  personelData: PersonelRow[];
  showConfirmationPopup: (message: string, onConfirm: () => void) => void;
  showAddPersonelPopup: () => void;
  onUpdatePersonelEntry: (rowIndex: number, columnKey: keyof PersonelRow, value: string) => void;
  onDeletePersonelEntry: (rowId: string) => void;
}

type FormSection = 'personal' | 'table';

const Main: React.FC<MainProps> = ({
  isVisible,
  onClose,
  personelData,
  showConfirmationPopup,
  showAddPersonelPopup,
  onUpdatePersonelEntry,
  onDeletePersonelEntry
}) => {
  const [animationClass, setAnimationClass] = useState('');
  const [activeSection, setActiveSection] = useState<FormSection>('table');

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationClass('fade-in');
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setAnimationClass('');
    }
  }, [isVisible]);

  if (!isVisible && !animationClass) {
    return null;
  }

  return (
    <div className={`table-personel-container ${animationClass}`}>
      <div className="table-personel-container-with-sidebar">
        <div className="table-personel-content">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <div>
            <div className="table-personel-header">
              <h2>Personal Management</h2>
              <button onClick={onClose} className="table-personel-close-button" aria-label="Schließen">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                </svg>
              </button>
            </div>
            
            <div className="table-personel-form-with-sidebar">
              {activeSection === 'personal' && (
                <PersonalSection />
              )}
              {activeSection === 'table' && (
                <TableSection
                  personelData={personelData}
                  showConfirmationPopup={showConfirmationPopup}
                  showAddPersonelPopup={showAddPersonelPopup}
                  onUpdatePersonelEntry={onUpdatePersonelEntry}
                  onDeletePersonelEntry={onDeletePersonelEntry}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;