
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Search, Receipt, Edit, Upload } from 'lucide-react';
import { InvoiceStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

const invoiceStatuses: InvoiceStatus[] = ['pendente', 'em análise', 'pago'];

const statusColors = {
  'pendente': 'bg-yellow-100 text-yellow-800',
  'em análise': 'bg-blue-100 text-blue-800',
  'pago': 'bg-green-100 text-green-800',
};

const Invoices: React.FC = () => {
  const { invoices, contracts, lawFirms, addInvoice, updateInvoice } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingInvoice, setEditingInvoice] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    lawFirmId: '',
    contractId: '',
    processNumber: '',
    value: 0,
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
    const newFormData = { ...formData, [name]: value };
    
    // If changing the lawFirmId, reset the contractId
    if (name === 'lawFirmId') {
      newFormData.contractId = '';
    }
    
    setFormData(newFormData);
  };

  const handleAddButtonClick = () => {
    setFormData({
      lawFirmId: '',
      contractId: '',
      processNumber: '',
      value: 0,
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pendente',
      documentUrl: '',
    });
    setEditingInvoice(null);
    setIsDialogOpen(true);
  };

  const handleEditButtonClick = (id: string) => {
    const invoice = invoices.find((invoice) => invoice.id === id);
    if (invoice) {
      setFormData({ 
        ...invoice,
        // Handle optional fields
        processNumber: invoice.processNumber || '',
        documentUrl: invoice.documentUrl || '',
      });
      setEditingInvoice(id);
      setIsDialogOpen(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // For this demo, we're not actually uploading the file, just storing its name
      const fileName = e.target.files[0].name;
      setFormData({ ...formData, documentUrl: fileName });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice) {
      updateInvoice(editingInvoice, formData);
    } else {
      addInvoice(formData);
    }
    setIsDialogOpen(false);
  };

  const handleViewDocument = (documentUrl: string) => {
    setCurrentDocument(documentUrl);
    setIsDocumentViewerOpen(true);
  };

  const activeLawFirms = lawFirms.filter(firm => firm.status === 'ativo');
  
  const availableContracts = contracts.filter(contract => 
    contract.lawFirmId === formData.lawFirmId
  );

  const filteredInvoices = invoices.filter((invoice) => {
    const lawFirm = lawFirms.find((firm) => firm.id === invoice.lawFirmId);
    const contract = contracts.find((c) => c.id === invoice.contractId);
    
    if (!lawFirm) return false;
    
    return (
      lawFirm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.processNumber && invoice.processNumber.includes(searchTerm)) ||
      (contract && contract.serviceType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.status.includes(searchTerm.toLowerCase())
    );
  });

  const getStatusBadgeVariant = (status: InvoiceStatus) => {
    switch (status) {
      case 'pendente': return 'warning';
      case 'em análise': return 'secondary';
      case 'pago': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Honorários</h1>
        <Button onClick={handleAddButtonClick}>
          <Receipt className="mr-2 h-4 w-4" />
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
                placeholder="Buscar por escritório, número de processo ou status..."
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
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Escritório</th>
                    <th className="text-left py-3 px-4">Processo Nº</th>
                    <th className="text-left py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Vencimento</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Documento</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const lawFirm = lawFirms.find((firm) => firm.id === invoice.lawFirmId);
                    return (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{lawFirm?.name}</td>
                        <td className="py-3 px-4">{invoice.processNumber || '-'}</td>
                        <td className="py-3 px-4">{formatCurrency(invoice.value)}</td>
                        <td className="py-3 px-4">{formatDate(invoice.dueDate)}</td>
                        <td className="py-3 px-4">
                          <Badge variant={getStatusBadgeVariant(invoice.status) as any}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {invoice.documentUrl ? (
                            <Button variant="outline" size="sm" onClick={() => handleViewDocument(invoice.documentUrl!)}>
                              <Upload className="h-3 w-3 mr-1" /> Ver
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">Não anexado</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditButtonClick(invoice.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
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

      {/* Invoice Form Dialog */}
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
                    {activeLawFirms.map((firm) => (
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
                  disabled={!formData.lawFirmId}
                >
                  <SelectTrigger id="contractId">
                    <SelectValue placeholder={
                      formData.lawFirmId 
                        ? availableContracts.length 
                          ? "Selecione um contrato" 
                          : "Não há contratos para este escritório"
                        : "Selecione um escritório primeiro"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableContracts.map((contract) => (
                      <SelectItem key={contract.id} value={contract.id}>
                        {`${contract.serviceType} - ${formatCurrency(contract.value)}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="processNumber">Número do Processo (opcional)</Label>
                <Input
                  id="processNumber"
                  name="processNumber"
                  value={formData.processNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Valor</Label>
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
              {editingInvoice && (
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
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="document">Documento / Fatura (opcional)</Label>
                <Input
                  id="document"
                  name="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {formData.documentUrl && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Documento atual: {formData.documentUrl}
                  </p>
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

      {/* Document Viewer Dialog */}
      <Dialog open={isDocumentViewerOpen} onOpenChange={setIsDocumentViewerOpen}>
        <DialogContent className="sm:max-w-[90%] h-[80vh]">
          <DialogHeader>
            <DialogTitle>Visualização do Documento</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center h-full">
            {currentDocument && (
              <>
                {currentDocument.endsWith('.pdf') ? (
                  <iframe 
                    src={`data:application/pdf;base64,${currentDocument}`} 
                    className="w-full h-full border rounded-md"
                    title="Documento PDF"
                  />
                ) : (
                  <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                    <img 
                      src={currentDocument} 
                      alt="Documento" 
                      className="max-w-full max-h-[60vh] object-contain border rounded-md shadow-md" 
                    />
                    <p className="mt-4 text-muted-foreground">
                      {currentDocument.split('/').pop()}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocumentViewerOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Invoices;
