// components/DesignSection.tsx
import React from 'react';
import { isValidHexColor, getColorBoxContent, getColorBoxClass } from '../utils/helpers';

interface DesignSectionProps {
  logoPreview: string | null;
  logoActive: boolean;
  setLogoPreview: (preview: string | null) => void;
  setLogoActive: (active: boolean) => void;
  handleLogoDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleLogoClick: () => void;
  handleLogoInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  colorStates: any;
  fontStates: any;
}

export const DesignSection: React.FC<DesignSectionProps> = ({
  logoPreview,
  logoActive,
  setLogoPreview,
  setLogoActive,
  handleLogoDrop,
  handleLogoClick,
  handleLogoInput,
  colorStates,
  fontStates,
}) => {
  return (
    <div className="popup-form-section design-section">
      <div className="design-logo-row">
        <div
          className={`design-logo-dropzone${logoActive ? ' active' : ''}`}
          onClick={logoActive ? () => { setLogoPreview(null); setLogoActive(false); } : handleLogoClick}
          onDrop={handleLogoDrop}
          onDragOver={e => e.preventDefault()}
          tabIndex={0}
          style={{ outline: 'none' }}
        >
          <input
            id="logo-upload-input"
            type="file"
            accept="image/svg+xml"
            style={{ display: 'none' }}
            onChange={handleLogoInput}
          />
          {logoPreview ? (
            <img src={logoPreview} alt="Logo Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <div className="design-logo-placeholder">
              <svg width="40" height="40" fill="#aeb8c2" viewBox="0 0 24 24">
                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zm-2 0H5V5h14zm-7-3l2.03 2.71a1 1 0 0 0 1.58 0L19 14l-3.5-4.5-2.5 3.01L9.5 11l-4.5 6h14z" />
              </svg>
            </div>
          )}
          {!logoActive && (
            <span className="design-logo-hovericon">
              <svg width="45" height="35" fill="#2d2d2d" viewBox="0 0 24 24">
                <path d="M12 16V4m0 0l-5 5m5-5l5 5" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <rect x="6" y="18" width="12" height="2" rx="1" fill="#2d2d2d" />
              </svg>
            </span>
          )}
          {logoActive && (
            <span className="design-logo-deleteicon">
              <svg width="37" height="37" fill="#2d2d2d" viewBox="0 0 24 24">
                <path d="M3 6h18" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round"/>
                <rect x="5" y="6" width="14" height="14" rx="2" fill="none" stroke="#2d2d2d" strokeWidth="2"/>
                <path d="M10 11v4" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round"/>
                <path d="M14 11v4" stroke="#2d2d2d" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          )}
        </div>
        <div className="design-logo-text" style={{ fontSize: '50px', display: 'flex', alignItems: 'center', minHeight: 150, textAlign: 'right' }}>
          {logoActive ? 'Logo vorhanden' : 'Logo einfügen'}
        </div>
      </div>

      <div className="section-label">Design der Schrift</div>
      <hr className="divider-row" />
      <div className="design-font-row">
        <div className="design-font-inputs">
          <input
            type="text"
            className="design-font-input"
            placeholder="Hintergrundfarbe"
            value={fontStates.fontWhite}
            onChange={e => fontStates.setFontWhite(e.target.value)}
          />
          <input
            type="text"
            className="design-font-input"
            placeholder="Textfarbe"
            value={fontStates.fontBlack}
            onChange={e => fontStates.setFontBlack(e.target.value)}
          />
          <select
            className="design-font-dropdown"
            value={fontStates.fontHeadline}
            onChange={e => fontStates.setFontHeadline(e.target.value)}
          >
            <option value="" disabled>Schriftart Überschriften</option>
            <option value="Calibri">Calibri</option>
            <option value="Calibri Light">Calibri Light</option>
            <option value="Arial">Arial</option>
            <option value="Arial Narrow">Arial Narrow</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Segoe UI">Segoe UI</option>
          </select>
          <select
            className="design-font-dropdown"
            value={fontStates.fontText}
            onChange={e => fontStates.setFontText(e.target.value)}
          >
            <option value="" disabled>Schriftart Text</option>
            <option value="Calibri">Calibri</option>
            <option value="Calibri Light">Calibri Light</option>
            <option value="Arial">Arial</option>
            <option value="Arial Narrow">Arial Narrow</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Segoe UI">Segoe UI</option>
          </select>
        </div>
        <div
          className="design-font-preview"
          style={{
            width: '50%',
            minHeight: '120px',
            
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '10px 14px',
            borderRadius: '7px',
            boxSizing: 'border-box',
            marginLeft: '14px',
          }}
        >
          <div
            style={{
              fontFamily: fontStates.fontHeadline || 'Calibri',
              fontSize: '1.35em',
              fontWeight: 600,
              marginBottom: '18px',
              width: '100%',
              textAlign: 'left',
            }}
          >
            Dies ist eine Überschrift
          </div>
          <div
            style={{
              fontFamily: fontStates.fontText || 'Calibri',
              fontSize: '1.08em',
              fontWeight: 400,
              marginTop: '2px',
            }}
          >
            Mit diesem Text testen wir das Design der Schrift unseres Unternehmens. So geben wir etwas von unserer Identität ins System und können davon profitieren.
          </div>
        </div>
      </div>

      <div className="section-label">Farbpalette</div>
      <hr className="divider-row" />
      
      {/* Color rows */}
      {[
        { main: 'Blue', light: 'LightBlue', type: 'blue' },
        { main: 'Green', light: 'LightGreen', type: 'green' },
        { main: 'Yellow', light: 'LightYellow', type: 'yellow' },
        { main: 'Orange', light: 'LightOrange', type: 'orange' },
        { main: 'Red', light: 'LightRed', type: 'red' },
      ].map(({ main, light, type }) => (
        <div key={main} className="design-color-row">
          <div className="design-color-half">
            <input
              type="text"
              className={`design-color-input${isValidHexColor(colorStates[`color${main}`]) ? ' color-valid' : ''}`}
              placeholder={`Farbcode ${main === 'Blue' ? 'Blau' : main === 'Green' ? 'Grün' : main === 'Yellow' ? 'Gelb' : main === 'Red' ? 'Rot' : 'Orange'}`}
              value={colorStates[`color${main}`]}
              onChange={e => colorStates[`setColor${main}`](e.target.value)}
            />
            <div
              className={getColorBoxClass(colorStates[`color${main}`])}
              style={isValidHexColor(colorStates[`color${main}`]) ? { background: colorStates[`color${main}`], borderColor: colorStates[`color${main}`] } : {}}
            >
              {getColorBoxContent(colorStates[`color${main}`], type as any)}
            </div>
          </div>
          <div className="design-color-half">
            <input
              type="text"
              className={`design-color-input${isValidHexColor(colorStates[`color${light}`]) ? ' color-valid' : ''}`}
              placeholder={`Farbcode Hell${main === 'Blue' ? 'blau' : main === 'Green' ? 'grün' : main === 'Yellow' ? 'gelb' : main === 'Red' ? 'rot' : 'orange'}`}
              value={colorStates[`color${light}`]}
              onChange={e => colorStates[`setColor${light}`](e.target.value)}
            />
            <div
              className={getColorBoxClass(colorStates[`color${light}`])}
              style={isValidHexColor(colorStates[`color${light}`]) ? { background: colorStates[`color${light}`], borderColor: colorStates[`color${light}`] } : {}}
            >
              {getColorBoxContent(colorStates[`color${light}`], `light${type}` as any)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};