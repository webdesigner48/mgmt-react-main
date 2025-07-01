import React, { useState, useEffect } from 'react';
import './BackgroundFilter.css';

interface BackgroundFilterProps {
  isVisible: boolean;
  onClose?: () => void;
  zIndex?: number; // New prop
  isActive?: boolean;
}

const BackgroundFilter: React.FC<BackgroundFilterProps> = ({ isVisible, onClose, zIndex, isActive }) => {
  const [isMounted, setIsMounted] = useState(isVisible);
  const [animationClassName, setAnimationClassName] = useState('');

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true); // Ensure the component is mounted
      // Use requestAnimationFrame to apply the 'visible' class in the next frame,
      // allowing the component to render with initial styles (opacity: 0) first.
      const frameId = requestAnimationFrame(() => {
        setAnimationClassName('visible');
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      // Start fade-out: remove 'visible' class to transition to base styles (opacity: 0)
      setAnimationClassName('');
      // After the CSS transition duration (0.4s), unmount the component
      const timerId = setTimeout(() => {
        setIsMounted(false);
      }, 400); // This duration must match your CSS transition duration
      return () => clearTimeout(timerId);
    }
  }, [isVisible]);

  if (!isMounted) {
    return null;
  }

  const activeClass = isActive ? 'active' : '';

  return (
    <div
      className={`background-filter ${animationClassName} ${activeClass}`}
      onClick={onClose}
      aria-hidden={!isVisible} // Keep aria-hidden tied to the logical visibility
      role="dialog"
      aria-modal="true"
      style={zIndex !== undefined ? { zIndex } : {}} // Apply zIndex if provided
    />
  );
};

export default BackgroundFilter;
