// layouts/ViewRouter.jsx
import React from 'react';
import MainChat from '../components/LandingPage/MainChat/MainChat';
import UnternehmenView from '../components/UnternehmenPage/UnternehmenView';
import ProdukteView from '../components/ProduktePage/ProdukteView';

function ViewRouter({ activeView, previousView }) {
  const getViewClass = () => {
    return previousView === 'mainChat' ? 'fade-out' : 'fade-in';
  };

  switch (activeView) {
    case 'mainChat':
      return (
        <div className={`main-chat-container ${getViewClass()}`}>
          <MainChat />
        </div>
      );
    
    case 'unternehmenView':
      return (
        <div className={`view-container ${getViewClass()}`}>
          <UnternehmenView />
        </div>
      );
    
    case 'produkteView':
      return (
        <div className={`view-container ${getViewClass()}`}>
          <ProdukteView />
        </div>
      );
    
    default:
      return (
        <div className="main-chat-container fade-in">
          <MainChat />
        </div>
      );
  }
}

export default ViewRouter;