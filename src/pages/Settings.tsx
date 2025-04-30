
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Lock, User, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PermissionSetting {
  id: string;
  name: string;
  description: string;
  admin: boolean;
  user: boolean;
}

const Settings: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionSetting[]>([
    {
      id: 'manage_firms',
      name: 'Gerenciar Escritórios',
      description: 'Adicionar, editar e inativar escritórios/advogados',
      admin: true,
      user: false,
    },
    {
      id: 'manage_contracts',
      name: 'Gerenciar Contratos',
      description: 'Adicionar e editar contratos',
      admin: true,
      user: false,
    },
    {
      id: 'manage_invoices',
      name: 'Gerenciar Faturas',
      description: 'Adicionar e editar faturas',
      admin: true,
      user: true,
    },
    {
      id: 'view_dashboard',
      name: 'Visualizar Dashboard',
      description: 'Acesso ao painel de controle e relatórios',
      admin: true,
      user: true,
    },
    {
      id: 'change_status',
      name: 'Alterar Status',
      description: 'Alterar status de faturas (pendente, em análise, pago)',
      admin: true,
      user: false,
    },
  ]);

  const handleTogglePermission = (role: 'admin' | 'user', id: string) => {
    const newPermissions = permissions.map(permission => 
      permission.id === id 
        ? { ...permission, [role]: !permission[role] }
        : permission
    );
    setPermissions(newPermissions);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As permissões foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <CardTitle>Permissões de Acesso</CardTitle>
          </div>
          <CardDescription>
            Configure as permissões para cada tipo de usuário no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 pb-4 border-b">
              <div className="col-span-1">
                <h3 className="text-sm font-medium">Funcionalidade</h3>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Administrador</h3>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <h3 className="text-sm font-medium">Usuário Comum</h3>
                </div>
              </div>
            </div>

            {permissions.map((permission) => (
              <div key={permission.id} className="grid grid-cols-3 gap-4 py-4 border-b last:border-0">
                <div className="col-span-1">
                  <Label>{permission.name}</Label>
                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                </div>
                <div className="flex items-center justify-center">
                  <Switch
                    checked={permission.admin}
                    onCheckedChange={() => handleTogglePermission('admin', permission.id)}
                    disabled={permission.id === 'manage_firms' || permission.id === 'manage_contracts'}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Switch
                    checked={permission.user}
                    onCheckedChange={() => handleTogglePermission('user', permission.id)}
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <Button onClick={handleSaveSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Salvar Configurações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
