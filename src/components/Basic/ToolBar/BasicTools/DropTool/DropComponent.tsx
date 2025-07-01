import React from 'react';
import './DropComponent.css';

const DropComponent = () => {
  return (
    <div className="note-container">
      <div className="top-right-controls">
        <button className="top-icon-button" title="Pin Note">
          <svg viewBox="0 0 24 24"><path d="M16 3v6l2 2v2h-5l-1 1-1-1H6v-2l2-2V3h8m2-2H6c-1.1 0-2 .9-2 2v8l-2 2v2h7v5l1 1 1-1v-5h7v-2l-2-2V3c0-1.1-.9-2-2-2z"/></svg>
        </button>
        <button className="top-icon-button" title="Add Tag">
          <svg viewBox="0 0 24 24"><path d="M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.37.86.59 1.41.59s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.22-1.05-.59-1.42z"/></svg>
        </button>
        <button className="top-icon-button" title="Delete Note">
          <svg viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12z"/></svg>
        </button>
      </div>
      <div className="creation-info">
        Erstellt von Max Mustermann
      </div>
      <div className="input-group-container">
        <div className="title-input-wrapper">
          <input type="text" className="note-title-input" placeholder="Titel der Notiz" />
        </div>
        <div className="content-textarea-wrapper">
          <textarea className="note-content-textarea" placeholder="Schreiben Sie hier Ihre Notiz..."></textarea>
        </div>
      </div>
      <div className="resize-handle"></div>
    </div>
  );
};

export default DropComponent;
