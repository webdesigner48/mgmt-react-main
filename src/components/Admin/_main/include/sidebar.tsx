import React from 'react';
import './../css/sidebar.css';
import { ViewType } from './../../main';

interface SidebarProps {
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onViewChange }) => {
  return (
    <div className="sidebar-admin">
      <ul className="sidebar-admin__list">
        <li onClick={() => onViewChange("Unternehmen")}>Unternehmen</li>
        <li onClick={() => onViewChange("Rangliste")}>Rangliste</li>
        <li onClick={() => onViewChange("Präsentation")}>Präsentation</li>
        <li onClick={() => onViewChange("Backoffice")}>Backoffice</li>
      </ul>
    </div>
  );
};

export default Sidebar;
