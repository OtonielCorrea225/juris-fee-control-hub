
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const AppSidebarUserActions: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="px-3 py-2 mt-auto">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-sidebar-foreground/90">
          {user?.name || user?.email}
        </div>
        <Button 
          variant="outline" 
          className="w-full border-sidebar-border text-sidebar-foreground text-sm"
          onClick={logout}
        >
          Sair
        </Button>
      </div>
    </div>
  );
};

export default AppSidebarUserActions;
