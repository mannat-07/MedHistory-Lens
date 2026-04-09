import { useState, useCallback, useEffect } from "react";
import { apiClient, ApiError } from "../utils/api";

export interface DashboardData {
  glucose: number;
  hba1c: string;
  cholesterol: number;
  diabetesRisk: number;
  heartDiseaseRisk: number;
  trends: Array<{ date: string; value: number }>;
  metricTrends?: {
    glucose?: Array<{ date: string; value: number }>;
    cholesterol?: Array<{ date: string; value: number }>;
    hba1c?: Array<{ date: string; value: number }>;
  };
  doctorSummary?: string;
  healthTrendMessage?: string;
  alerts: Array<{ name: string; value: string; range: string; status: "warning" | "danger" }>;
}

export interface UseDashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useDashboard(): UseDashboardState {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<DashboardData>("/health/dashboard");
      setData(response);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Failed to fetch dashboard:", apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}

export interface HealthCategoryData {
  bloodCounts?: {
    wbc: number;
    rbc: number;
    hemoglobin: number;
    platelets: number;
  };
  heart?: {
    ldl: number;
    hdl: number;
    totalCholesterol: number;
  };
  organs?: {
    glucose: number;
    creatinine: number;
    alt: number;
  };
  nutrition?: {
    vitaminD: number;
    vitaminB12: number;
    iron: number;
  };
  trends: Array<any>;
}

export interface UseHealthDataState {
  data: HealthCategoryData | null;
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export function useHealthData(category: "blood" | "heart" | "organs" | "nutrition"): UseHealthDataState {
  const [data, setData] = useState<HealthCategoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchHealthData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<HealthCategoryData>(`/health/${category}`);
      setData(response);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error(`Failed to fetch ${category} data:`, apiError);
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchHealthData,
  };
}
