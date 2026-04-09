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
  /** True after initial session check (valid token verified or no token). */
  authReady: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const raw = localStorage.getItem("auth_token");
      if (raw === "guest") {
        apiClient.clearAuthToken();
        setAuthReady(true);
        return;
      }
      if (!apiClient.hasAuthToken()) {
        setAuthReady(true);
        return;
      }
      try {
        setIsLoading(true);
        const response = await apiClient.get<User>("/auth/me");
        setUser(response);
        setError(null);
      } catch {
        apiClient.clearAuthToken();
        setUser(null);
        setError("Session expired. Please sign in again.");
      } finally {
        setIsLoading(false);
        setAuthReady(true);
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    authReady,
    isAuthenticated: !!user,
    error,
    login,
    register,
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
