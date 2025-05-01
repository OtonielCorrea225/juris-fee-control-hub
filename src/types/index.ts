
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type LawFirmStatus = 'ativo' | 'inativo';

export interface LawFirm {
  id: string;
  name: string;
  document: string; // CNPJ or CPF
  email: string;
  phone: string;
  area: string;
  status: LawFirmStatus;
}

export type ContractType = 
  | 'Consultivo' 
  | 'Contencioso' 
  | 'Trabalhista' 
  | 'Tributário' 
  | 'Societário' 
  | 'Outro';

export type Currency = 'BRL' | 'USD';

export interface Contract {
  id: string;
  lawFirmId: string;
  serviceType: ContractType;
  value: number;
  currency: Currency;
  startDate: string;
  endDate: string;
  department: string;
}

export type InvoiceStatus = 'pendente' | 'em análise' | 'pago';

export interface Invoice {
  id: string;
  lawFirmId: string;
  contractId: string;
  processNumber?: string;
  value: number;
  currency: Currency;
  dueDate: string;
  status: InvoiceStatus;
  documentUrl?: string;
  createdAt: string;
}
