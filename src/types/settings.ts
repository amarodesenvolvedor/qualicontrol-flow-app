
export interface CompanySettings {
  id?: string;
  companyname: string; // Changed from companyName to match DB
  cnpj: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  email: string;
  phone: string;
  createdat?: string; // Changed from createdAt to match DB
  updatedat?: string; // Changed from updatedAt to match DB
}

export interface UserPreferences {
  emailnotifications: boolean; // Changed from emailNotifications to match DB
  systemnotifications: boolean; // Changed from systemNotifications to match DB
  darkmode: boolean; // Changed from darkMode to match DB
}
