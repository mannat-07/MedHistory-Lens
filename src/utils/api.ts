/**
 * API Client - Centralized API communication layer
 * Handles all HTTP requests, error handling, and authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP ${response.status}`,
        status: response.status,
      };

      try {
        const data = await response.json();
        error.message = data.detail || data.message || error.message;
        error.code = data.code;
      } catch (_) {
        // Use default error message if response isn't JSON
      }

      throw error;
    }

    try {
      return await response.json();
    } catch (_) {
      return {} as T;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers,
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body?: Record<string, any>): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, body: Record<string, any>): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  clearAuthToken(): void {
    localStorage.removeItem("auth_token");
  }

  hasAuthToken(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiClient = new ApiClient();

// ============ AUTH ENDPOINTS ============
export const login = async (email: string, password: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

export const register = async (name: string, email: string, password: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
};

export const getMe = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const logout = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// ============ DASHBOARD ENDPOINTS ============
export const getMetrics = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/dashboard`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const saveMetrics = async (data: any, token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/health/metrics`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response.json();
};

// ============ HEALTH DATA ENDPOINTS ============
export const getBloodMetrics = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/health/blood`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const getHeartMetrics = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/health/heart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const getOrganMetrics = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/health/organs`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const getNutritionMetrics = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/health/nutrition`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// ============ CHAT ENDPOINTS ============
export const sendMessage = async (message: string, token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });
  return response.json();
};

export const getChatHistory = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/chat/history`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// ============ REPORTS ENDPOINTS ============
export const uploadReport = async (file: File, token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const form = new FormData();
  form.append('file', file);
  
  const response = await fetch(`${API_URL}/api/reports/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  });
  return response.json();
};

export const updateReport = async (reportId: number, file: File, token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const form = new FormData();
  form.append('file', file);
  
  const response = await fetch(`${API_URL}/api/reports/${reportId}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: form
  });
  return response.json();
};

// ============ SYMPTOMS & PREDICTIONS ENDPOINTS ============
export const analyzeSymptoms = async (symptoms: string[], token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/predictions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ symptoms })
  });
  return response.json();
};

// ============ DIET PLAN ENDPOINTS ============
export const getDietPlan = async (token: string) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const response = await fetch(`${API_URL}/api/diet-plan`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
