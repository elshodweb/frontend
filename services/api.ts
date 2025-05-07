import axios from "axios";
import type { Document, HistoryEntry } from "@/types";

// Create an axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to handle errors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export const getDocument = async (id: string): Promise<Document> => {
  const response = await api.get<ApiResponse<Document>>(`/documents/${id}`);
  return response.data.data;
};

export const getDocumentHistory = async (
  id: string
): Promise<HistoryEntry[]> => {
  const response = await api.get<ApiResponse<HistoryEntry[]>>(
    `/documents/${id}/history`
  );
  return response.data.data;
};

export const approveDocument = async (id: string): Promise<void> => {
  await api.post(`/documents/${id}/approve`);
};

export const rejectDocument = async (id: string): Promise<void> => {
  await api.post(`/documents/${id}/reject`);
};
