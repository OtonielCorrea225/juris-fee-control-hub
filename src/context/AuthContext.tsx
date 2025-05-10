
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, RegisterCredentials } from '@/types/auth';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface StoredUser {
  email: string;
  password: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial users for demonstration purposes
const INITIAL_USERS: StoredUser[] = [
  { email: 'admin@example.com', password: 'password123', name: 'Administrador' },
  { email: 'user@example.com', password: 'password123', name: 'Usuário' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize stored users if they don't exist
    if (!localStorage.getItem('storedUsers')) {
      localStorage.setItem('storedUsers', JSON.stringify(INITIAL_USERS));
    }

    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const getStoredUsers = (): StoredUser[] => {
    const storedUsers = localStorage.getItem('storedUsers');
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error('Failed to parse stored users', error);
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching credentials
      const users = getStoredUsers();
      const foundUser = users.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!foundUser) {
        throw new Error('Credenciais inválidas');
      }
      
      // Create authenticated user object (without password)
      const authUser: AuthUser = {
        email: foundUser.email,
        name: foundUser.name
      };
      
      // Store user in state and localStorage
      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${authUser.name || authUser.email}!`,
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Falha ao fazer login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = getStoredUsers();

      // Check if email already exists
      if (users.some(u => u.email === credentials.email)) {
        throw new Error('E-mail já cadastrado');
      }
      
      // Add new user to the list
      const newUser: StoredUser = {
        email: credentials.email,
        password: credentials.password,
        name: credentials.name,
      };
      
      const updatedUsers = [...users, newUser];
      
      // Update local storage
      localStorage.setItem('storedUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Você já pode fazer login com suas credenciais.",
      });
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Falha ao cadastrar",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('authUser');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
