// components/DepartmentsSection.tsx
import React, { useState, useEffect } from 'react';
import { CompanyDataFormData } from '../types';

interface DepartmentsSectionProps {
  formData: CompanyDataFormData;
  setFormData: React.Dispatch<React.SetStateAction<CompanyDataFormData>>;
  departmentStates: any;
  colorStates: any;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({ 
  formData, 
  setFormData, 
  departmentStates,
  colorStates 
}) => {
  const [departmentsFadeIn, setDepartmentsFadeIn] = useState(false);

  useEffect(() => {
    setDepartmentsFadeIn(false);
    const timer = setTimeout(() => setDepartmentsFadeIn(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`departments-fade-wrapper${departmentsFadeIn ? ' fade-in' : ''}`}>
      <div className="departments-colorbar">
        <div className="departments-row-top">
          <div className="departments-color departments-blue" style={{ background: colorStates.colorBlue || undefined, padding: '2px', flex: 1.2 }}>
            <input
              type="text"
              className={formData.companyName ? 'filled' : ''}
              placeholder="Name"
              value={formData.companyName}
              onChange={e => setFormData({ ...formData, companyName: e.target.value })}
              style={{ 
                width: '100%', 
                height: '100%', 
                background: '#1e2732', 
                color: '#ececec', 
                border: '1.5px solid #4a5568', 
                borderRadius: '5px', 
                padding: '8px 10px', 
                fontSize: '1em', 
                boxSizing: 'border-box', 
                outline: 'none' 
              }}
              onFocus={e => e.target.style.borderColor = '#5a9bd3'}
              onBlur={e => e.target.style.borderColor = formData.companyName ? '#1dbb86a6' : '#4a5568'}
            />
          </div>
          <div className="departments-color departments-green" style={{ background: colorStates.colorGreen || undefined, padding: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 0.7 }}>
            <input
              type="text"
              className={departmentStates.departmentGreenInput ? 'filled' : ''}
              placeholder="KRZ"
              value={departmentStates.departmentGreenInput}
              onChange={e => departmentStates.setDepartmentGreenInput(e.target.value.toUpperCase())}
              style={{ 
                width: '65px', 
                height: '100%', 
                background: '#1e2732', 
                color: '#ececec', 
                border: '1.5px solid #4a5568', 
                borderRadius: '5px', 
                padding: '8px 10px', 
                fontSize: '1em', 
                boxSizing: 'border-box', 
                outline: 'none', 
                textAlign: 'center', 
                textTransform: 'uppercase', 
                margin: '0 auto', 
                display: 'block' 
              }}
              onFocus={e => e.target.style.borderColor = '#5a9bd3'}
              onBlur={e => e.target.style.borderColor = departmentStates.departmentGreenInput ? '#1dbb86a6' : '#4a5568'}
              maxLength={4}
            />
          </div>
          <div className="departments-color departments-orange" style={{ background: colorStates.colorOrange || undefined, padding: '2px', position: 'relative', flex: 1.1, minWidth: '120px', maxWidth: '180px' }}>
            <select
              className={departmentStates.departmentOrangeSelect ? 'filled' : ''}
              value={departmentStates.departmentOrangeSelect}
              onChange={e => departmentStates.setDepartmentOrangeSelect(e.target.value)}
              style={{ 
                width: '100%', 
                height: '100%', 
                background: 'transparent', 
                color: '#ececec', 
                border: '1.5px solid #4a5568', 
                borderRadius: '5px', 
                padding: '8px 32px 8px 10px', 
                fontSize: '1em', 
                boxSizing: 'border-box', 
                outline: 'none', 
                appearance: 'none' 
              }}
              onFocus={e => e.target.style.borderColor = '#5a9bd3'}
              onBlur={e => e.target.style.borderColor = departmentStates.departmentOrangeSelect ? '#1dbb86a6' : '#4a5568'}
            >
              <option value="" disabled hidden>Bereich wählen</option>
              <option value="Administration">Administration</option>
              <option value="Finanzen">Finanzen</option>
              <option value="Service">Service</option>
              <option value="Vertrieb">Vertrieb</option>
              <option value="Qualität">Qualität</option>
              <option value="Nachhaltigkeit">Nachhaltigkeit</option>
              <option value="Produktion">Produktion</option>
            </select>
            <span className="departments-dropdown-arrow" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#ececec', fontSize: '1.1em' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="#ececec" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
          <div className="departments-color departments-yellow" style={{ background: colorStates.colorYellow || undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80px', height: '100%', flex: 0.6 }}>
            <svg
              className="departments-trash-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="22" height="22"
              style={{ cursor: 'pointer' }}
            >
              <g id="_01_align_center" data-name="01 align center">
                <path fill="#ececec" d="M22,4H17V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2ZM9,2h6V4H9Zm9,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V6H18Z" />
                <rect fill="#ececec" x="9" y="10" width="2" height="8" />
                <rect fill="#ececec" x="13" y="10" width="2" height="8" />
              </g>
            </svg>
          </div>
        </div>
        <div className="departments-color departments-red">
          <input
            type="text"
            className={departmentStates.departmentRedInput ? 'filled' : ''}
            placeholder="Aufgabe"
            value={departmentStates.departmentRedInput}
            onChange={e => departmentStates.setDepartmentRedInput(e.target.value)}
            style={{ 
              width: '95%', 
              height: '100%', 
              background: '#1e2732', 
              color: '#ececec', 
              border: '1.5px solid #4a5568', 
              borderRadius: '5px', 
              padding: '8px 10px', 
              fontSize: '1em', 
              boxSizing: 'border-box', 
              outline: 'none' 
            }}
            onFocus={e => e.target.style.borderColor = '#5a9bd3'}
            onBlur={e => e.target.style.borderColor = departmentStates.departmentRedInput ? '#1dbb86a6' : '#4a5568'}
          />
        </div>
      </div>
    </div>
  );
};