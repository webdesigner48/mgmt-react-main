import React from 'react';

type FormSection = 'personal' | 'table';

interface SidebarProps {
  activeSection: FormSection;
  onSectionChange: (section: FormSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const getSectionIcon = (section: FormSection) => {
    switch (section) {
      case 'personal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 2.08 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
        );
      case 'table':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="popup-sidebar-nav">
      <ul className="popup-sidebar-nav__list">
        <li 
          className={activeSection === 'personal' ? 'active' : ''} 
          onClick={() => onSectionChange('personal')}
        >
          {getSectionIcon('personal')}
          <span>Personal</span>
        </li>
        <li
          className={activeSection === 'table' ? 'active' : ''}
          onClick={() => onSectionChange('table')}
        >
          {getSectionIcon('table')}
          <span>Tabelle</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;