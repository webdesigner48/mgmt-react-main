export interface Company {
  id: number;
  name: string;
  rating: number;
  company_address?: string;
  company_country?: string;
  company_industry?: string;
  company_field?: string;
  company_id?: number;
  company_name?: string;
}

export interface SelectedCompanyData {
  companyId: number;
  departmentId: number;
  departmentName: string;
  companyName: string;
  companyAddress?: string;
  companyCountry?: string;
  companyIndustry?: string;
  selectedAt: string; // timestamp
}