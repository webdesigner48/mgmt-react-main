import React, { useState } from 'react';
import './KnowHubToolMenu.css';
import { ReactComponent as DropIcon } from '../../../../../assets/icons/DocumentIcons/Drop.svg';
import { ReactComponent as FlowIcon } from '../../../../../assets/icons/DocumentIcons/Flow.svg';
import { ReactComponent as DescribtionIcon } from '../../../../../assets/icons/DocumentIcons/Describtion.svg';
import { ReactComponent as ArchiveIcon } from '../../../../../assets/icons/DocumentIcons/Archive.svg';
import { ReactComponent as ConfirmIcon } from '../../../../../assets/icons/DocumentIcons/Confirm.svg';
import { ReactComponent as EditIcon } from '../../../../../assets/icons/DocumentIcons/Edit.svg';
import KnowHubToolDropLibrary from './KnowHubToolDropLibary';

interface KnowHubToolMenuProps {
  isVisible: boolean;
  onClose: () => void;
  onItemClick?: () => void; // Made optional since we're handling it internally
}

const KnowHubToolMenu: React.FC<KnowHubToolMenuProps> = ({ isVisible, onClose, onItemClick }) => {
  const [isDropLibraryVisible, setDropLibraryVisible] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleMenuItemClick = () => {
    setDropLibraryVisible(true);
  };

  const handleDropLibraryClose = () => {
    setDropLibraryVisible(false);
  };

  const handleFilterClose = () => {
    if (isDropLibraryVisible) {
      handleDropLibraryClose();
    } else {
      onClose();
    }
  };

  return (
    <>
      
      {/* Drop Library Popup */}
      <KnowHubToolDropLibrary 
        isVisible={isDropLibraryVisible} 
        onClose={handleDropLibraryClose} 
      />
      
      {/* Menu Items */}
      <div className="knowhub-tool-menu">
        <div className="knowhub-tool-menu-item" onClick={handleMenuItemClick}>
          <DropIcon className="menu-item-icon-drop" />
          <span className="menu-item-text">Drops verwalten</span>
        </div>
        <div className="knowhub-tool-menu-item" onClick={handleMenuItemClick}>
          <FlowIcon className="menu-item-icon-flow" />
          <span className="menu-item-text">Flows verwalten</span>
        </div>
        <div className="knowhub-tool-menu-item" onClick={handleMenuItemClick}>
          <DescribtionIcon className="menu-item-icon-describtion" />
          <span className="menu-item-text">Beschreibungen verwalten</span>
        </div>
        <div className="knowhub-tool-menu-item" onClick={handleMenuItemClick}>
          <EditIcon className="menu-item-icon-edit" />
          <span className="menu-item-text">Dokumente bearbeiten</span>
        </div>
        <div className="knowhub-tool-menu-item" onClick={handleMenuItemClick}>
          <ConfirmIcon className="menu-item-icon-confirm" />
          <span className="menu-item-text">Wissen freigeben</span>
        </div>
        <div className="knowhub-tool-menu-item" onClick={handleMenuItemClick}>
          <ArchiveIcon className="menu-item-icon-archive" />
          <span className="menu-item-text">Archive öffnen</span>
        </div>
      </div>
    </>
  );
};

export default KnowHubToolMenu;