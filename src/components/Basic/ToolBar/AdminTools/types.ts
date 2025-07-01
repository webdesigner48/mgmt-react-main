// types.ts
export interface CompanyDataFormData {
  companyName: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  province: string;
  region?: string;
  country: string;
  taxid?: string;
  industry: string;
  businessField: string;
  earliestStartTime?: string;
  latestEndTime?: string;
  dailyWorkingTime: string;
  dailyBreakTime: string;
}

export type FormSection = 'company' | 'industry' | 'worktime' | 'design' | 'departments' | 'processes';