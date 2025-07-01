import React, { useState, useEffect } from 'react';
import './ToDosTool.css';
import BackgroundFilter from '../../../BackgroundFilter/BackgroundFilter';

interface ToDosToolProps {
  isVisible: boolean;
  onClose: () => void;
}

const ToDosTool: React.FC<ToDosToolProps> = ({ isVisible, onClose }) => {
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
      }, 400); // This duration must match your CSS transition duration
      return () => clearTimeout(timerId);
    }
  }, [isVisible]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <BackgroundFilter isVisible={isVisible} onClose={onClose} />
      <div className={`to-dos-tool ${animationClassName}`}>
        <div className="to-dos-tool-header">
          <h2 className="to-dos-tool-title">To-Do's Tool</h2>
          <button
            className="to-dos-tool-close-button"
            onClick={onClose}
            aria-label="To-Do's Tool schließen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        </div>
        {/* Content of the DocumentsTool can be added here */}
      </div>
    </>
  );
};

export default ToDosTool;
