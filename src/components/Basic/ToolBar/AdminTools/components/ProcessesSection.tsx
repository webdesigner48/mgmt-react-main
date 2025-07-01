// components/ProcessesSection.tsx
import React, { useState, useEffect } from 'react';
import { getProcessIcon } from '../utils/processIcons';

interface ProcessesSectionProps {
  onProcessClick: (processName: string) => void;
}

export const ProcessesSection: React.FC<ProcessesSectionProps> = ({ onProcessClick }) => {
  const [processesFadeIn, setProcessesFadeIn] = useState(false);

  useEffect(() => {
    setProcessesFadeIn(false);
    const timer = setTimeout(() => setProcessesFadeIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const managementNames = ["Leitung", "Finanzen", "Personal", "Kommunikation", "Konformität", "Datenschutz"];
  const leistungNames = ["Vertrieb", "Vorbereitung", "Beschaffung", "Realisierung", "Prüfung", "Lieferung"];
  const supportNames = ["Service", "Umwelt", "Arbeitsmittel", "Logistik", "Umgebung", "Sicherheit"];

  const handleProcessClick = (name: string) => {
    setProcessesFadeIn(false);
    setTimeout(() => onProcessClick(name), 300); // Wait for fade-out animation
  };

  return (
    <div className={`processes-fade-wrapper${processesFadeIn ? ' fade-in' : ''}`}>
      <div className="section-label">Management</div>
      <hr className="divider-row" />
      <div className="processes-rectangles-container">
        {managementNames.map((name, i) => (
          <div key={i} className="processes-rectangle" onClick={() => handleProcessClick(name)}>
            <div className="processes-rectangle-green">
              {getProcessIcon(name)}
            </div>
            <div className="processes-rectangle-red">{name}</div>
          </div>
        ))}
      </div>
      
      <div className="section-label">Performance</div>
      <hr className="divider-row" />
      <div className="processes-rectangles-container processes-middle-row">
        {leistungNames.map((name, i) => (
          <div key={i} className="processes-rectangle" onClick={() => handleProcessClick(name)}>
            <div className="processes-rectangle-green">
              {getProcessIcon(name)}
            </div>
            <div className="processes-rectangle-red">{name}</div>
          </div>
        ))}
      </div>
      
      <div className="section-label">Support</div>
      <hr className="divider-row" />
      <div className="processes-rectangles-container processes-bottom-row">
        {supportNames.map((name, i) => (
          <div key={i} className="processes-rectangle" onClick={() => handleProcessClick(name)}>
            <div className="processes-rectangle-green">
              {getProcessIcon(name)}
            </div>
            <div className="processes-rectangle-red">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};