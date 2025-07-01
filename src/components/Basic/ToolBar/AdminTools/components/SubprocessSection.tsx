import React, { useState, useEffect } from 'react';
import './SubprocessSection.css';
import { getProcessIcon } from '../utils/processIcons';

interface SubprocessSectionProps {
  title: string;
}

const SubprocessSection: React.FC<SubprocessSectionProps> = ({ title }) => {
  const [isFadingIn, setIsFadingIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFadingIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`subprocess-section-wrapper${isFadingIn ? ' fade-in' : ''}`}>
        <div className="section-label">
          {getProcessIcon(title)}
          <span>{title}</span>
        </div>
        <hr className="divider-row" />
        {/* Weitere Inhalte für den Subprozess können hier hinzugefügt werden */}
    </div>
  );
};

export default SubprocessSection;
