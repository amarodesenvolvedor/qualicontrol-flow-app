
export interface CompanySettings {
  id?: string;
  companyName: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  cep: string;
  email: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPreferences {
  emailNotifications: boolean;
  systemNotifications: boolean;
  darkMode: boolean;
}
