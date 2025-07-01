import React, { useState } from 'react';
import BackgroundFilter from '../../../BackgroundFilter/BackgroundFilter';
import KnowHubToolDropLibrary from './KnowHubToolDropLibary';
import './KnowHubTool.css';
import FloatingDots from './FloatingDots';
import { ReactComponent as Icon } from '../../../../../assets/icons/DocumentIcons/Drop.svg';
import { ReactComponent as ThreeDots } from '../../../../../assets/icons/MenuIcons/KnowHub/ThreeDots.svg';
import { ReactComponent as FlowIcon } from '../../../../../assets/icons/DocumentIcons/Flow.svg';
import { ReactComponent as DescribtionIcon } from '../../../../../assets/icons/DocumentIcons/Describtion.svg';

interface KnowHubToolProps {
  isVisible: boolean;
  onClose: () => void;
}

const documents = [
    { type: 'drop', title: 'Hier ist ein Drop', description: 'Hier ist ein etwas detaillierter Drop zum Verständis der Sache und sowas', IconComponent: Icon },
    { type: 'drop', title: 'Hier ist ein Drop', description: 'Hier ist ein etwas detaillierter Drop zum Verständis der Sache und sowas', IconComponent: Icon },
    { type: 'flow', title: 'Hier ist ein Flow', description: 'Hier ist ein etwas detaillierter Flow zum Verständis der Sache', IconComponent: FlowIcon },
    { type: 'describtion', title: 'Hier ist eine Beschreibung', description: 'Hier ist eine etwas detaillierte Beschreibung zum Verständis der Sache', IconComponent: DescribtionIcon },
  ];

const KnowHubTool: React.FC<KnowHubToolProps> = ({ isVisible, onClose }) => {
  const [isDocActive, setDocActive] = useState(false);
  const [isDropLibraryVisible, setDropLibraryVisible] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleDocClick = () => {
    setDocActive(true);
    setDropLibraryVisible(true);
  };

  const handleDropLibraryClose = () => {
    setDropLibraryVisible(false);
    setDocActive(false);
  };

  const handleFilterClose = () => {
    if (isDropLibraryVisible) {
      handleDropLibraryClose();
    } else if (isDocActive) {
      setDocActive(false);
    } else {
      onClose();
    }
  };

  const dropCount = documents.filter(d => d.type === 'drop').length;
  const flowCount = documents.filter(d => d.type === 'flow').length;
  const describtionCount = documents.filter(d => d.type === 'describtion').length;

  return (
    <>
      <BackgroundFilter isVisible={isVisible} onClose={handleFilterClose}/>
      
      {/* Drop Library Popup */}
      <KnowHubToolDropLibrary 
        isVisible={isDropLibraryVisible} 
        onClose={handleDropLibraryClose} 
      />
      
      <div className="knowhub-tool-overlay" onClick={handleFilterClose}>
        <div className="knowhub-tool-content" onClick={(e) => e.stopPropagation()}>
          <div className="knowhub-container">
            <div className="knowhub-sidebar-internal">
              <FloatingDots dropCount={dropCount} flowCount={flowCount} describtionCount={describtionCount} />
              <div className="sidebar-divider"></div>
              
              <div className="rectangle-container">
                <div className="sidebar-rectangle" onClick={handleDocClick}>
                  <div className="sidebar-rectangle-type" >
                    <Icon className="docs-icon-type" />
                  </div>
                  <div className="sidebar-rectangle-digits">
                    <h2>Abgelaufenes Dokument</h2>
                    <p>Läuft ab in | 14 Tagen </p>
                  </div>
                </div>
                
              </div>
              <div className="bottom-sidebar-divider"></div>
            </div>
            <div className="knowhub-main">
              <div className="documents-tool-header">
                <h2 className="documents-tool-title">Know Hub</h2>
                <button
                  className="documents-tool-close-button"
                  aria-label="Documents Tool schließen"
                  onClick={onClose}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                  </svg>
                </button>
              </div>
              <div className="main-docs-container">
                {documents.map((doc, index) => (
                    <div key={index} className={`main-docs ${doc.type}`} onClick={handleDocClick}>
                        <div className="main-docs-overlay-top">
                            <p>{doc.description}</p>
                            <ThreeDots className="three-dots-icon" />
                        </div>
                        <div className="main-docs-overlay-bottom">
                            <p>{doc.title}</p>
                        </div>
                        <doc.IconComponent className="docs-icon" />
                    </div>
                ))}
              </div>
              <div className="bottom-sidebar-divider"></div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
  
};

export default KnowHubTool;