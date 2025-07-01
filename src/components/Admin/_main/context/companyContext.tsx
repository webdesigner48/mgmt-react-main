// 1. First, create a Context for company data
// CompanyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CompanyContextData {
  companyId: number | string;
  departmentId: number | string;
  departmentName: string;
  companyName: string;
}

interface CompanyContextType {
  selectedCompany: CompanyContextData | null;
  setSelectedCompany: (company: CompanyContextData) => void;
  clearSelectedCompany: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState<CompanyContextData | null>(null);

  const clearSelectedCompany = () => {
    setSelectedCompany(null);
  };

  return (
    <CompanyContext.Provider value={{
      selectedCompany,
      setSelectedCompany,
      clearSelectedCompany
    }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};
