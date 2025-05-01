
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { LawFirm, Contract, Invoice, InvoiceStatus } from '@/types';
import { DollarSign, ReceiptIcon, FileText, BriefcaseIcon } from 'lucide-react';
import DollarFeesCard from '@/components/dashboard/DollarFeesCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
const STATUS_COLORS: Record<InvoiceStatus, string> = {
  'pendente': '#FFBB28',
  'em análise': '#0088FE',
  'pago': '#00C49F'
};

const Dashboard: React.FC = () => {
  const { lawFirms, contracts, invoices, getTotalByCurrency } = useAppContext();
  
  const activeLawFirms = lawFirms.filter(firm => firm.status === 'ativo').length;
  const totalActiveContracts = contracts.length;
  const totalPendingInvoices = invoices.filter(invoice => invoice.status === 'pendente').length;
  
  const totalPaid = getTotalByCurrency('BRL');
  
  const totalInvoicesByStatus = [
    { name: 'Pendente', value: invoices.filter((i) => i.status === 'pendente').length },
    { name: 'Em Análise', value: invoices.filter((i) => i.status === 'em análise').length },
    { name: 'Pago', value: invoices.filter((i) => i.status === 'pago').length },
  ];

  const activeContracts = contracts.filter(
    (contract) => new Date(contract.endDate) >= new Date()
  );

  const totalByLawFirm = lawFirms
    .filter((firm) => firm.status === 'ativo')
    .map((firm) => {
      const firmInvoices = invoices.filter((i) => i.lawFirmId === firm.id && i.status === 'pago');
      const total = firmInvoices.reduce((sum, i) => sum + i.value, 0);
      return {
        name: firm.name.split(' ')[0],
        value: total,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const pendingInvoices = invoices
    .filter((invoice) => invoice.status === 'pendente')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Honorários Pagos
            </CardTitle>
            <ReceiptIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de honorários pagos em BRL
            </p>
          </CardContent>
        </Card>
        
        <DollarFeesCard />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Escritórios Ativos
            </CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLawFirms}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Escritórios e advogados cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturas Pendentes
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPendingInvoices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Faturas aguardando pagamento
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Faturas por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalInvoicesByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {totalInvoicesByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} faturas`, 'Quantidade']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pagamentos por Escritório</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={totalByLawFirm}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Total Pago']} />
                <Legend />
                <Bar dataKey="value" name="Valor Pago" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingInvoices.length === 0 ? (
            <p className="text-muted-foreground">Não há faturas pendentes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Escritório</th>
                    <th className="text-left py-3 px-4">Vencimento</th>
                    <th className="text-left py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvoices.map((invoice) => {
                    const lawFirm = lawFirms.find((firm) => firm.id === invoice.lawFirmId);
                    return (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{lawFirm?.name}</td>
                        <td className="py-3 px-4">
                          {new Date(invoice.dueDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">{formatCurrency(invoice.value, invoice.currency)}</td>
                        <td className="py-3 px-4">
                          <span 
                            className="px-2 py-1 rounded text-xs font-medium" 
                            style={{ backgroundColor: STATUS_COLORS[invoice.status] + '30', color: STATUS_COLORS[invoice.status] }}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
