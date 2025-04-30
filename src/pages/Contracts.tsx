
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Search, FileText, Edit } from 'lucide-react';
import { ContractType } from '@/types';

const contractTypes: ContractType[] = [
  'Consultivo',
  'Contencioso',
  'Trabalhista',
  'Tributário',
  'Societário',
  'Outro'
];

const Contracts: React.FC = () => {
  const { contracts, lawFirms, addContract, updateContract } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingContract, setEditingContract] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    lawFirmId: '',
    serviceType: 'Consultivo' as ContractType,
    value: 0,
    startDate: '',
    endDate: '',
    department: '',
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

  const handleAddButtonClick = () => {
    setFormData({
      lawFirmId: '',
      serviceType: 'Consultivo',
      value: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      department: '',
    });
    setEditingContract(null);
    setIsDialogOpen(true);
  };

  const handleEditButtonClick = (id: string) => {
    const contract = contracts.find((contract) => contract.id === id);
    if (contract) {
      setFormData({ ...contract });
      setEditingContract(id);
      setIsDialogOpen(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingContract) {
      updateContract(editingContract, formData);
    } else {
      addContract(formData);
    }
    setIsDialogOpen(false);
  };

  const activeLawFirms = lawFirms.filter(firm => firm.status === 'ativo');

  const filteredContracts = contracts.filter((contract) => {
    const lawFirm = lawFirms.find((firm) => firm.id === contract.lawFirmId);
    
    if (!lawFirm) return false;
    
    return (
      lawFirm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Contratos</h1>
        <Button onClick={handleAddButtonClick}>
          <FileText className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Buscar contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por escritório, tipo de serviço ou departamento..."
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
          <CardTitle>Contratos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              Nenhum contrato encontrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Escritório</th>
                    <th className="text-left py-3 px-4">Tipo de Serviço</th>
                    <th className="text-left py-3 px-4">Valor</th>
                    <th className="text-left py-3 px-4">Início</th>
                    <th className="text-left py-3 px-4">Término</th>
                    <th className="text-left py-3 px-4">Departamento</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContracts.map((contract) => {
                    const lawFirm = lawFirms.find((firm) => firm.id === contract.lawFirmId);
                    return (
                      <tr key={contract.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{lawFirm?.name}</td>
                        <td className="py-3 px-4">{contract.serviceType}</td>
                        <td className="py-3 px-4">{formatCurrency(contract.value)}</td>
                        <td className="py-3 px-4">{formatDate(contract.startDate)}</td>
                        <td className="py-3 px-4">{formatDate(contract.endDate)}</td>
                        <td className="py-3 px-4">{contract.department}</td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditButtonClick(contract.id)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingContract ? 'Editar Contrato' : 'Novo Contrato'}
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
                <Label htmlFor="serviceType">Tipo de Serviço</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleSelectChange('serviceType', value)}
                >
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Selecione o tipo de serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="value">Valor do Contrato</Label>
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
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Departamento Solicitante</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingContract ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contracts;
