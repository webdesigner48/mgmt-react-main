// components/CompanySection.tsx
import React from 'react';
import { CompanyDataFormData } from '../types';
import { businessFieldsByIndustry } from '../utils/constants';

interface CompanySectionProps {
  formData: CompanyDataFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isEditMode?: boolean;
  isLoading?: boolean;
}

export const CompanySection: React.FC<CompanySectionProps> = ({ 
  formData, 
  handleChange, 
  isEditMode = false,
  isLoading = false 
}) => {
  return (
    <div className="popup-form-section">
      <div className="form-group">
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={formData.companyName ? 'filled' : ''}
          placeholder="Firmenname"
          disabled={isLoading}
        />
      </div>
      <div className="form-row">
        <div className="form-group form-group-street">
          <input
            type="text"
            id="street"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className={formData.street ? 'filled' : ''}
            placeholder="Strasse"
            disabled={isLoading}
          />
        </div>
        <div className="form-group form-group-houseNumber">
          <input
            type="text"
            id="houseNumber"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            className={formData.houseNumber ? 'filled' : ''}
            placeholder="Nr."
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group form-group-postalCode">
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={formData.postalCode ? 'filled' : ''}
            placeholder="Postleitzahl"
            disabled={isLoading}
          />
        </div>
        <div className="form-group form-group-province">
          <input
            type="text"
            id="province"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className={formData.province ? 'filled' : ''}
            placeholder="Stadt"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="form-group form-group-province">
        <input
          type="text"
          id="region"
          name="region"
          value={formData.region || ''}
          onChange={handleChange}
          className={formData.region ? 'filled' : ''}
          placeholder="Provinz"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className={formData.country ? 'filled' : ''}
          placeholder="Land"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          id="taxid"
          name="taxid"
          value={formData.taxid || ''}
          onChange={handleChange}
          className={formData.taxid ? 'filled' : ''}
          placeholder="Umsatzsteuer - ID"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <select
          id="industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className={formData.industry ? 'filled' : 'dropdown-placeholder-orange'}
          disabled={isLoading}
        >
          <option value="" style={{ color: 'orange', opacity: 0.7 }}>Branche auswählen</option>
          <option value="Maschinenbau">Maschinenbau</option>
          <option value="Gesundheitswesen">Gesundheitswesen</option>
          <option value="Finanzdienstleistungen">Finanzdienstleistungen</option>
          <option value="Konsumgüter">Konsumgüter</option>
          <option value="Industrie">Industrie</option>
          <option value="Energie">Energie</option>
          <option value="Rohstoffe">Rohstoffe</option>
          <option value="Immobilien">Immobilien</option>
          <option value="Unterhaltung">Unterhaltung</option>
          <option value="Bildung">Bildung</option>
          <option value="Tourismus">Tourismus</option>
          <option value="Gastronomie">Gastronomie</option>
        </select>
      </div>
      <div className="form-group">
        <select
          id="businessField"
          name="businessField"
          value={formData.businessField}
          onChange={handleChange}
          disabled={!formData.industry || isLoading}
          className={
            !formData.industry
              ? 'dropdown-placeholder-grey'
              : formData.businessField
              ? 'filled'
              : 'dropdown-placeholder-orange'
          }
        >
          <option value="" style={{ color: !formData.industry ? '#b0b0b0' : 'orange', opacity: !formData.industry ? 0.45 : 0.7 }}>
            Geschäftsfeld auswählen
          </option>
          {formData.industry &&
            businessFieldsByIndustry[formData.industry]?.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
        </select>
      </div>
      
      {/* Submit Button */}
      <div className="form-submit-container" style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0,0,0,0.1)'
      }}>
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
          style={{
            backgroundColor: isLoading ? '#ccc' : '#1dbb86',
            color: 'white',
            border: 'none',
            padding: '12px 36px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minWidth: '140px'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#17a574';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.backgroundColor = '#1dbb86';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }
          }}
        >
          {isLoading ? 'Wird geladen...' : (isEditMode ? 'Aktualisieren' : 'Hinzufügen')}
        </button>
      </div>
    </div>
  );
};