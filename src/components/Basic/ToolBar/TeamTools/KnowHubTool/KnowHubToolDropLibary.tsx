import React, { useState, useEffect } from 'react';
import BookReader from './BookReader';
import DropComponent from './../../../../Basic/DropTool/DropComponent';
import './KnowHubToolDropLibary.css';
import { ReactComponent as DropIcon } from '../../../../../assets/icons/DocumentIcons/Drop.svg';
import { ReactComponent as SearchIcon } from '../../../../../assets/icons/MenuIcons/Core/Search.svg';
import { ReactComponent as PinIcon } from '../../../../../assets/icons/MenuIcons/Core/Pin.svg';

interface KnowHubToolDropLibraryProps {
  isVisible: boolean;
  onClose: () => void;
}

const KnowHubToolDropLibrary: React.FC<KnowHubToolDropLibraryProps> = ({ isVisible, onClose }) => {
  const [showBookReader, setShowBookReader] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [showDropComponent, setShowDropComponent] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  useEffect(() => {
    if (!isVisible) {
      setIsClosing(false);
      setShowDropComponent(false);
      setSelectedDocument(null);
    }
  }, [isVisible]);

  if (!isVisible && !isClosing) {
    return null;
  }

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Corresponds to the animation duration
  };

  const handlePinClick = () => {
    setIsPinned(!isPinned);
  };

  const handleOpenBook = () => {
    setShowBookReader(true);
  };

  const handleCloseBook = () => {
    setShowBookReader(false);
  };

  const handleDocumentClick = (documentName: string) => {
    setSelectedDocument(documentName);
    setShowDropComponent(true);
  };

  const handleCloseDropComponent = () => {
    setShowDropComponent(false);
    setSelectedDocument(null);
  };

  const containerClassName = `knowhub-tool-drop-library-container ${isClosing ? 'closing' : ''} ${isPinned ? 'pinned' : ''}`;

  return (
    <>
      <div className="knowhub-tool-drop-library-overlay" onClick={handleClose}>
          
      <div className={containerClassName} onClick={(e) => e.stopPropagation()}>
        <div className="knowhub-tool-drop-library-content">
          <div className="knowhub-top-section">
            <div className="knowhub-search-container">
              <SearchIcon className="knowhub-search-icon" />
              <input type="text" className="knowhub-search-input" placeholder="" />
          </div>
          
            <div className="knowhub-burger-menu-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="#ececec" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" />
              </svg>
            </div>
            <div className={`knowhub-pin-container ${isPinned ? 'active' : ''}`} onClick={handlePinClick}>
            <PinIcon className="knowhub-pin-icon" />
            </div>
          </div>
          <div className="dropContainer">
            <div className="drop-content-item" onClick={() => handleDocumentClick('Dokumentname 1')}>
              <DropIcon className="menu-item-drop"/>
              <p>Dokumentname</p>
            </div>
            <div className="drop-content-item" onClick={() => handleDocumentClick('Dokumentname 2')}>
              <DropIcon className="menu-item-drop"/>
              <p>Dokumentname</p>
            </div>
          </div>
        </div>

      </div>

        <div className="knowhub-tool-drop-library-platform">
          {showDropComponent && (
            <div 
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) ${showDropComponent ? 'scale(1)' : 'scale(0.8)'}`,
                width: '500px',
                maxHeight: '80vh',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px',
                transition: 'all 0.3s ease-in-out',
                zIndex: 3000,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                opacity: showDropComponent ? 1 : 0
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: '1px solid #333',
                background: '#222'
              }}>
                <h3 style={{
                  margin: 0,
                  color: '#ececec',
                  fontSize: '16px',
                  fontWeight: 500
                }}>{selectedDocument}</h3>
                <button 
                  onClick={handleCloseDropComponent}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ececec',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close Document"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                  </svg>
                </button>
              </div>
              <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
                <DropComponent />
              </div>
            </div>
          )}
        </div>

        <button
          className="knowhub-tool-drop-library-close-button"
          onClick={handleClose}
          aria-label="Close Drop Library"
          >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>

      </div>

      <BookReader 
        isVisible={showBookReader} 
        onClose={handleCloseBook}
      />
    </>
  );
};

export default KnowHubToolDropLibrary;