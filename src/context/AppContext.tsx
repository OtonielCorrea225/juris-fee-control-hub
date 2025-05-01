import React, { createContext, useContext, useState } from 'react';
import { LawFirm, Contract, Invoice, Currency } from '@/types';
import { mockLawFirms, mockContracts, mockInvoices } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  lawFirms: LawFirm[];
  contracts: Contract[];
  invoices: Invoice[];
  addLawFirm: (lawFirm: Omit<LawFirm, 'id'>) => void;
  updateLawFirm: (id: string, lawFirm: Partial<LawFirm>) => void;
  addContract: (contract: Omit<Contract, 'id'>) => void;
  updateContract: (id: string, contract: Partial<Contract>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  getLawFirmById: (id: string) => LawFirm | undefined;
  getContractById: (id: string) => Contract | undefined;
  getInvoiceById: (id: string) => Invoice | undefined;
  getContractsByLawFirmId: (lawFirmId: string) => Contract[];
  getInvoicesByLawFirmId: (lawFirmId: string) => Invoice[];
  getInvoicesByContractId: (contractId: string) => Invoice[];
  getTotalByCurrency: (currency: Currency) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Update initial state to include currency in mockData
  const [lawFirms, setLawFirms] = useState<LawFirm[]>(mockLawFirms);
  const [contracts, setContracts] = useState<Contract[]>(
    mockContracts.map(contract => ({ ...contract, currency: contract.currency || 'BRL' }))
  );
  const [invoices, setInvoices] = useState<Invoice[]>(
    mockInvoices.map(invoice => ({ ...invoice, currency: invoice.currency || 'BRL' }))
  );

  const addLawFirm = (lawFirm: Omit<LawFirm, 'id'>) => {
    const newLawFirm = {
      ...lawFirm,
      id: Math.random().toString(36).substr(2, 9),
    };
    setLawFirms([...lawFirms, newLawFirm]);
    toast({
      title: "Escritório adicionado",
      description: `${newLawFirm.name} foi adicionado com sucesso.`,
    });
  };

  const updateLawFirm = (id: string, lawFirm: Partial<LawFirm>) => {
    setLawFirms(
      lawFirms.map((firm) =>
        firm.id === id ? { ...firm, ...lawFirm } : firm
      )
    );
    toast({
      title: "Escritório atualizado",
      description: "Os dados do escritório foram atualizados com sucesso.",
    });
  };

  const addContract = (contract: Omit<Contract, 'id'>) => {
    const newContract = {
      ...contract,
      id: Math.random().toString(36).substr(2, 9),
    };
    setContracts([...contracts, newContract]);
    toast({
      title: "Contrato adicionado",
      description: "O contrato foi adicionado com sucesso.",
    });
  };

  const updateContract = (id: string, contract: Partial<Contract>) => {
    setContracts(
      contracts.map((c) =>
        c.id === id ? { ...c, ...contract } : c
      )
    );
    toast({
      title: "Contrato atualizado",
      description: "Os dados do contrato foram atualizados com sucesso.",
    });
  };

  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice = {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvoices([...invoices, newInvoice]);
    toast({
      title: "Fatura adicionada",
      description: "A fatura foi adicionada com sucesso.",
    });
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === id ? { ...inv, ...invoice } : inv
      )
    );
    toast({
      title: "Fatura atualizada",
      description: "Os dados da fatura foram atualizados com sucesso.",
    });
  };

  const getLawFirmById = (id: string) => lawFirms.find((firm) => firm.id === id);
  
  const getContractById = (id: string) => contracts.find((contract) => contract.id === id);
  
  const getInvoiceById = (id: string) => invoices.find((invoice) => invoice.id === id);
  
  const getContractsByLawFirmId = (lawFirmId: string) => 
    contracts.filter((contract) => contract.lawFirmId === lawFirmId);
  
  const getInvoicesByLawFirmId = (lawFirmId: string) => 
    invoices.filter((invoice) => invoice.lawFirmId === lawFirmId);
  
  const getInvoicesByContractId = (contractId: string) => 
    invoices.filter((invoice) => invoice.contractId === contractId);

  const getTotalByCurrency = (currency: Currency): number => {
    return invoices
      .filter(invoice => invoice.status === 'pago' && invoice.currency === currency)
      .reduce((total, invoice) => total + invoice.value, 0);
  };

  return (
    <AppContext.Provider
      value={{
        lawFirms,
        contracts,
        invoices,
        addLawFirm,
        updateLawFirm,
        addContract,
        updateContract,
        addInvoice,
        updateInvoice,
        getLawFirmById,
        getContractById,
        getInvoiceById,
        getContractsByLawFirmId,
        getInvoicesByLawFirmId,
        getInvoicesByContractId,
        getTotalByCurrency,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
