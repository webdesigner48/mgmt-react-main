// components/PopupSidebar.tsx
import React from 'react';
import { FormSection } from '../types';
import { getSectionIcon } from '../utils/icons';

interface PopupSidebarProps {
  activeSection: FormSection;
  setActiveSection: (section: FormSection) => void;
}

export const PopupSidebar: React.FC<PopupSidebarProps> = ({ activeSection, setActiveSection }) => {
  const sections: { key: FormSection; label: string }[] = [
    { key: 'company', label: 'Informationen' },
    { key: 'design', label: 'Design' },
    { key: 'worktime', label: 'Arbeitszeit' },
    { key: 'departments', label: 'Abteilungen' },
    { key: 'processes', label: 'Prozesse' },
  ];

  return (
    <div className="popup-sidebar-nav">
      <ul className="popup-sidebar-nav__list">
        {sections.map(({ key, label }) => (
          <li
            key={key}
            className={activeSection === key ? 'active' : ''}
            onClick={() => setActiveSection(key)}
          >
            {getSectionIcon(key)}
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};