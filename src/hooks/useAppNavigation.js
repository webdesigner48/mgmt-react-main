// hooks/useAppNavigation.js
import { useState } from 'react';

export const useAppNavigation = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeView, setActiveView] = useState('mainChat');
  const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false);
  const [previousView, setPreviousView] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTablePersonelVisible, setIsTablePersonelVisible] = useState(false);

  const handleNavigate = (view) => {
    if (activeView !== view && !isTransitioning) {
      setIsTransitioning(true);
      setPreviousView(activeView);

      setTimeout(() => {
        setActiveView(view);
        setPreviousView(null);
        setIsTransitioning(false);
      }, 400);
    }
    
    if (isSettingsPanelVisible) {
      setIsSettingsPanelVisible(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleSettingsPanel = () => {
    setIsSettingsPanelVisible(!isSettingsPanelVisible);
  };

  const toggleTablePersonel = () => {
    setIsTablePersonelVisible(!isTablePersonelVisible);
  };

  return {
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
  };
};