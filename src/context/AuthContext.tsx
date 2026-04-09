import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { apiClient } from "../utils/api";

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (apiClient.hasAuthToken()) {
        try {
          setIsLoading(true);
          const response = await apiClient.get<User>("/auth/me");
          setUser(response);
        } catch (err) {
          apiClient.clearAuthToken();
          setError("Session expired. Please sign in again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<{ access_token: string; user: User }>("/auth/login", {
        email,
        password,
      });

      apiClient.setAuthToken(response.access_token);
      setUser(response.user);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<{ access_token: string; user: User }>("/auth/register", {
        email,
        password,
        name,
      });

      apiClient.setAuthToken(response.access_token);
      setUser(response.user);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.clearAuthToken();
    setUser(null);
    setError(null);
  }, []);

  const continueAsGuest = useCallback(() => {
    apiClient.setAuthToken("guest");
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    continueAsGuest,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
