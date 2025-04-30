
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, FileText, Receipt, Settings } from 'lucide-react';

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Escritórios",
    path: "/escritorios",
    icon: Users,
  },
  {
    title: "Contratos",
    path: "/contratos",
    icon: FileText,
  },
  {
    title: "Honorários",
    path: "/honorarios",
    icon: Receipt,
  },
  {
    title: "Configurações",
    path: "/configuracoes",
    icon: Settings,
  },
];

const AppSidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-sidebar-foreground">
          <FileText className="h-6 w-6" />
          <span className="font-bold">Honorários Jurídicos</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
