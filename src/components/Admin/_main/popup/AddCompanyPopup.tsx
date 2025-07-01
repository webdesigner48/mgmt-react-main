// AddCompanyPopup.tsx
import React, { useState } from 'react';
import "./../css/companyPopup.css";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface AddCompanyPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (companyName: string, companyCountry: string) => void;
  isLoading?: boolean;
}

// List of countries with flags
const countries: Country[] = [
  { code: 'DE', name: 'Deutschland', flag: '🇩🇪' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CH', name: 'Schweiz', flag: '🇨🇭' },
  { code: 'AT', name: 'Österreich', flag: '🇦🇹' },
  { code: 'FR', name: 'Frankreich', flag: '🇫🇷' },
  { code: 'IT', name: 'Italien', flag: '🇮🇹' },
  { code: 'ES', name: 'Spanien', flag: '🇪🇸' },
  { code: 'NL', name: 'Niederlande', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgien', flag: '🇧🇪' },
  { code: 'SE', name: 'Schweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norwegen', flag: '🇳🇴' },
  { code: 'DK', name: 'Dänemark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finnland', flag: '🇫🇮' },
  { code: 'PL', name: 'Polen', flag: '🇵🇱' },
  { code: 'CZ', name: 'Tschechien', flag: '🇨🇿' },
  { code: 'HU', name: 'Ungarn', flag: '🇭🇺' },
  { code: 'SK', name: 'Slowakei', flag: '🇸🇰' },
  { code: 'SI', name: 'Slowenien', flag: '🇸🇮' },
  { code: 'HR', name: 'Kroatien', flag: '🇭🇷' },
  { code: 'RO', name: 'Rumänien', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgarien', flag: '🇧🇬' },
  { code: 'GR', name: 'Griechenland', flag: '🇬🇷' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'IE', name: 'Irland', flag: '🇮🇪' },
  { code: 'LU', name: 'Luxemburg', flag: '🇱🇺' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'CY', name: 'Zypern', flag: '🇨🇾' },
  { code: 'EE', name: 'Estland', flag: '🇪🇪' },
  { code: 'LV', name: 'Lettland', flag: '🇱🇻' },
  { code: 'LT', name: 'Litauen', flag: '🇱🇹' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Kanada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australien', flag: '🇦🇺' },
  { code: 'NZ', name: 'Neuseeland', flag: '🇳🇿' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'Südkorea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'Indien', flag: '🇮🇳' },
  { code: 'SG', name: 'Singapur', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'PH', name: 'Philippinen', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonesien', flag: '🇮🇩' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'BR', name: 'Brasilien', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexiko', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentinien', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Kolumbien', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'ZA', name: 'Südafrika', flag: '🇿🇦' },
  { code: 'EG', name: 'Ägypten', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenia', flag: '🇰🇪' },
  { code: 'MA', name: 'Marokko', flag: '🇲🇦' },
  { code: 'TN', name: 'Tunesien', flag: '🇹🇳' },
  { code: 'TR', name: 'Türkei', flag: '🇹🇷' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'SA', name: 'Saudi-Arabien', flag: '🇸🇦' },
  { code: 'AE', name: 'VAE', flag: '🇦🇪' },
  { code: 'QA', name: 'Katar', flag: '🇶🇦' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲' },
  { code: 'JO', name: 'Jordanien', flag: '🇯🇴' },
  { code: 'LB', name: 'Libanon', flag: '🇱🇧' },
  { code: 'RU', name: 'Russland', flag: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾' },
  { code: 'MD', name: 'Moldawien', flag: '🇲🇩' },
  { code: 'GE', name: 'Georgien', flag: '🇬🇪' },
  { code: 'AM', name: 'Armenien', flag: '🇦🇲' },
  { code: 'AZ', name: 'Aserbaidschan', flag: '🇦🇿' },
  { code: 'KZ', name: 'Kasachstan', flag: '🇰🇿' },
  { code: 'UZ', name: 'Usbekistan', flag: '🇺🇿' },
  { code: 'KG', name: 'Kirgisistan', flag: '🇰🇬' },
  { code: 'TJ', name: 'Tadschikistan', flag: '🇹🇯' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: 'MN', name: 'Mongolei', flag: '🇲🇳' },
];

const AddCompanyPopup: React.FC<AddCompanyPopupProps> = ({
  isVisible,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  const [companyName, setCompanyName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{name?: string; country?: string}>({});

  const validateForm = () => {
    const newErrors: {name?: string; country?: string} = {};
    
    if (!companyName.trim()) {
      newErrors.name = 'Unternehmensname ist erforderlich';
    } else if (companyName.trim().length < 2) {
      newErrors.name = 'Unternehmensname muss mindestens 2 Zeichen lang sein';
    }
    
    if (!selectedCountry) {
      newErrors.country = 'Land ist erforderlich';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const country = countries.find(c => c.code === selectedCountry);
      onSubmit(companyName.trim(), country?.name || selectedCountry);
    }
  };

  const handleClose = () => {
    setCompanyName('');
    setSelectedCountry('');
    setSearchTerm('');
    setIsDropdownOpen(false);
    setErrors({});
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      } else {
        handleClose();
      }
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country.code);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  if (!isVisible) return null;

  return (
    <div 
      className="add-company-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="add-company-modal">
        <div className="add-company-header">
          <h2>Neues Unternehmen hinzufügen</h2>
          <button 
            className="close-btn" 
            onClick={handleClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-company-form">
          <div className="form-group">
            <label htmlFor="companyName">Unternehmensname *</label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="z.B. Microsoft Corporation"
              className={`form-input ${errors.name ? 'error' : ''}`}
              disabled={isLoading}
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="companyCountry">Land *</label>
            <div className="country-dropdown-container">
              <div 
                className={`country-dropdown-trigger ${errors.country ? 'error' : ''} ${isDropdownOpen ? 'open' : ''}`}
                onClick={() => !isLoading && setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedCountryData ? (
                  <div className="selected-country">
                    <span className="country-flag">{selectedCountryData.flag}</span>
                    <span className="country-name">{selectedCountryData.name}</span>
                  </div>
                ) : (
                  <span className="placeholder">Land auswählen</span>
                )}
                <svg 
                  className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="country-dropdown-menu">
                  <div className="country-search">
                    <input
                      type="text"
                      placeholder="Land suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="country-search-input"
                      autoFocus
                    />
                  </div>
                  <div className="country-list">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <div
                          key={country.code}
                          className={`country-option ${selectedCountry === country.code ? 'selected' : ''}`}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <span className="country-flag">{country.flag}</span>
                          <span className="country-name">{country.name}</span>
                          <span className="country-code">{country.code}</span>
                        </div>
                      ))
                    ) : (
                      <div className="no-countries">Keine Länder gefunden</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.country && <span className="error-message">{errors.country}</span>}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={handleClose}
              disabled={isLoading}
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="spinner-small" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="15.71" strokeDashoffset="15.71">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.42;15.71 15.71;0 31.42" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.71;-31.42" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Hinzufügen...
                </>
              ) : (
                'Hinzufügen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyPopup;