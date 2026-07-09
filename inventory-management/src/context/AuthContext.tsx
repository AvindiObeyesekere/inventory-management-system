import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, LoginCredentials, RegisterCredentials } from '@/features/auth/types';
import { authService } from '@/features/auth/services';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

  const login = async (credentials: LoginCredentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };

  const register = async (credentials: RegisterCredentials) => {
    const newUser = await authService.register(credentials);
    // Auto-login after registration
    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as any).password;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    authService.logout(); // Clear session to force manual login
    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
