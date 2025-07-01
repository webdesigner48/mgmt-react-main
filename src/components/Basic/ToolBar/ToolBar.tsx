import React, { useState, useRef, useEffect } from 'react';
import './ToolBar.css';
import DropTool from './BasicTools/DropTool/DropTool';
import TrainingsTool from './BasicTools/TrainingsTool/TrainingsTool';
import ToDosTool from './BasicTools/ToDosTool/ToDosTool';
import HolidaysTool from './BasicTools/HolidaysTool/HolidaysTool';
import TeamTool from './TeamTools/TeamTool/TeamTool';
import KnowHubTool from './TeamTools/KnowHubTool/KnowHubTool';
import KnowHubToolMenu from './TeamTools/KnowHubTool/KnowHubToolMenu';
import AdminHome from '../../Admin/main';
import BackgroundFilter from '../BackgroundFilter/BackgroundFilter';
import { ReactComponent as KnowledgeIcon } from '../../../assets/icons/MenuIcons/ToolBar/Personal/Knowledge.svg';
import { ReactComponent as DropIcon } from '../../../assets/icons/MenuIcons/ToolBar/Personal/Drop.svg';
import { ReactComponent as ToDoIcon } from '../../../assets/icons/MenuIcons/ToolBar/Personal/ToDo.svg';
import { ReactComponent as HolidayIcon } from '../../../assets/icons/MenuIcons/ToolBar/Personal/Holiday.svg';
import { ReactComponent as TeamIcon } from '../../../assets/icons/MenuIcons/ToolBar/Department/Team.svg';
import { ReactComponent as KnowHubIcon } from '../../../assets/icons/MenuIcons/ToolBar/Department/KnowHub.svg';
import { ReactComponent as TasksIcon } from '../../../assets/icons/MenuIcons/ToolBar/Department/Tasks.svg';
import { ReactComponent as DatasMainIcon } from '../../../assets/icons/MenuIcons/ToolBar/Company/Datas-Main.svg';
import { ReactComponent as HRMainIcon } from '../../../assets/icons/MenuIcons/ToolBar/Company/HR-Main.svg';
import { ReactComponent as AdminHomeIcon } from '../../../assets/icons/MenuIcons/ToolBar/Admin/AdminHome.svg';
import { ReactComponent as AdminSwitchIcon } from '../../../assets/icons/MenuIcons/ToolBar/Admin/AdminSwitch.svg';

interface ToolBarProps {
  onToggleTablePersonel: () => void;
  onToggleCompanyDataPopup: () => void;
  currentUser?: {
    email: string;
    role: string;
    status: number;
    isAdmin?: boolean;
    department?: string;
    [key: string]: any;
  } | null;
}

const ToolBar: React.FC<ToolBarProps> = ({ 
  onToggleTablePersonel, 
  onToggleCompanyDataPopup,
  currentUser 
}) => {
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenTooltipText, setFullscreenTooltipText] = useState("Maximieren");

  const [isDropToolVisible, setIsDropToolVisible] = useState(false);
  const [isTrainingsToolVisible, setIsTrainingsToolVisible] = useState(false);
  const [isToDosToolVisible, setIsToDosToolVisible] = useState(false);
  const [isHolidaysToolVisible, setIsHolidaysToolVisible] = useState(false);
  const [isTeamToolVisible, setIsTeamToolVisible] = useState(false);
  const [isKnowHubToolVisible, setIsKnowHubToolVisible] = useState(false);
  const [isKnowHubToolMenuVisible, setIsKnowHubToolMenuVisible] = useState(false);
  const [isBackgroundActive, setIsBackgroundActive] = useState(false);
 
  const [isAdminHomeVisible, setIsAdminHomeVisible] = useState(false);

  // Check if user is admin
  const isAdmin = currentUser?.isAdmin || 
                  currentUser?.status === 1 || 
                  currentUser?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement != null;
      setIsFullscreen(isCurrentlyFullscreen);
      setFullscreenTooltipText(isCurrentlyFullscreen ? "Minimieren" : "Maximieren");
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleToolbar = () => {
    setIsToolbarExpanded(!isToolbarExpanded);
  };

  const toggleDropTool = () => {
    setIsDropToolVisible(!isDropToolVisible);
  };

  const toggleKnowHubTool = () => {
    setIsKnowHubToolVisible(!isKnowHubToolVisible);
    setIsKnowHubToolMenuVisible(!isKnowHubToolMenuVisible); // Toggle menu visibility
  };

  const handleKnowHubMenuItemClick = () => {
    setIsBackgroundActive(true);
  };

  const handleMenuBackgroundClose = () => {
    if (isBackgroundActive) {
      setIsBackgroundActive(false);
    } else {
      setIsKnowHubToolMenuVisible(false);
    }
  };

  const closeKnowHubMenu = () => {
    setIsKnowHubToolMenuVisible(false);
    setIsBackgroundActive(false);
  };

  const toggleToDosTool = () => {
    setIsToDosToolVisible(!isToDosToolVisible);
  };

  const toggleTrainingsTool = () => {
    setIsTrainingsToolVisible(!isTrainingsToolVisible);
  };

  const toggleHolidaysTool = () => {
    setIsHolidaysToolVisible(!isHolidaysToolVisible);
  };

  const toggleTeamTool = () => {
    setIsTeamToolVisible(!isTeamToolVisible);
  };

  const toggleAdminHome = () => {
    if (isAdmin) {
      setIsAdminHomeVisible(!isAdminHomeVisible);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
        .catch(err => console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const gridTooltipText = isToolbarExpanded ? "Toolbar einklappen" : "Toolbar ausklappen";

  // SVG Icons
  const gridIconSVG = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ececec" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z"/>
    </svg>
  );

  const enterFullscreenSVG = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
  );

  const exitFullscreenSVG = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
    </svg>
  );

  return (
    <>
      <div
        ref={toolbarRef}
        className={`toolbar ${isToolbarExpanded ? 'expanded' : ''}`}
      >
        <div className="toolbar-top-fixed-area">
          <div className="toolbar-controls-row">
            <div className="fullscreen-button-wrapper">
              <button
                className={`fullscreen-button ${isFullscreen ? 'active' : ''}`}
                onClick={handleToggleFullscreen}
                aria-label={fullscreenTooltipText}
              >
                {isFullscreen ? exitFullscreenSVG : enterFullscreenSVG}
              </button>
              <div className="fullscreen-button-tooltip">
                <div className="tooltip-text-container">{fullscreenTooltipText}</div>
              </div>
            </div>

            <div className="grid-icon-wrapper">
              <button
                className={`grid-icon-button ${isToolbarExpanded ? 'expanded' : ''}`}
                onClick={toggleToolbar}
                aria-expanded={isToolbarExpanded}
                aria-label={gridTooltipText}
              >
                {gridIconSVG}
              </button>
              <div className="grid-hover-tooltip">
                <div className="tooltip-text-container">{gridTooltipText}</div>
              </div>
            </div>
          </div>

        <h2 className="toolbar-section-heading">Persönlich</h2>
          <div className="toolbar-decorative-rectangle">
            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Abteilung"
                  onClick={toggleDropTool}
                >
                  <DropIcon />
                  <span className="toolbar-action-button-text">Drops</span>
                </button>
                <div className="toolbar-action-tooltip">Eigene Drops öffnen</div>
              </div>
            </div>
            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Abteilung"
                  onClick={toggleTrainingsTool}
                >
                  <KnowledgeIcon />
                  <span className="toolbar-action-button-text">Training</span>
                </button>
                <div className="toolbar-action-tooltip">Eigene Trainings öffnen</div>
              </div>
            </div>
            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Abteilung"
                  onClick={toggleToDosTool}
                >
                  <ToDoIcon />
                  <span className="toolbar-action-button-text">ToDo's</span>
                </button>
                <div className="toolbar-action-tooltip">Eigene ToDo's öffnen</div>
              </div>
            </div>
            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Abteilung"
                  onClick={toggleHolidaysTool}
                >
                  <HolidayIcon />
                  <span className="toolbar-action-button-text">Urlaub</span>
                </button>
                <div className="toolbar-action-tooltip">Eigenen Urlaub öffnen</div>
              </div>
            </div>
          </div>

          <h2 className="toolbar-section-heading">Abteilung</h2>
          <div className="toolbar-decorative-rectangle">
            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Abteilung"
                  onClick={toggleTeamTool}
                >
                  <TeamIcon />
                  <span className="toolbar-action-button-text">Team</span>
                </button>
                <div className="toolbar-action-tooltip">Teambereich öffnen</div>
              </div>
            </div>

            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Abteilung"
                  onClick={toggleKnowHubTool}
                >
                  <KnowHubIcon />
                  <span className="toolbar-action-button-text">Know-hub</span>
                </button>
                <div className="toolbar-action-tooltip">Know-hub öffnen</div>
              </div>
            </div>

            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Abteilung"
                  onClick={toggleDropTool}
                >
                  <TasksIcon />
                  <span className="toolbar-action-button-text">Tasks</span>
                </button>
                <div className="toolbar-action-tooltip">Tasks öffnen</div>
              </div>
            </div>
          </div>

          <h2 className="toolbar-section-heading">Unternehmen</h2>
          <div className="toolbar-decorative-rectangle">
            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Daten"
                  onClick={onToggleCompanyDataPopup}
                >
                  <DatasMainIcon />
                  <span className="toolbar-action-button-text">Daten</span>
                </button>
                <div className="toolbar-action-tooltip">Datenbereich öffnen</div>
              </div>
                      
            </div>
            <div className="toolbar-actions-row">
              <div className="toolbar-action-item">
                <button
                  className="toolbar-action-button"
                  aria-label="Personal"
                  onClick={onToggleTablePersonel}
                >
                  <HRMainIcon />
                  <span className="toolbar-action-button-text">Personal</span>
                </button>
                <div className="toolbar-action-tooltip">Personalbereich öffnen</div>
              </div>
            </div>
          </div>

          {/* Conditionally render Admin section only for admin users */}
          {isAdmin && (
            <>
              <h2 className="toolbar-section-heading">
                Admin
                
              </h2>
              <div className="toolbar-decorative-rectangle">
                <div className="toolbar-actions-row">
                  <div className="toolbar-action-item">
                    <button
                      className="toolbar-action-button"
                      aria-label="Admin Home"
                      onClick={toggleAdminHome}
                    >
                      <AdminHomeIcon />
                      <span className="toolbar-action-button-text">Adminbrereich</span>
                    </button>
                    <div className="toolbar-action-tooltip">Zum Adminbereich wechseln</div>
                  </div>
                </div>
                <div className="toolbar-actions-row">
                  <div className="toolbar-action-item">
                    <button
                      className="toolbar-action-button"
                      aria-label="Abteilung wechseln"
                    >
                      <AdminSwitchIcon />
                      <span className="toolbar-action-button-text">Zugänge</span>
                    </button>
                    <div className="toolbar-action-tooltip">Zugänge wechseln</div>
                  </div>
                </div>
              </div>
            </>
          )}

          
        </div>
      </div>
      
      {/* Render all the popup components */}
      <DropTool isVisible={isDropToolVisible} onClose={toggleDropTool} />
      <KnowHubTool isVisible={isKnowHubToolVisible} onClose={toggleKnowHubTool} />
      <KnowHubToolMenu isVisible={isKnowHubToolMenuVisible} onClose={closeKnowHubMenu} onItemClick={handleKnowHubMenuItemClick} />
      <ToDosTool isVisible={isToDosToolVisible} onClose={toggleToDosTool} />
      <TrainingsTool isVisible={isTrainingsToolVisible} onClose={toggleTrainingsTool} />
      <HolidaysTool isVisible={isHolidaysToolVisible} onClose={toggleHolidaysTool} />
      <TeamTool isVisible={isTeamToolVisible} onClose={toggleTeamTool} />

      <BackgroundFilter isVisible={isKnowHubToolMenuVisible} isActive={isBackgroundActive} onClose={handleMenuBackgroundClose} />

      {/* Only render AdminHome if user is admin */}
      {isAdmin && (
        <AdminHome isVisible={isAdminHomeVisible} onClose={toggleAdminHome} />
      )}
    </>
  );
};

export default ToolBar;