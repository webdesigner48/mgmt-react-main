import React, { useState, useEffect } from 'react';
import './DropTool.css';
import BackgroundFilter from '../../../BackgroundFilter/BackgroundFilter';

interface DropToolProps {
  isVisible: boolean;
  onClose: () => void;
}

const DropTool: React.FC<DropToolProps> = ({ isVisible, onClose }) => {
  const [isMounted, setIsMounted] = useState(isVisible);
  const [animationClassName, setAnimationClassName] = useState('');

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      const frameId = requestAnimationFrame(() => {
        setAnimationClassName('visible');
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      setAnimationClassName('hidden');
      const timerId = setTimeout(() => {
        setIsMounted(false);
        setAnimationClassName('');
      }, 400);
      return () => clearTimeout(timerId);
    }
  }, [isVisible]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <BackgroundFilter isVisible={isVisible} onClose={onClose} />
      <div className={`drop-tool ${animationClassName}`}>
        <div className="drop-tool-header">
          <h2 className="drop-tool-title">DropTool</h2>
          <button
            className="drop-tool-close-button"
            onClick={onClose}
            aria-label="Drop Tool schließen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default DropTool;
