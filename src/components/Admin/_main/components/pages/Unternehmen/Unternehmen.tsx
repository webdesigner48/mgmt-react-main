// ViewUnternehmen.tsx (Updated - Fixed department storage and eye toggle logic)
import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './../../../../../../store/hooks'; // Use the improved hooks
import { setSelectedCompany } from './../../../../../../store/slices/companySlice';
import { useToast } from "./../../../../../../alert/handler/useToast";

interface Company {
  id: number;
  name: string;
  rating: number;
  company_address?: string;
  company_country?: string;
  company_industry?: string;
  company_field?: string;
  company_id?: number;
  company_name?: string;
  // NEW: Add department fields from backend
  department_id?: number | null;
  department_name?: string | null;
}

interface Props {
  isGlobalEyeOff: boolean;
  individualEyeStates: { [key: number]: boolean };
  onIndividualEyeClick: (companyId: number) => void;
  isCompanyDataHidden: (companyId: number) => boolean;
  data: Company[];
  onClose: () => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onDataUpdate?: () => void;
  onCompanySelect?: (companyData: any) => void;
}

type SortField = 'name' | 'rating' | 'country' | 'industry';
type SortOrder = 'asc' | 'desc';

// Custom Confirmation Dialog Component (inline)
interface ConfirmDialogProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isVisible, title, message, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        style={{
          background: '#2a2a2a',
          borderRadius: '12px',
          padding: '24px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            flexShrink: 0,
            marginTop: '2px',
            color: '#ff6b6b'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: '600',
              color: '#fff'
            }}>
              {title}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: '1.5',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onCancel}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ececec',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewUnternehmen: React.FC<Props> = ({
  isGlobalEyeOff,
  individualEyeStates,
  onIndividualEyeClick,
  isCompanyDataHidden,
  data,
  onClose,
  isLoading = false,
  error = null,
  onRefresh,
  onDataUpdate,
  onCompanySelect
}) => {
  // Redux dispatch with proper typing
  const dispatch = useAppDispatch();

  // Get selected company from Redux store
  const selectedCompany = useAppSelector((state) => state.company.selectedCompany);

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<{ id: number, name: string } | null>(null);

  // Toast notifications (only for delete operations now)
  const { success, error: showError, warning } = useToast();

  // Helper function to check if a company is currently selected
  const isCompanySelected = (company: Company) => {
    if (!selectedCompany) return false;
    const companyId = company.company_id || company.id;
    return selectedCompany.companyId === companyId;
  };

  // Function to get display text (either original or asterisks)
  const getDisplayText = (text: string, isHidden: boolean) => {
    return isHidden ? '*'.repeat(Math.min(text.length, 10)) : text;
  };

  // Function to get display rating (either original or asterisks)
  const getDisplayRating = (rating: number, isHidden: boolean) => {
    const ratingText = `${rating.toFixed(1)} / 10`;
    return isHidden ? '*'.repeat(ratingText.length) : ratingText;
  };

  // Show confirmation dialog
  const showDeleteConfirmation = (companyId: number, companyName: string) => {
    setCompanyToDelete({ id: companyId, name: companyName });
    setShowConfirmDialog(true);
  };

  // Handle confirmed deletion
  const handleConfirmedDelete = async () => {
    if (!companyToDelete) return;

    const { id: companyId, name: companyName } = companyToDelete;
    setShowConfirmDialog(false);
    setCompanyToDelete(null);
    setDeletingIds(prev => new Set(prev).add(companyId));

    try {
      // FIXED: Send as FormData instead of JSON
      const formData = new FormData();
      formData.append('company_id', companyId.toString());

      const response = await fetch('https://i-mgmt-official.com/backend/admin/adminHandler.php?action=delete_company', {
        method: 'POST',
        credentials: 'include',
        body: formData  // Send FormData instead of JSON
        // Remove Content-Type header - browser will set it automatically for FormData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success') {
        console.log('✅ Company deleted successfully:', companyName);

        // Show success toast
        success(
          'Unternehmen gelöscht!',
          `${companyName} wurde erfolgreich gelöscht.`,
          4000
        );

        if (onDataUpdate) {
          onDataUpdate();
        } else if (onRefresh) {
          onRefresh();
        }
      } else {
        throw new Error(result.message || 'Fehler beim Löschen des Unternehmens');
      }
    } catch (err) {
      console.error('❌ Delete Error:', err);

      // Show error toast
      showError(
        'Fehler beim Löschen',
        `${companyName} konnte nicht gelöscht werden: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
        6000
      );
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(companyId);
        return newSet;
      });
    }
  };

  // Handle canceled deletion
  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setCompanyToDelete(null);

    if (companyToDelete) {
      warning(
        'Löschvorgang abgebrochen',
        `Das Unternehmen "${companyToDelete.name}" wurde nicht gelöscht.`,
        3000
      );
    }
  };

  const handleCompanyNavigation = async (company: Company) => {
    try {
      const companyData = {
        companyId: company.company_id || company.id,
        departmentId: company.department_id || null, 
        // CHANGED: Store "Support" instead of department_name when department_name is available
        departmentName: company.department_name ? 'Support' : 'No Department', 
        companyName: company.company_name || company.name,
        companyAddress: company.company_address,
        companyCountry: company.company_country,
        companyIndustry: company.company_industry,
        selectedAt: new Date().toISOString(),
      };

      // Check if this company is already selected - but don't show toast
      if (isCompanySelected(company)) {
        console.log('Company already selected:', companyData.companyName);
        return;
      }

      // 🚀 DISPATCH TO REDUX STORE (automatically saves to localStorage too)
      dispatch(setSelectedCompany(companyData));

      console.log('🏢 Company data stored in Redux + localStorage:', companyData);

      // Keep the callback for backward compatibility
      if (onCompanySelect) {
        onCompanySelect(companyData);
      }

    } catch (error) {
      console.error('Error selecting company:', error);
      // Only show error toast for actual errors
      showError(
        'Fehler bei der Auswahl',
        'Das Unternehmen konnte nicht ausgewählt werden. Bitte versuchen Sie es erneut.',
        4000
      );
    }
  };

  // Get unique values for filters
  const uniqueCountries = useMemo(() => {
    const countries = data
      .map(company => company.company_country)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return countries;
  }, [data]);

  const uniqueIndustries = useMemo(() => {
    const industries = data
      .map(company => company.company_industry)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return industries;
  }, [data]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = !selectedCountry || company.company_country === selectedCountry;
      const matchesIndustry = !selectedIndustry || company.company_industry === selectedIndustry;
      const matchesRating = company.rating >= minRating;

      return matchesSearch && matchesCountry && matchesIndustry && matchesRating;
    });

    filtered.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortField) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'rating':
          valueA = a.rating;
          valueB = b.rating;
          break;
        case 'country':
          valueA = (a.company_country || '').toLowerCase();
          valueB = (b.company_country || '').toLowerCase();
          break;
        case 'industry':
          valueA = (a.company_industry || '').toLowerCase();
          valueB = (b.company_industry || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });

    return filtered;
  }, [data, searchTerm, selectedCountry, selectedIndustry, minRating, sortField, sortOrder]);

  // Handle sort change
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedIndustry('');
    setMinRating(0);
    setSortField('name');
    setSortOrder('asc');
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="unternehmen-header">
          <h1 className="">Unternehmen</h1>
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Laden...</span>
          </div>
        </div>
        <div className="skeleton-container">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="skeleton-item">
              <div className="skeleton-header">
                <div className="skeleton-name"></div>
                <div className="skeleton-icons">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-icon"></div>
                </div>
              </div>
              <div className="skeleton-rating"></div>
              <div className="skeleton-details">
                <div className="skeleton-detail-line"></div>
                <div className="skeleton-detail-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Fehler beim Laden</h2>
          <p>{error}</p>
          {onRefresh && (
            <button className="retry-button" onClick={onRefresh}>
              Erneut versuchen
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with title, current selection, and controls */}
      <div className="unternehmen-header">
        <h1>Unternehmen</h1>
        <div className="header-controls">
          {/* Show current selection */}

          {onRefresh && (
            <button className="refresh-btn" onClick={onRefresh} title="Aktualisieren">
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Unternehmen suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="filter-select"
          >
            <option value="">Alle Länder</option>
            {uniqueCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="filter-select"
          >
            <option value="">Alle Branchen</option>
            {uniqueIndustries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>



          <button className="clear-filters-btn" onClick={clearFilters}>
            Filter löschen
          </button>
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="sorting-section">
        <span className="sort-label">Sortieren nach:</span>
        <button
          className={`sort-btn ${sortField === 'name' ? 'active' : ''}`}
          onClick={() => handleSort('name')}
        >
          Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button
          className={`sort-btn ${sortField === 'rating' ? 'active' : ''}`}
          onClick={() => handleSort('rating')}
        >
          Bewertung {sortField === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        {uniqueCountries.length > 0 && (
          <button
            className={`sort-btn ${sortField === 'country' ? 'active' : ''}`}
            onClick={() => handleSort('country')}
          >
            Land {sortField === 'country' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        )}
        {uniqueIndustries.length > 0 && (
          <button
            className={`sort-btn ${sortField === 'industry' ? 'active' : ''}`}
            onClick={() => handleSort('industry')}
          >
            Branche {sortField === 'industry' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        )}
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Listenansicht"
          >
            📋
          </button>
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Rasteransicht"
          >
            ⊞
          </button>
        </div>
      </div>

      {/* No results message */}
      {filteredAndSortedData.length === 0 && !isLoading && (
        <div className="no-results">
          <h3>Keine Ergebnisse gefunden</h3>
          <p>Versuchen Sie, Ihre Filter zu ändern oder den Suchbegriff anzupassen.</p>
          <button className="clear-filters-btn" onClick={clearFilters}>
            Filter zurücksetzen
          </button>
        </div>
      )}

      {/* Companies List with Selection Indicators */}
      <div className={`admin-panel-content-area ${viewMode}`}>
        {filteredAndSortedData.map((company) => {
          const isHidden = isCompanyDataHidden(company.id);
          const isIndividualEyeOff = individualEyeStates[company.id] || false;
          const isDeleting = deletingIds.has(company.id);
          const isCurrentlySelected = isCompanySelected(company);

          return (
            <div
              className={`content-rectangle ${isDeleting ? 'deleting' : ''} ${isCurrentlySelected ? 'selected' : ''}`}
              key={company.id}
            >
              <div className="company-name">
                {getDisplayText(company.name, isHidden)}
                {/* Show selection badge */}
                {isCurrentlySelected && (
                  <span className="selected-badge">✓ Ausgewählt</span>
                )}
                <span className="icons-group">
                  {/* Delete/Trash Icon */}
                  <div
                    className={`hover-icon-container trash-icon-container ${isDeleting ? 'deleting' : ''}`}
                    onClick={() => !isDeleting && showDeleteConfirmation(company.id, company.name)}
                    title="Unternehmen löschen"
                  >
                    {isDeleting ? (
                      <svg className="spinner-icon" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="#ececec" strokeWidth="2" strokeDasharray="15.71" strokeDashoffset="15.71">
                          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.42;15.71 15.71;0 31.42" repeatCount="indefinite" />
                          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.71;-31.42" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g id="_01_align_center" data-name="01 align center">
                          <path fill="#ececec" d="M22,4H17V2a2,2,0,0,0-2-2H9A2,2,0,0,0,7,2V4H2V6H4V21a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V6h2ZM9,2h6V4H9Zm9,19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V6H18Z" />
                          <rect fill="#ececec" x="9" y="10" width="2" height="8" />
                          <rect fill="#ececec" x="13" y="10" width="2" height="8" />
                        </g>
                      </svg>
                    )}
                  </div>

                  {/* Eye Toggle Icon - CHANGED: Now shows correct state based on current visibility */}
                  <div
                    className="hover-icon-container"
                    onClick={() => onIndividualEyeClick(company.id)}
                    title={isHidden ? "Daten anzeigen" : "Daten ausblenden"}
                  >
                    {isHidden ? (
                      <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
                        <path fill="#ececec" d="M23.271,9.419A15.866,15.866,0,0,0,19.9,5.51l2.8-2.8a1,1,0,0,0-1.414-1.414L18.241,4.345A12.054,12.054,0,0,0,12,2.655C5.809,2.655,2.281,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162A15.866,15.866,0,0,0,4.1,18.49l-2.8,2.8a1,1,0,1,0,1.414,1.414l3.052-3.052A12.054,12.054,0,0,0,12,21.345c6.191,0,9.719-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419ZM2.433,13.534a2.918,2.918,0,0,1,0-3.068C3.767,8.3,6.782,4.655,12,4.655A10.1,10.1,0,0,1,16.766,5.82L14.753,7.833a4.992,4.992,0,0,0-6.92,6.92l-2.31,2.31A13.723,13.723,0,0,1,2.433,13.534ZM15,12a3,3,0,0,1-3,3,2.951,2.951,0,0,1-1.285-.3L14.7,10.715A2.951,2.951,0,0,1,15,12ZM9,12a3,3,0,0,1,3-3,2.951,2.951,0,0,1,1.285.3L9.3,13.285A2.951,2.951,0,0,1,9,12Zm12.567,1.534C20.233,15.7,17.218,19.345,12,19.345A10.1,10.1,0,0,1,7.234,18.18l2.013-2.013a4.992,4.992,0,0,0,6.92-6.92l2.31-2.31a13.723,13.723,0,0,1,3.09,3.529A2.918,2.918,0,0,1,21.567,13.534Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" id="Outline" viewBox="0 0 24 24">
                        <path fill="#ececec" d="M23.271,9.419C21.72,6.893,18.192,2.655,12,2.655S2.28,6.893.729,9.419a4.908,4.908,0,0,0,0,5.162C2.28,17.107,5.808,21.345,12,21.345s9.72-4.238,11.271-6.764A4.908,4.908,0,0,0,23.271,9.419Zm-1.705,4.115C20.234,15.7,17.219,19.345,12,19.345S3.766,15.7,2.434,13.534a2.918,2.918,0,0,1,0-3.068C3.766,8.3,6.781,4.655,12,4.655s8.234,3.641,9.566,5.811A2.918,2.918,0,0,1,21.566,13.534Z" />
                        <path fill="#ececec" d="M12,7a5,5,0,1,0,5,5A5.006,5.006,0,0,0,12,7Zm0,8a3,3,0,1,1,3-3A3,3,0,0,1,12,15Z" />
                      </svg>
                    )}
                  </div>

                  {/* Enhanced Navigation Arrow Icon with Selection State */}
                  <div
                    className={`hover-icon-container arrow-icon-container ${isCurrentlySelected ? 'selected' : ''}`}
                    onClick={() => handleCompanyNavigation(company)}
                    title={isCurrentlySelected ?
                      "Bereits als aktives Unternehmen ausgewählt" :
                      "Als aktives Unternehmen für gesamte Website auswählen"
                    }
                  >
                    {isCurrentlySelected ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4CAF50" stroke="#4CAF50" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ececec" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </div>
                </span>
              </div>

              <div className="company-rating">
                {getDisplayRating(company.rating, isHidden)}
              </div>

              {/* Enhanced company details - Only show in grid mode */}
              {viewMode === 'grid' && (company.company_address || company.company_country || company.company_industry) && (
                <div className="company-details">
                  {company.company_address && (
                    <div className="detail-row">
                      <span className="detail-text">
                        {getDisplayText(company.company_address, isHidden)}
                      </span>
                    </div>
                  )}
                  {company.company_country && (
                    <div className="detail-row">
                      <span className="detail-text">
                        {getDisplayText(company.company_country, isHidden)}
                      </span>
                    </div>
                  )}
                  {company.company_industry && (
                    <div className="detail-row">
                      <span className="detail-text">
                        {getDisplayText(company.company_industry, isHidden)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Global eye indicator */}
      {isGlobalEyeOff && (
        <div className="global-eye-notice">
          <p>Alle Daten sind ausgeblendet</p>
        </div>
      )}

      {/* Custom Confirmation Dialog */}
      <ConfirmDialog
        isVisible={showConfirmDialog}
        title="Unternehmen löschen"
        message={`Möchten Sie das Unternehmen "${companyToDelete?.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        onConfirm={handleConfirmedDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ViewUnternehmen;