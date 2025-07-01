import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector } from './../../../store/hooks';
import { useAuth } from "./../../context/authcontext";
import './Sidebar.css';

interface SidebarProps {
  isExpanded: boolean;
  toggleSidebar: () => void;
  activeView?: string;
  onNavigate?: (viewName: string) => void;
  onSettingsClick?: () => void;
  userFirstName?: string; // Add user's first name as prop
}

const Sidebar: React.FC<SidebarProps> = ({
  isExpanded,
  toggleSidebar,
  activeView,
  onNavigate,
  onSettingsClick,
  userFirstName = 'Chris' // Default fallback
}) => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Get selected company from Redux store
  const selectedCompany = useAppSelector((state) => state.company.selectedCompany);

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLowerPartMouseEnter = () => {
    if (!isExpanded) {
      setIsSidebarHovered(true);
    }
  };

  const handleTopPartMouseEnter = () => {
    // Placeholder if logic is needed here in the future
  };

  const handleSidebarMouseLeave = () => {
    setIsSidebarHovered(false);
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    }
    setIsSidebarHovered(false);
  };

  // Format date and time
  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    const formatted = date.toLocaleString('de-DE', options);
    return formatted.split(', ');
  };

  const [dateStr, timeStr] = formatDateTime(currentDateTime);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Helper function to get display values
  const getCompanyDisplayInfo = () => {
    if (selectedCompany) {
      return {
        companyName: selectedCompany.companyName || 'Kein Unternehmen',
        departmentName: selectedCompany.departmentName || 'Keine Abteilung',
        userName: userFirstName
      };
    }

    // Fallback when no company is selected
    return {
      companyName: 'Kein Unternehmen ausgewählt',
      departmentName: 'Keine Abteilung',
      userName: userFirstName
    };
  };

  const { companyName, departmentName, userName } = getCompanyDisplayInfo();

  // Truncate text if too long for display
  const truncateText = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const burgerIconSVG = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ececec" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" />
    </svg>
  );

  const chatIconSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
    </svg>
  );

  const companyIconSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
    </svg>
  );

  const productIconSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
      <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );

  const gearIconSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22px" height="22px">
      <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.25 C14.34,2.09,14.17,2,14,2h-4c-0.17,0-0.34,0.09-0.39,0.25l-0.58,2.63c-0.59,0.24-1.13,0.57-1.62,0.94l-2.39-0.96 c-0.22-0.08-0.47,0-0.59,0.22L2.84,8.41c-0.12,0.2-0.07,0.47,0.12,0.61l2.03,1.58C4.92,11.36,4.9,11.68,4.9,12 c0,0.32,0.02,0.64,0.07,0.94l-2.03,1.58c-0.18-0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22 l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.58,2.63C9.66,21.91,9.83,22,10,22h4c0.17,0,0.34-0.09,0.39-0.25l0.58-2.63 c0.59-0.24,1.13-0.57,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.2-0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
    </svg>
  );

  // Icon to indicate if company is selected
  const companyStatusIcon = selectedCompany ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" width="12px" height="12px" style={{ marginLeft: '4px' }}>
      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ff9800" width="12px" height="12px" style={{ marginLeft: '4px' }}>
      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A2,2 0 0,0 10,9A2,2 0 0,0 12,11A2,2 0 0,0 14,9A2,2 0 0,0 12,7M12,14C10,14 8,15 8,17V18H16V17C16,15 14,14 12,14Z" />
    </svg>
  );

  const tooltipText = isExpanded ? "Klicken zum einklappen" : "Menü ausklappen";

  const sidebarClasses = `sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isSidebarHovered && !isExpanded ? 'hovered' : ''}`;
  const currentSidebarWidth = (isExpanded || (isSidebarHovered && !isExpanded)) ? '225px' : '64px';

  const { user } = useAuth();
  const secondLineText = user?.isAdmin ? 'Support' : departmentName;
  return (
    <>
      <div
        ref={sidebarRef}
        className={sidebarClasses}
        onMouseLeave={handleSidebarMouseLeave}
        style={{ width: currentSidebarWidth }}
      >
        <div className="sidebar-top-fixed-area"
          onMouseEnter={handleTopPartMouseEnter}
        >
          <div className="burger-menu-wrapper">
            <button
              className={`burger-menu-button ${isExpanded ? 'expanded' : ''}`}
              onClick={toggleSidebar}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-expanded={isExpanded}
              aria-label={tooltipText}
            >
              {burgerIconSVG}
            </button>
            <div className={`burger-hover-tooltip ${showTooltip ? 'visible' : ''}`}>
              <div className="tooltip-text-container">{tooltipText}</div>
            </div>
          </div>
        </div>

        <div className="sidebar-lower-interactive-area" onMouseEnter={handleLowerPartMouseEnter}>
          <div className="sidebar-scrollable-content">
            <div className="sidebar-content">
              <button
                className={`sidebar-item ${activeView === 'mainChat' ? 'active' : ''}`}
                aria-label="Chat"
                onClick={() => onNavigate && onNavigate('mainChat')}
              >
                {chatIconSVG}
                <span className="sidebar-item-text">Chat</span>
              </button>
              <button
                className={`sidebar-item ${activeView === 'unternehmenView' ? 'active' : ''}`}
                aria-label="Unternehmen"
                onClick={() => onNavigate && onNavigate('unternehmenView')}
              >
                {companyIconSVG}
                <span className="sidebar-item-text">Unternehmen</span>
              </button>
              <button
                className={`sidebar-item ${activeView === 'produkteView' ? 'active' : ''}`}
                aria-label="Produkte"
                onClick={() => onNavigate && onNavigate('produkteView')}
              >
                {productIconSVG}
                <span className="sidebar-item-text">Produkte</span>
              </button>
            </div>
          </div>

          <div className="sidebar-settings-area">
            <button className="settings-item" aria-label="Einstellungen" onClick={handleSettingsClick}>
              {gearIconSVG}
              <span className="settings-text">Einstellungen</span>
            </button>

            {/* Enhanced company info with Redux data */}
            <div className="company-info">
              <div className="company-info-line-with-icon">
                <p className="company-info-line" title={companyName}>
                  {truncateText(companyName, 30)}
                </p>

              </div>
              <p className="company-info-line" title={secondLineText}>
                {truncateText(secondLineText, 18)}
              </p>
              <p className="company-info-line user-name" title={userName}>
                {truncateText(userName, 18)}
              </p>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;