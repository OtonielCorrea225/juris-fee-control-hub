
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCPFCNPJ } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';
import { LawFirmStatus } from '@/types';
import { Search, UserPlus, Edit, CheckCircle, XCircle } from 'lucide-react';

const LawFirms: React.FC = () => {
  const { lawFirms, addLawFirm, updateLawFirm } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFirm, setEditingFirm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    area: '',
    status: 'ativo' as LawFirmStatus,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleAddButtonClick = () => {
    setFormData({
      name: '',
      document: '',
      email: '',
      phone: '',
      area: '',
      status: 'ativo',
    });
    setEditingFirm(null);
    setIsDialogOpen(true);
  };

  const handleEditButtonClick = (id: string) => {
    const firm = lawFirms.find((firm) => firm.id === id);
    if (firm) {
      setFormData({ 
        name: firm.name,
        document: firm.document,
        email: firm.email,
        phone: firm.phone,
        area: firm.area,
        status: firm.status
      });
      setEditingFirm(id);
      setIsDialogOpen(true);
    }
  };

  const handleStatusToggle = (id: string, currentStatus: 'ativo' | 'inativo') => {
    updateLawFirm(id, { status: currentStatus === 'ativo' ? 'inativo' : 'ativo' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFirm) {
      updateLawFirm(editingFirm, formData);
    } else {
      addLawFirm(formData);
    }
    setIsDialogOpen(false);
  };

  const filteredLawFirms = lawFirms.filter((firm) => 
    firm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.document.includes(searchTerm) ||
    firm.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    firm.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Escritórios e Advogados</h1>
        <Button onClick={handleAddButtonClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Buscar escritórios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, documento, e-mail ou área..."
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
          <CardTitle>Escritórios e Advogados Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLawFirms.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              Nenhum escritório encontrado.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Documento</th>
                    <th className="text-left py-3 px-4">E-mail</th>
                    <th className="text-left py-3 px-4">Telefone</th>
                    <th className="text-left py-3 px-4">Área</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLawFirms.map((firm) => (
                    <tr key={firm.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{firm.name}</td>
                      <td className="py-3 px-4">{formatCPFCNPJ(firm.document)}</td>
                      <td className="py-3 px-4">{firm.email}</td>
                      <td className="py-3 px-4">{firm.phone}</td>
                      <td className="py-3 px-4">{firm.area}</td>
                      <td className="py-3 px-4">
                        <Badge variant={firm.status === 'ativo' ? 'default' : 'secondary'}>
                          {firm.status === 'ativo' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditButtonClick(firm.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleStatusToggle(firm.id, firm.status)}
                        >
                          {firm.status === 'ativo' ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
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
              {editingFirm ? 'Editar Escritório' : 'Adicionar Escritório'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="document">CNPJ / CPF</Label>
                <Input
                  id="document"
                  name="document"
                  value={formData.document}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="area">Área de Atuação</Label>
                <Input
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {editingFirm && (
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
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingFirm ? 'Salvar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LawFirms;
