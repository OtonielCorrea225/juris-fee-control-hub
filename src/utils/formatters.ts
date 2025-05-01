
export const formatCurrency = (value: number, currency: string = 'BRL'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatCPFCNPJ = (document: string): string => {
  // Remove non-numeric characters
  const numbers = document.replace(/\D/g, '');
  
  // Check if it's a CPF (11 digits) or CNPJ (14 digits)
  if (numbers.length === 11) {
    // Format as CPF: 123.456.789-01
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (numbers.length === 14) {
    // Format as CNPJ: 12.345.678/0001-90
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  // Return as is if it doesn't match CPF or CNPJ length
  return document;
};
