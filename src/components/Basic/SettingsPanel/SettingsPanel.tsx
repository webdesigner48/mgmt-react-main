import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext'; 
import './SettingsPanel.css';
import { ReactComponent as SunIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Sun.svg';
import { ReactComponent as MoonIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Moon.svg';
import { ReactComponent as GlassIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Glass.svg';
import { ReactComponent as DetailIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Detail.svg';
import { ReactComponent as SimpleIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Simple.svg';
import { ReactComponent as OffIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Off.svg';
import { ReactComponent as PasswordIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Password.svg';
import { ReactComponent as LogoutIcon } from '../../../assets/icons/MenuIcons/SideBar/Settingspanel/Logout.svg';

interface SettingsPanelProps {
  onClose?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
  const [isDarkModeLocal, setIsDarkModeLocal] = useState(true);
  
  // Connect to ThemeContext but keep your existing state
  const { setTheme } = useTheme();
  const [activeTheme, setActiveTheme] = useState('dark');
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTooltipMode, setActiveTooltipMode] = useState('detail');
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [alias, setAlias] = useState('');

  // State for text and opacity to allow for transitions
  const [themeText, setThemeText] = useState('Dunkles Design');
  const [themeOpacity, setThemeOpacity] = useState(1);

  const [tooltipText, setTooltipText] = useState('Detaillierte Tooltips');
  const [tooltipOpacity, setTooltipOpacity] = useState(1);

  const [fullscreenText, setFullscreenText] = useState("Immer Vollbildmodus aus");
  const [fullscreenCountdown, setFullscreenCountdown] = useState<number | null>(null);
  const countdownIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const [soundText, setSoundText] = useState("Soundeffekte aus");
  const [soundOpacity, setSoundOpacity] = useState(1);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = document.fullscreenElement != null;
      setIsFullscreen(isFs);
      setFullscreenText(isFs ? "Immer Vollbildmodus an" : "Immer Vollbildmodus aus");
      // If user escapes, clear any running countdown
      if (!isFs && countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        setFullscreenCountdown(null);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      console.log('Close button clicked - onClose prop not provided.');
    }
  };

  const handleThemeChange = (theme: string) => {
    setThemeOpacity(0);
    setTimeout(() => {
      setActiveTheme(theme);
      
      // Update global theme via ThemeContext
      setTheme(theme as any);
      
      switch (theme) {
        case 'light':
          setThemeText('Helles Design');
          break;
        case 'glass':
          setThemeText('Glass Design');
          break;
        default:
          setThemeText('Dunkles Design');
      }
      setThemeOpacity(1);
    }, 200);
  };

  const handleTooltipModeChange = (mode: string) => {
    setTooltipOpacity(0);
    setTimeout(() => {
      setActiveTooltipMode(mode);
      switch (mode) {
        case 'simple':
          setTooltipText('Simple Tooltips');
          break;
        case 'off':
          setTooltipText('Keine Tooltips');
          break;
        default:
          setTooltipText('Detaillierte Tooltips');
      }
      setTooltipOpacity(1);
    }, 200);
  };

  const localToggleTheme = () => {
    setIsDarkModeLocal(!isDarkModeLocal);
    console.log(isDarkModeLocal ? "Switching to Light Mode (local)" : "Switching to Dark Mode (local)");
  };

  const toggleFullscreen = () => {
    if (countdownIntervalRef.current) return; // A countdown is already in progress

    const isEntering = !document.fullscreenElement;
    setIsFullscreen(isEntering); // Toggle switch immediately

    let countdown = 3;
    setFullscreenCountdown(countdown);

    countdownIntervalRef.current = setInterval(() => {
      countdown--;
      setFullscreenCountdown(countdown > 0 ? countdown : null);

      if (countdown <= 0) {
        if(countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;

        if (isEntering) {
          document.documentElement.requestFullscreen().catch(err => {
            alert(`Error: ${err.message}`);
            // Revert UI changes if request fails. The event listener will not fire.
            setIsFullscreen(false);
            setFullscreenText("Immer Vollbildmodus aus");
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    }, 1000);
  };

  const toggleSoundEffects = () => {
    setSoundOpacity(0);
    setTimeout(() => {
      setIsSoundEnabled(prevState => {
        const newState = !prevState;
        setSoundText(newState ? "Soundeffekte an" : "Soundeffekte aus");
        return newState;
      });
      setSoundOpacity(1);
    }, 200);
  };

  const handleAliasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(event.target.value);
  };

  return (
    <div className="settings-panel visible">
      <div className="settings-panel-header">
        <h2 className="settings-panel-title">Einstellungen</h2>
        <button 
          className="settings-panel-close-button" 
          onClick={handleClose} 
          aria-label="Einstellungen schließen"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>
      </div>
      <div className="settings-panel-content">
        <div className="settings-row theme-toggle-row">
          <div className="theme-info">
            <span className="theme-text" style={{ opacity: themeOpacity }}>
              {themeText}
            </span>
          </div>
          <div className="theme-options">
            <div className={`theme-option ${activeTheme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}>
              <SunIcon />
            </div>
            <div className={`theme-option ${activeTheme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}>
              <MoonIcon />
            </div>
            <div className={`theme-option ${activeTheme === 'glass' ? 'active' : ''}`} onClick={() => handleThemeChange('glass')}>
              <GlassIcon />
            </div>
          </div>
        </div>
        {/* Tooltip Toggle Row */}
        <div className="settings-row tooltip-toggle-row">
          <div className="theme-info">
            <span className="theme-text" style={{ opacity: tooltipOpacity }}>
              {tooltipText}
            </span>
          </div>
          <div className="theme-options">
            <div className={`theme-option ${activeTooltipMode === 'detail' ? 'active' : ''}`} onClick={() => handleTooltipModeChange('detail')}>
              {/* <DetailIcon /> */}
            </div>
            <div className={`theme-option ${activeTooltipMode === 'simple' ? 'active' : ''}`} onClick={() => handleTooltipModeChange('simple')}>
              <SimpleIcon />
            </div>
            <div className={`theme-option ${activeTooltipMode === 'off' ? 'active' : ''}`} onClick={() => handleTooltipModeChange('off')}>
              <OffIcon />
            </div>
          </div>
        </div>
        {/* Fullscreen Toggle Row */}
        <div className="settings-row fullscreen-toggle-row">
          <div className="fullscreen-info">
            {/* No icon needed here */}
            <span className="fullscreen-text">
              {fullscreenText}{' '}
              {fullscreenCountdown !== null && (
                <span className="fullscreen-countdown">
                  ({fullscreenCountdown})
                </span>
              )}
            </span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={isFullscreen} onChange={toggleFullscreen} />
            <span className="slider round"></span>
          </label>
        </div>
        {/* Sound Toggle Row */}
        <div className="settings-row sound-toggle-row">
          <div className="sound-info">
            <span className="sound-text" style={{ opacity: soundOpacity }}>
              {soundText}
            </span>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={isSoundEnabled} onChange={toggleSoundEffects} />
            <span className="slider round"></span>
          </label>
        </div>
        {/* Alias Input Row */}
        <div className="settings-row alias-row">
          <div className="alias-info">
            <span className="alias-text">Alias verwenden</span>
          </div>
          <div className="alias-input-container">
            <small className="char-counter">{String(alias.length).padStart(2, '0')} / 12</small>
            <input
              type="text"
              className="alias-input"
              placeholder="Alias eingeben..."
              maxLength={12}
              value={alias}
              onChange={handleAliasChange}
            />
          </div>
        </div>
        {/* Change Password Row */}
        <div className="settings-row password-row">
          <span className="password-text">Passwort ändern</span>
          <button className="password-button">
            <PasswordIcon />
          </button>
        </div>
        {/* Logout Row */}
        <div className="settings-row logout-row">
          <span className="logout-text">Logout</span>
          <button className="logout-button">
            <LogoutIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;