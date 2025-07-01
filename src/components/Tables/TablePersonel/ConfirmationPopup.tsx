import React, { useState, useEffect } from 'react';
import './ConfirmationPopup.css';

interface ConfirmationPopupProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ message, onConfirm, onCancel, isVisible }) => {
  const [isMounted, setIsMounted] = useState(isVisible);
  const [animationClassName, setAnimationClassName] = useState('');

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      // Delay setting fade-in to allow initial render with opacity 0
      const timer = setTimeout(() => {
        setAnimationClassName('fade-in');
      }, 10); // Small delay
      return () => clearTimeout(timer);
    } else {
      setAnimationClassName('fade-out');
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => {
        setIsMounted(false);
      }, 300); // Match CSS transition duration
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isMounted && !animationClassName.includes('fade-out')) { // Keep mounted during fade-out
    return null;
  }
  if (!isMounted && animationClassName === '' && !isVisible) { // Fully unmount after fade-out if isVisible is still false
      return null;
  }

  return (
    <div className={`confirmation-popup-overlay ${animationClassName}`}>
      <div className="confirmation-popup-container">
        <p className="confirmation-popup-message">{message}</p>
        <div className="confirmation-popup-buttons">
          <button className="confirmation-popup-button confirm" onClick={onConfirm}>
            Ja
          </button>
          <button className="confirmation-popup-button cancel" onClick={onCancel}>
            Nein
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
