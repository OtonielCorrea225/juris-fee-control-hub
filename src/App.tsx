
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LawFirms from "./pages/LawFirms";
import Contracts from "./pages/Contracts";
import Invoices from "./pages/Invoices";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AppLayout from "./components/layout/AppLayout";
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    // Return loading state
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  return isAuthenticated ? (
    <>{element}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/juris-fee-control-hub">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={
              <ProtectedRoute element={
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
              } />
            } />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
