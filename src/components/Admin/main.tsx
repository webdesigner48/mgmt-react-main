// AdminHome.tsx
import React, { useState, useEffect } from 'react';
import './_main/css/main.css';
import AdminPanel from './_main/components/home';
import Sidebar from './_main/include/sidebar';
import adminHandler from '../../server/adminHandler';
import './../../alert/css/toast.css';

interface AdminHomeProps {
  isVisible: boolean;
  onClose: () => void;
}

export type ViewType = "Unternehmen" | "Rangliste" | "Präsentation" | "Backoffice";

const AdminHome: React.FC<AdminHomeProps> = ({ isVisible, onClose }) => {
  const [activeView, setActiveView] = useState<ViewType>("Unternehmen");
  const [isAnimating, setIsAnimating] = useState(false);
  const [companyData, setCompanyData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch company data from your PHP backend

  const fetchCompanyData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${adminHandler.BASE_URL}${adminHandler.API_ENDPOINTS.Unternehmen}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 'success' && result.data) {
        // Transform backend data to match your existing format + new department fields
        const transformedData = result.data.map((company: any) => ({
          // Keep your existing format for compatibility
          id: company.company_id,
          name: company.company_name,
          rating: company.company_rating || 0,

          // Add new fields for enhanced functionality
          company_id: company.company_id,
          company_name: company.company_name,
          company_address: company.company_address,
          company_country: company.company_country,
          company_industry: company.company_industry,
          company_field: company.company_field,
          company_rating: company.company_rating,

          // NEW: Add department fields
          department_id: company.department_id,
          department_name: company.department_name,
        }));

        setCompanyData(transformedData);
        console.log('✅ Loaded company data with departments:', transformedData);
      } else {
        console.error('❌ API Error:', result.message);
        setCompanyData([]);
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error);
      setCompanyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      // Fetch data when modal opens
      fetchCompanyData();
    } else {
      setIsAnimating(false);
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  // Don't render if not visible and not animating
  if (!isVisible && !isAnimating) return null;

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
  };

  const handleClose = () => {
    setIsAnimating(false);
    // Delay actual close to allow fade-out animation
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`admin-home-overlay ${isVisible && isAnimating ? 'fade-in' : 'fade-out'}`}
      onClick={(e) => {
        // Close modal when clicking on overlay (but not on modal content)
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className={`admin-home-modal ${isVisible && isAnimating ? 'modal-fade-in' : 'modal-fade-out'}`}>
        <div className="admin-home-content">
          <Sidebar onViewChange={handleViewChange} />
          <AdminPanel
            activeView={activeView}
            data={companyData}
            onClose={handleClose}
            onDataUpdate={fetchCompanyData}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;