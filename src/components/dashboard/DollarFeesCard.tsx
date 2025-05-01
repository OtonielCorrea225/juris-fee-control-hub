
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { DollarSign } from 'lucide-react';

const DollarFeesCard: React.FC = () => {
  const { invoices, getTotalByCurrency } = useAppContext();

  const totalUSD = getTotalByCurrency('USD');
  const paidInvoicesCount = invoices.filter(invoice => invoice.status === 'pago' && invoice.currency === 'USD').length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Honorários Pagos em Dólares
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalUSD, 'USD')}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {paidInvoicesCount} fatura{paidInvoicesCount !== 1 ? 's' : ''} paga{paidInvoicesCount !== 1 ? 's' : ''}
        </p>
      </CardContent>
    </Card>
  );
};

export default DollarFeesCard;
