import { useState, useCallback } from "react";
import { apiClient, ApiError } from "../utils/api";

export interface PredictionResult {
  disease: string;
  probability: number;
  risk: "low" | "medium" | "high";
  description: string;
  suggestedActions: string[];
}

export interface UseAiPredictionState {
  results: PredictionResult[] | null;
  isLoading: boolean;
  error: ApiError | null;
  analyzeSymptons: (symptoms: string[]) => Promise<void>;
}

export function useAiPrediction(): UseAiPredictionState {
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const analyzeSymptons = useCallback(async (symptoms: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post<PredictionResult[]>("/predictions", {
        symptoms,
      });
      setResults(response);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Failed to analyze symptoms:", apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    analyzeSymptons,
  };
}

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp?: string;
}

export interface UseAiChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: ApiError | null;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

export function useAiChat(): UseAiChatState {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message immediately
    const userMessage: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<{ reply: string }>("/chat", {
        message: content,
      });

      const aiMessage: ChatMessage = {
        role: "ai",
        content: response.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      console.error("Failed to get AI response:", apiError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
  };
}
