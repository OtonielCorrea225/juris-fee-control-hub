import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { InvoiceStatus, Currency } from '@/types';
import { Search, FilePlus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoiceStatuses: InvoiceStatus[] = ['pendente', 'em análise', 'pago'];
const currencies: Currency[] = ['BRL', 'USD'];

const Invoices: React.FC = () => {
  const { invoices, lawFirms, contracts, addInvoice, updateInvoice } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    lawFirmId: '',
    contractId: '',
    processNumber: '',
    value: 0,
    currency: 'BRL' as Currency,
    dueDate: '',
    status: 'pendente' as InvoiceStatus,
    documentUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number'
      ? parseFloat(e.target.value) || 0
      : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddButtonClick = () => {
    setFormData({
      lawFirmId: '',
      contractId: '',
      processNumber: '',
      value: 0,
      currency: 'BRL',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pendente',
      documentUrl: '',
    });
    setEditingInvoice(null);
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const handleEditButtonClick = (id: string) => {
    const invoice = invoices.find((invoice) => invoice.id === id);
    if (invoice) {
      setFormData({ ...invoice });
      setEditingInvoice(id);
      setIsDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      // Simulate upload and get URL
      const uploadURL = await uploadFile(selectedFile);
      
      if (editingInvoice) {
        updateInvoice(editingInvoice, { ...formData, documentUrl: uploadURL });
      } else {
        addInvoice({ ...formData, documentUrl: uploadURL });
      }
    } else {
      if (editingInvoice) {
        updateInvoice(editingInvoice, formData);
      } else {
        addInvoice(formData);
      }
    }

    setIsDialogOpen(false);
  };

  const uploadFile = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://example.com/uploaded/' + file.name);
      }, 1000);
    });
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const lawFirm = lawFirms.find((firm) => firm.id === invoice.lawFirmId);
    const contract = contracts.find((c) => c.id === invoice.contractId);

    if (!lawFirm || !contract) return false;

    return (
      lawFirm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.processNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Faturas</h1>
        <Button onClick={handleAddButtonClick}>
          <FilePlus className="mr-2 h-4 w-4" />
          Nova Fatura
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Buscar faturas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por escritório, contrato, número do processo ou status..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Faturas Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              Nenhuma fatura encontrada.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Escritório</TableHead>
                    <TableHead className="text-left">Contrato</TableHead>
                    <TableHead className="text-left">Número do Processo</TableHead>
                    <TableHead className="text-left">Valor</TableHead>
                    <TableHead className="text-left">Moeda</TableHead>
                    <TableHead className="text-left">Vencimento</TableHead>
                    <TableHead className="text-left">Status</TableHead>
                    <TableHead className="text-left">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => {
                    const lawFirm = lawFirms.find((firm) => firm.id === invoice.lawFirmId);
                    const contract = contracts.find((c) => c.id === invoice.contractId);

                    return (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{lawFirm?.name}</TableCell>
                        <TableCell>{contract?.serviceType}</TableCell>
                        <TableCell>{invoice.processNumber}</TableCell>
                        <TableCell>{formatCurrency(invoice.value, invoice.currency)}</TableCell>
                        <TableCell>{invoice.currency}</TableCell>
                        <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditButtonClick(invoice.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingInvoice ? 'Editar Fatura' : 'Nova Fatura'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="lawFirmId">Escritório / Advogado</Label>
                <Select
                  value={formData.lawFirmId}
                  onValueChange={(value) => handleSelectChange('lawFirmId', value)}
                >
                  <SelectTrigger id="lawFirmId">
                    <SelectValue placeholder="Selecione um escritório" />
                  </SelectTrigger>
                  <SelectContent>
                    {lawFirms.map((firm) => (
                      <SelectItem key={firm.id} value={firm.id}>{firm.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contractId">Contrato</Label>
                <Select
                  value={formData.contractId}
                  onValueChange={(value) => handleSelectChange('contractId', value)}
                >
                  <SelectTrigger id="contractId">
                    <SelectValue placeholder="Selecione um contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    {contracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>{contract.serviceType}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="processNumber">Número do Processo</Label>
                <Input
                  id="processNumber"
                  name="processNumber"
                  value={formData.processNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Valor da Fatura</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="currency">Moeda</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Selecione a moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoiceStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">Documento</Label>
                <Input
                  id="document"
                  name="document"
                  type="file"
                  onChange={handleFileChange}
                />
                {selectedFile && (
                  <div className="mt-2">
                    Arquivo selecionado: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingInvoice ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
