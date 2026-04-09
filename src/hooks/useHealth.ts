import { useState, useEffect } from "react";
import { apiClient } from "../utils/api";

export interface HealthCategory {
  category: string;
  data: Record<string, any>;
  isLoading: boolean;
  error: string | null;
}

export interface Prediction {
  disease: string;
  probability: number;
  risk: "low" | "medium" | "high";
  description: string;
  suggestedActions: string[];
}

export interface Report {
  id: number;
  date: string;
  title: string;
  doctor: string;
  status: string;
}

// Fetch health data by category (blood, heart, organs, nutrition)
export function useHealthCategory(category: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/health/${category}`);
        setData(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch health data");
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchData();
    }
  }, [category]);

  return { data, isLoading, error };
}

// Fetch predictions from AI
export function usePredictions() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPredictions = async (symptoms: string[]) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post(`/predictions`, { symptoms });
      setPredictions(response);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to get predictions");
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { predictions, isLoading, error, getPredictions };
}

// Fetch medical reports
export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`/reports`);
        setReports(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch reports");
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reports, isLoading, error };
}
