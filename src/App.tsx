
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LawFirms from "./pages/LawFirms";
import Contracts from "./pages/Contracts";
import Invoices from "./pages/Invoices";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/layout/AppLayout";
import { AppProvider } from './context/AppContext';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/escritorios" element={<LawFirms />} />
              <Route path="/contratos" element={<Contracts />} />
              <Route path="/honorarios" element={<Invoices />} />
              <Route path="/configuracoes" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
