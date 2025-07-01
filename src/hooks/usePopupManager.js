// hooks/usePopupManager.js
import { useState } from 'react';

export const usePopupManager = () => {
  const [isConfirmationPopupVisible, setIsConfirmationPopupVisible] = useState(false);
  const [confirmationPopupMessage, setConfirmationPopupMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);
  const [backgroundFilterZIndex, setBackgroundFilterZIndex] = useState(1010);
  const [isAddPersonelPopupVisible, setIsAddPersonelPopupVisible] = useState(false);
  const [isCompanyDataPopupVisible, setIsCompanyDataPopupVisible] = useState(false);

  const showConfirmationPopup = (message, onConfirmCallback) => {
    setConfirmationPopupMessage(message);
    setConfirmAction(() => onConfirmCallback);
    setIsConfirmationPopupVisible(true);
    setBackgroundFilterZIndex(1030);
  };

  const hideConfirmationPopup = () => {
    setIsConfirmationPopupVisible(false);
    setConfirmationPopupMessage('');
    setConfirmAction(null);
    setBackgroundFilterZIndex(1010);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    hideConfirmationPopup();
  };

  const showAddPersonelPopup = () => {
    setIsAddPersonelPopupVisible(true);
    setBackgroundFilterZIndex(1030);
  };

  const hideAddPersonelPopup = () => {
    setIsAddPersonelPopupVisible(false);
    setBackgroundFilterZIndex(1010);
  };

  const showCompanyDataPopup = () => {
    setIsCompanyDataPopupVisible(true);
    setBackgroundFilterZIndex(1030);
  };

  const hideCompanyDataPopup = () => {
    setIsCompanyDataPopupVisible(false);
    setBackgroundFilterZIndex(1010);
  };

  const popupState = {
    isConfirmationPopupVisible,
    confirmationPopupMessage,
    confirmAction,
    backgroundFilterZIndex,
    isAddPersonelPopupVisible,
    isCompanyDataPopupVisible,
  };

  return {
    popupState,
    showConfirmationPopup,
    hideConfirmationPopup,
    handleConfirm,
    showAddPersonelPopup,
    hideAddPersonelPopup,
    showCompanyDataPopup,
    hideCompanyDataPopup
  };
};