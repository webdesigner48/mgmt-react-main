import React from 'react';

const PersonalSection: React.FC = () => {
  return (
    <div className="popup-form-section">
      <div className="section-label">Personal Information</div>
      <hr className="divider-row" />
      <p style={{ color: '#aeb8c2', fontSize: '0.95rem', lineHeight: '1.5' }}>
        This section is currently empty. Personal information and settings will be added here.
      </p>
      
      {/* You can add more content here in the future */}
      <div style={{ marginTop: '20px' }}>
        <div className="section-label">Future Features</div>
        <hr className="divider-row" />
        <ul style={{ color: '#aeb8c2', fontSize: '0.9rem', paddingLeft: '20px' }}>
          <li>Employee profiles</li>
          <li>Personal settings</li>
          <li>User preferences</li>
          <li>Contact information</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalSection;